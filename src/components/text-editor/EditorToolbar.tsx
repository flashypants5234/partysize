"use client";

interface EditorToolbarProps {
  editableCount: number;
  overriddenCount: number;
  showKeys: boolean;
  onToggleShowKeys: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  lastKey: string | null;
  lastKeyHasOverride: boolean;
  onCopyKey: () => void;
  onResetLastKey: () => void;
  onExit: () => void;
}

export default function EditorToolbar({
  editableCount,
  overriddenCount,
  showKeys,
  onToggleShowKeys,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  lastKey,
  lastKeyHasOverride,
  onCopyKey,
  onResetLastKey,
  onExit,
}: EditorToolbarProps) {
  return (
    <div className="dyad-editor-toolbar" data-dyad-ui role="toolbar" aria-label="Live text editor">
      <span className="dyad-badge">
        {editableCount} editable · {overriddenCount} overridden
      </span>
      <button type="button" aria-label="Undo" onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>
      <button type="button" aria-label="Redo" onClick={onRedo} disabled={!canRedo}>
        Redo
      </button>
      <button type="button" aria-label="Toggle key labels" onClick={onToggleShowKeys}>
        {showKeys ? "Hide keys" : "Show keys"}
      </button>
      <button type="button" aria-label="Copy key of last edited string" onClick={onCopyKey} disabled={!lastKey}>
        Copy key
      </button>
      <button
        type="button"
        aria-label="Reset this string to its original text"
        onClick={onResetLastKey}
        disabled={!lastKey || !lastKeyHasOverride}
      >
        Reset this string
      </button>
      <button type="button" aria-label="Exit edit mode" onClick={onExit}>
        Exit
      </button>
    </div>
  );
}
