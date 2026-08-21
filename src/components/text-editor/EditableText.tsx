"use client";

import { useState, useRef, useEffect } from "react";
import { siteText } from "@/lib/siteText";
import { useSiteTextStore } from "@/hooks/useSiteText";
import { useStaffSession } from "@/hooks/useStaffSession";

interface EditableTextProps {
  textKey: string;
  children: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "div" | "label";
  className?: string;
}

export default function EditableText({
  textKey,
  children,
  as = "span",
  className = "",
}: EditableTextProps) {
  useSiteTextStore();
  const { role, staffId } = useStaffSession();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  siteText.registerDefault(textKey, children);
  const value = siteText.get(textKey, children);
  const isAdmin = role === "admin";
  const editMode = siteText.isEditMode() && isAdmin;

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = async () => {
    setEditing(false);
    if (draft !== value) {
      await siteText.setValue(textKey, draft, staffId);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className="rounded border-2 border-blue-500 bg-white px-1 text-inherit"
      />
    );
  }

  const Tag = as;
  return (
    <Tag
      className={`${className} ${
        editMode ? "cursor-text rounded outline outline-2 outline-dashed outline-amber-400" : ""
      }`}
      title={editMode ? `Double-click to edit • ${textKey}` : undefined}
      onDoubleClick={
        editMode
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              setDraft(value);
              setEditing(true);
            }
          : undefined
      }
    >
      {value}
    </Tag>
  );
}