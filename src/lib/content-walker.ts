/**
 * Zero-instrumentation DOM walker for the live text editor.
 *
 * Discovers editable text nodes and attributes anywhere in a subtree without
 * requiring components to opt in. Each candidate gets a stable key derived
 * from its route, element role, and text — so the same visible string on the
 * same page always resolves to the same override row, across browsers and
 * sessions, with no shared coordination needed.
 */

export type TextEditableCandidate = {
  kind: "text";
  node: Text;
  host: Element;
  key: string;
  original: string;
};

export type AttributeEditableCandidate = {
  kind: "attribute";
  node: Element;
  host: Element;
  attrName: string;
  key: string;
  original: string;
};

export type EditableCandidate = TextEditableCandidate | AttributeEditableCandidate;

export const ATTR_TARGETS = ["placeholder", "aria-label", "title", "alt"] as const;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NUMERIC_RE = /^\d+$/;
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "SVG", "NOSCRIPT", "TEXTAREA", "IFRAME"]);

/** Collapses UUID/numeric route segments to `:id` so the same static label on
 * every `/case/[id]` page resolves to one shared override row. */
export function normalizeRoute(pathname: string): string {
  const normalized = pathname
    .split("/")
    .map((segment) => (segment && (UUID_RE.test(segment) || NUMERIC_RE.test(segment)) ? ":id" : segment))
    .join("/");
  return normalized || "/";
}

function fnv1a(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

function hashKey(route: string, role: string, text: string, occurrence: number): string {
  return `t_${fnv1a(`${route}|${role}|${normalizeText(text)}|${occurrence}`)}`;
}

function isWhitespaceOnly(text: string): boolean {
  return text.trim().length === 0;
}

function isPureNumeric(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length > 0 && /^[\d.,%$\s-]+$/.test(trimmed);
}

function isSkippable(el: Element | null): boolean {
  let current: Element | null = el;
  while (current) {
    if (SKIP_TAGS.has(current.tagName)) return true;
    if (current.hasAttribute("data-no-edit")) return true;
    if (current.hasAttribute("data-content-editing")) return true;
    if (current.hasAttribute("data-dyad-ui")) return true;
    current = current.parentElement;
  }
  return false;
}

// A node keeps the key it was first resolved with for as long as it exists in
// the DOM, even if its text is later overwritten with an override value. This
// avoids the "stale key" trap where re-hashing overridden text would derive a
// different key than the one already stored.
const textKeyCache = new WeakMap<Text, { key: string; original: string }>();
const attrKeyCache = new WeakMap<Element, Map<string, { key: string; original: string }>>();

/** True when a text node is the sole child of its host element, i.e. it's
 * safe to make the host itself `contenteditable` without risking sibling
 * (mixed) content getting swept into the edit. */
export function isSimpleEditTarget(candidate: TextEditableCandidate): boolean {
  return candidate.host.childNodes.length === 1 && candidate.host.firstChild === candidate.node;
}

export function walk(root: Element, pathname: string): EditableCandidate[] {
  const route = normalizeRoute(pathname);
  const candidates: EditableCandidate[] = [];
  const occurrenceCounts = new Map<string, number>();

  function nextOccurrence(sig: string): number {
    const n = occurrenceCounts.get(sig) ?? 0;
    occurrenceCounts.set(sig, n + 1);
    return n;
  }

  function registerAttrCandidate(el: Element, attrName: string, value: string) {
    const role = `${el.tagName.toLowerCase()}@${attrName}`;
    const sig = `${role}|${normalizeText(value)}`;
    const occurrence = nextOccurrence(sig);

    let perElement = attrKeyCache.get(el);
    if (!perElement) {
      perElement = new Map();
      attrKeyCache.set(el, perElement);
    }
    let resolved = perElement.get(attrName);
    if (!resolved) {
      resolved = { key: hashKey(route, role, value, occurrence), original: value };
      perElement.set(attrName, resolved);
    }
    candidates.push({
      kind: "attribute",
      node: el,
      host: el,
      attrName,
      key: resolved.key,
      original: resolved.original,
    });
  }

  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = (node as Text).parentElement;
      if (!parent || isSkippable(parent)) return NodeFilter.FILTER_REJECT;
      const text = node.textContent ?? "";
      if (isWhitespaceOnly(text) || isPureNumeric(text)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let textNode = textWalker.nextNode() as Text | null;
  while (textNode) {
    const host = textNode.parentElement as Element;
    const role = host.tagName.toLowerCase();
    const text = textNode.textContent ?? "";
    const sig = `${role}|${normalizeText(text)}`;
    const occurrence = nextOccurrence(sig);

    let resolved = textKeyCache.get(textNode);
    if (!resolved) {
      resolved = { key: hashKey(route, role, text, occurrence), original: text };
      textKeyCache.set(textNode, resolved);
    }
    candidates.push({ kind: "text", node: textNode, host, key: resolved.key, original: resolved.original });
    textNode = textWalker.nextNode() as Text | null;
  }

  const elementWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      return isSkippable(node as Element) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });

  let el = elementWalker.nextNode() as Element | null;
  while (el) {
    for (const attrName of ATTR_TARGETS) {
      const value = el.getAttribute(attrName);
      if (value && !isWhitespaceOnly(value)) {
        registerAttrCandidate(el, attrName, value);
      }
    }
    if (el instanceof HTMLInputElement && (el.type === "submit" || el.type === "button") && el.value) {
      registerAttrCandidate(el, "value", el.value);
    }
    el = elementWalker.nextNode() as Element | null;
  }

  return candidates;
}

/** Resolves the exact text-node candidate under a viewport point, so a
 * double-click inside a mixed-content element (e.g. text plus a nested span)
 * edits only the specific run that was clicked. */
export function resolveTextCandidateAtPoint(
  x: number,
  y: number,
  candidates: EditableCandidate[]
): TextEditableCandidate | null {
  if (typeof document.caretRangeFromPoint !== "function") return null;
  const range = document.caretRangeFromPoint(x, y);
  const node = range?.startContainer;
  if (!node || node.nodeType !== Node.TEXT_NODE) return null;
  const match = candidates.find((c) => c.kind === "text" && c.node === node);
  return (match as TextEditableCandidate | undefined) ?? null;
}
