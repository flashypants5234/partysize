"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteText } from "@/lib/siteText";
import { useSiteTextStore } from "@/hooks/useSiteText";
import { useStaffSession } from "@/hooks/useStaffSession";
import {
  walk,
  isSimpleEditTarget,
  resolveTextCandidateAtPoint,
  type EditableCandidate,
  type TextEditableCandidate,
  type AttributeEditableCandidate,
} from "@/lib/content-walker";
import EditorShield from "./EditorShield";
import EditorToolbar from "./EditorToolbar";

type ActiveEdit =
  | { kind: "in-place"; candidate: TextEditableCandidate }
  | { kind: "overlay"; candidate: TextEditableCandidate; rect: DOMRect }
  | { kind: "attribute"; candidate: AttributeEditableCandidate; rect: DOMRect }
  | null;

export default function TextEditorMount() {
  useSiteTextStore();
  const { role, staffId } = useStaffSession();
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const editMode = siteText.isEditMode() && isAdmin;

  const [showKeys, setShowKeys] = useState(false);
  const [candidates, setCandidates] = useState<EditableCandidate[]>([]);
  const [activeEdit, setActiveEdit] = useState<ActiveEdit>(null);
  const [draft, setDraft] = useState("");
  const [lastKey, setLastKey] = useState<string | null>(null);

  const activeEditRef = useRef<ActiveEdit>(null);
  const cancelActiveEditRef = useRef<() => void>(() => {});
  const taggedHostsRef = useRef<Set<Element>>(new Set());

  function updateActiveEdit(next: ActiveEdit) {
    activeEditRef.current = next;
    setActiveEdit(next);
  }

  // Global hotkey: toggles edit mode. Escape exits edit mode only when not
  // actively editing a string (per-edit Escape handlers own that case).
  useEffect(() => {
    if (!isAdmin) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.altKey && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
        e.preventDefault();
        siteText.toggleEditMode();
      } else if (e.key === "Escape" && siteText.isEditMode() && !activeEditRef.current) {
        siteText.setEditMode(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAdmin]);

  // Cancel any in-progress edit if edit mode is turned off from elsewhere.
  useEffect(() => {
    if (!editMode && activeEditRef.current) {
      cancelActiveEditRef.current();
    }
  }, [editMode]);

  // Recompute editable candidates while edit mode is active.
  useEffect(() => {
    if (!editMode) {
      setCandidates([]);
      return;
    }
    function recompute() {
      setCandidates(walk(document.body, pathname ?? "/"));
    }
    recompute();
    const interval = setInterval(recompute, 800);
    return () => clearInterval(interval);
  }, [editMode, pathname]);

  // Tag/untag host elements so CSS can outline them.
  useEffect(() => {
    if (!editMode) {
      taggedHostsRef.current.forEach((el) => {
        el.removeAttribute("data-dyad-editable");
        el.classList.remove("dyad-editable", "dyad-editable-attr");
      });
      taggedHostsRef.current.clear();
      return;
    }

    const nextHosts = new Set<Element>();
    for (const c of candidates) {
      nextHosts.add(c.host);
      if (c.kind === "text") {
        c.host.setAttribute("data-dyad-editable", "text");
        c.host.classList.add("dyad-editable");
      } else {
        c.host.setAttribute("data-dyad-editable", "attr");
        c.host.classList.add("dyad-editable-attr");
      }
    }

    taggedHostsRef.current.forEach((el) => {
      if (!nextHosts.has(el)) {
        el.removeAttribute("data-dyad-editable");
        el.classList.remove("dyad-editable", "dyad-editable-attr");
      }
    });
    taggedHostsRef.current = nextHosts;
  }, [candidates, editMode]);

  function beginTextEdit(candidate: TextEditableCandidate) {
    if (activeEditRef.current) return;
    setLastKey(candidate.key);

    if (isSimpleEditTarget(candidate)) {
      const host = candidate.host as HTMLElement;
      host.setAttribute("data-content-editing", "true");
      host.setAttribute("contenteditable", "true");
      host.classList.add("dyad-editing");

      const finish = (commit: boolean) => {
        host.removeEventListener("keydown", onKeyDown);
        host.removeEventListener("blur", onBlur);
        host.removeAttribute("data-content-editing");
        host.removeAttribute("contenteditable");
        host.classList.remove("dyad-editing");
        if (commit) {
          const newValue = host.textContent ?? "";
          if (newValue !== siteText.get(candidate.key, candidate.original)) {
            void siteText.setValue(candidate.key, newValue, staffId);
          }
        } else {
          host.textContent = siteText.get(candidate.key, candidate.original);
        }
        updateActiveEdit(null);
      };

      const onKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
          ev.stopPropagation();
          host.blur();
        } else if (ev.key === "Escape") {
          ev.preventDefault();
          ev.stopPropagation();
          finish(false);
        }
      };
      const onBlur = () => finish(true);

      host.addEventListener("keydown", onKeyDown);
      host.addEventListener("blur", onBlur);

      cancelActiveEditRef.current = () => finish(false);
      updateActiveEdit({ kind: "in-place", candidate });

      requestAnimationFrame(() => {
        host.focus();
        const range = document.createRange();
        range.selectNodeContents(host);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      });
    } else {
      const rect = candidate.host.getBoundingClientRect();
      setDraft(candidate.node.textContent ?? "");
      cancelActiveEditRef.current = () => updateActiveEdit(null);
      updateActiveEdit({ kind: "overlay", candidate, rect });
    }
  }

  function commitOverlayEdit() {
    if (!activeEditRef.current || activeEditRef.current.kind !== "overlay") return;
    void siteText.setValue(activeEditRef.current.candidate.key, draft, staffId);
    updateActiveEdit(null);
  }

  function beginAttrEdit(candidate: AttributeEditableCandidate) {
    if (activeEditRef.current) return;
    setLastKey(candidate.key);
    const rect = candidate.host.getBoundingClientRect();
    const value = candidate.node.getAttribute(candidate.attrName) ?? candidate.original;
    setDraft(value);
    cancelActiveEditRef.current = () => updateActiveEdit(null);
    updateActiveEdit({ kind: "attribute", candidate, rect });
  }

  function commitAttrEdit() {
    if (!activeEditRef.current || activeEditRef.current.kind !== "attribute") return;
    void siteText.setValue(activeEditRef.current.candidate.key, draft, staffId);
    updateActiveEdit(null);
  }

  // Double-click anywhere tagged as editable starts an edit for that exact
  // text run (resolved via caretRangeFromPoint) or attribute.
  useEffect(() => {
    if (!editMode) return;

    function handleDblClick(e: MouseEvent) {
      if (activeEditRef.current) return;
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-dyad-ui]")) return;

      const textCandidate = resolveTextCandidateAtPoint(e.clientX, e.clientY, candidates);
      if (textCandidate) {
        e.preventDefault();
        e.stopPropagation();
        beginTextEdit(textCandidate);
        return;
      }

      const attrHost = target.closest('[data-dyad-editable="attr"]');
      if (attrHost) {
        const match = candidates.find(
          (c): c is AttributeEditableCandidate => c.kind === "attribute" && c.host === attrHost
        );
        if (match) {
          e.preventDefault();
          e.stopPropagation();
          beginAttrEdit(match);
        }
      }
    }

    document.addEventListener("dblclick", handleDblClick, true);
    return () => document.removeEventListener("dblclick", handleDblClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, candidates, staffId]);

  async function handleCopyKey() {
    if (!lastKey) return;
    try {
      await navigator.clipboard.writeText(lastKey);
    } catch {
      // Clipboard access can be blocked in some browser contexts; non-critical.
    }
  }

  function handleResetLastKey() {
    if (!lastKey) return;
    void siteText.reset(lastKey, staffId);
  }

  function handleUndo() {
    void siteText.undo(staffId);
  }

  function handleRedo() {
    void siteText.redo(staffId);
  }

  function handleExit() {
    siteText.setEditMode(false);
  }

  if (!editMode) return null;

  const overriddenCount = candidates.filter((c) => siteText.hasOverride(c.key)).length;

  return (
    <>
      <EditorShield />
      <EditorToolbar
        editableCount={candidates.length}
        overriddenCount={overriddenCount}
        showKeys={showKeys}
        onToggleShowKeys={() => setShowKeys((s) => !s)}
        canUndo={siteText.canUndo()}
        canRedo={siteText.canRedo()}
        onUndo={handleUndo}
        onRedo={handleRedo}
        lastKey={lastKey}
        lastKeyHasOverride={lastKey ? siteText.hasOverride(lastKey) : false}
        onCopyKey={handleCopyKey}
        onResetLastKey={handleResetLastKey}
        onExit={handleExit}
      />

      {showKeys &&
        candidates.map((c) => {
          const rect = c.host.getBoundingClientRect();
          return (
            <div
              key={`${c.key}-${c.kind === "attribute" ? c.attrName : "text"}`}
              className="dyad-editor-key-badge"
              data-dyad-ui
              style={{ top: rect.top, left: rect.left }}
            >
              {c.key}
            </div>
          );
        })}

      {activeEdit?.kind === "overlay" && (
        <div
          data-dyad-ui
          style={{
            position: "fixed",
            top: activeEdit.rect.top,
            left: activeEdit.rect.left,
            minWidth: Math.max(activeEdit.rect.width, 220),
            zIndex: 9999,
            background: "#111827",
            padding: 8,
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                commitOverlayEdit();
              } else if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                updateActiveEdit(null);
              }
            }}
            rows={3}
            style={{
              width: "100%",
              fontFamily: "inherit",
              fontSize: "14px",
              borderRadius: 6,
              border: "1px solid #4b5563",
              background: "#1f2937",
              color: "#f9fafb",
              padding: 6,
            }}
          />
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button type="button" onClick={commitOverlayEdit}>
              Save
            </button>
            <button type="button" onClick={() => updateActiveEdit(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeEdit?.kind === "attribute" && (
        <div
          data-dyad-ui
          className="dyad-attr-popover"
          style={{ top: activeEdit.rect.bottom + 6, left: activeEdit.rect.left }}
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                commitAttrEdit();
              } else if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                updateActiveEdit(null);
              }
            }}
          />
          <button type="button" onClick={commitAttrEdit}>
            Save
          </button>
          <button type="button" onClick={() => updateActiveEdit(null)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}