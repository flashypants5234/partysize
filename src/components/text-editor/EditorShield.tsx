"use client";

import { useEffect } from "react";

/**
 * Full-viewport, capture-phase click/submit interceptor mounted while edit
 * mode is active. Prevents navigation, form submission, and stray clicks on
 * the frozen page while editing, without blocking scroll or text selection
 * (it never becomes a real click target itself — `pointer-events: none`).
 *
 * Elements belonging to the editor's own UI (toolbar, popovers, or a node
 * currently being edited) are exempted so they keep working normally.
 */
function isEditorUi(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return !!target.closest("[data-dyad-ui], [data-content-editing]");
}

export default function EditorShield() {
  useEffect(() => {
    const intercept = (e: Event) => {
      if (isEditorUi(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const interceptKeydown = (e: KeyboardEvent) => {
      if (isEditorUi(e.target)) return;
      if (e.key === "Escape") return;
      if (e.altKey && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") return;
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("click", intercept, true);
    document.addEventListener("mousedown", intercept, true);
    document.addEventListener("submit", intercept, true);
    document.addEventListener("keydown", interceptKeydown, true);

    return () => {
      document.removeEventListener("click", intercept, true);
      document.removeEventListener("mousedown", intercept, true);
      document.removeEventListener("submit", intercept, true);
      document.removeEventListener("keydown", interceptKeydown, true);
    };
  }, []);

  return <div className="dyad-editor-shield" data-dyad-ui aria-hidden="true" />;
}
