"use client";

import { supabase } from "@/integrations/supabase/client";

type Listener = () => void;

interface HistoryEntry {
  key: string;
  previous: string | null;
  next: string | null;
}

export interface SiteTextEntry {
  key: string;
  value: string;
  original: string | null;
  updatedAt: string | null;
  updatedByName: string | null;
}

export interface SiteTextHistoryEntry {
  id: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: string;
  changedByName: string | null;
}

class SiteTextStore {
  private overrides = new Map<string, string>();
  private defaults = new Map<string, string>();
  private originals = new Map<string, string>();
  private meta = new Map<string, { updatedAt: string | null; updatedByName: string | null }>();
  private listeners = new Set<Listener>();
  private undoStack: HistoryEntry[] = [];
  private redoStack: HistoryEntry[] = [];
  private loaded = false;
  private editMode = false;
  private _version = 0;

  version() {
    return this._version;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this._version += 1;
    this.listeners.forEach((l) => l());
  }

  registerDefault(key: string, fallback: string) {
    if (!this.defaults.has(key)) this.defaults.set(key, fallback);
  }

  getDefault(key: string) {
    return this.defaults.get(key) ?? "";
  }

  /** Records the original (pre-override) string discovered by the DOM
   * walker, so the admin panel can show what a key used to say. */
  registerOriginal(key: string, original: string) {
    if (!this.originals.has(key)) this.originals.set(key, original);
  }

  getAllKeys() {
    return Array.from(new Set([...this.defaults.keys(), ...this.overrides.keys()])).sort();
  }

  /** Rows for the admin Site Text management panel. */
  getEntries(): SiteTextEntry[] {
    return Array.from(this.overrides.entries())
      .map(([key, value]) => ({
        key,
        value,
        original: this.originals.get(key) ?? null,
        updatedAt: this.meta.get(key)?.updatedAt ?? null,
        updatedByName: this.meta.get(key)?.updatedByName ?? null,
      }))
      .sort((a, b) => (a.updatedAt && b.updatedAt ? (a.updatedAt > b.updatedAt ? -1 : 1) : 0));
  }

  async fetchHistory(key: string): Promise<SiteTextHistoryEntry[]> {
    const { data } = await supabase
      .from("site_text_history")
      .select("id, old_value, new_value, changed_at, staff_profiles(display_name)")
      .eq("key", key)
      .order("changed_at", { ascending: false })
      .limit(20);

    return ((data ?? []) as unknown as Array<{
      id: string;
      old_value: string | null;
      new_value: string | null;
      changed_at: string;
      staff_profiles: { display_name: string | null } | { display_name: string | null }[] | null;
    }>).map((row) => {
      const author = Array.isArray(row.staff_profiles) ? row.staff_profiles[0] : row.staff_profiles;
      return {
        id: row.id,
        oldValue: row.old_value,
        newValue: row.new_value,
        changedAt: row.changed_at,
        changedByName: author?.display_name ?? null,
      };
    });
  }

  get(key: string, fallback: string) {
    return this.overrides.get(key) ?? fallback;
  }

  hasOverride(key: string) {
    return this.overrides.has(key);
  }

  isEditMode() {
    return this.editMode;
  }

  setEditMode(next: boolean) {
    this.editMode = next;
    this.emit();
  }

  toggleEditMode() {
    this.setEditMode(!this.editMode);
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  async load() {
    if (this.loaded) return;
    this.loaded = true;

    const { data } = await supabase
      .from("site_text_overrides")
      .select("key, value, updated_at, staff_profiles(display_name)");
    ((data ?? []) as unknown as Array<{
      key: string;
      value: string;
      updated_at: string;
      staff_profiles: { display_name: string | null } | { display_name: string | null }[] | null;
    }>).forEach((row) => {
      this.overrides.set(row.key, row.value);
      const author = Array.isArray(row.staff_profiles) ? row.staff_profiles[0] : row.staff_profiles;
      this.meta.set(row.key, { updatedAt: row.updated_at, updatedByName: author?.display_name ?? null });
    });
    this.emit();

    supabase
      .channel("site_text_overrides_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_text_overrides" },
        (payload) => {
          const newRow = payload.new as { key?: string; value?: string; updated_at?: string } | null;
          const oldRow = payload.old as { key?: string } | null;
          if (payload.eventType === "DELETE" && oldRow?.key) {
            this.overrides.delete(oldRow.key);
            this.meta.delete(oldRow.key);
          } else if (newRow?.key && typeof newRow.value === "string") {
            this.overrides.set(newRow.key, newRow.value);
            const existing = this.meta.get(newRow.key);
            this.meta.set(newRow.key, {
              updatedAt: newRow.updated_at ?? existing?.updatedAt ?? null,
              updatedByName: existing?.updatedByName ?? null,
            });
          }
          this.emit();
        }
      )
      .subscribe();
  }

  private async persist(key: string, value: string | null, staffId: string | null) {
    const previous = this.overrides.get(key) ?? null;

    if (value === null) {
      this.overrides.delete(key);
      this.emit();
      await supabase.from("site_text_overrides").delete().eq("key", key);
    } else {
      this.overrides.set(key, value);
      this.emit();
      await supabase
        .from("site_text_overrides")
        .upsert({ key, value, updated_at: new Date().toISOString(), updated_by: staffId });
    }

    await supabase.from("site_text_history").insert({
      key,
      old_value: previous,
      new_value: value,
      changed_by: staffId,
    });
  }

  async setValue(key: string, value: string, staffId: string | null) {
    const previous = this.overrides.get(key) ?? null;
    if (previous === value) return;
    this.undoStack.push({ key, previous, next: value });
    this.redoStack = [];
    await this.persist(key, value, staffId);
  }

  async reset(key: string, staffId: string | null) {
    if (!this.overrides.has(key)) return;
    const previous = this.overrides.get(key) ?? null;
    this.undoStack.push({ key, previous, next: null });
    this.redoStack = [];
    await this.persist(key, null, staffId);
  }

  async undo(staffId: string | null) {
    const entry = this.undoStack.pop();
    if (!entry) return;
    this.redoStack.push(entry);
    await this.persist(entry.key, entry.previous, staffId);
  }

  async redo(staffId: string | null) {
    const entry = this.redoStack.pop();
    if (!entry) return;
    this.undoStack.push(entry);
    await this.persist(entry.key, entry.next, staffId);
  }
}

export const siteText = new SiteTextStore();