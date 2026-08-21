"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { walk } from "@/lib/content-walker";
import { siteText } from "@/lib/siteText";
import { useSiteTextStore } from "@/hooks/useSiteText";

/**
 * Mounted for every visitor (not just admins). Discovers editable strings via
 * the DOM walker, applies any live overrides, and keeps them applied across
 * route changes and React re-renders via a debounced MutationObserver.
 */
export default function ContentProvider() {
  const pathname = usePathname();
  const version = useSiteTextStore();
  const observerRef = useRef<MutationObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const applyingRef = useRef(false);

  useEffect(() => {
    function applyAll() {
      if (applyingRef.current) return;
      applyingRef.current = true;
      observerRef.current?.disconnect();

      const candidates = walk(document.body, pathname ?? "/");
      for (const candidate of candidates) {
        siteText.registerOriginal(candidate.key, candidate.original);
        const target = siteText.get(candidate.key, candidate.original);
        if (candidate.kind === "text") {
          if (candidate.node.textContent !== target) candidate.node.textContent = target;
        } else if (candidate.node.getAttribute(candidate.attrName) !== target) {
          candidate.node.setAttribute(candidate.attrName, target);
        }
      }

      observerRef.current?.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["placeholder", "aria-label", "title", "alt"],
      });
      applyingRef.current = false;
    }

    function scheduleApply() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      rafRef.current = requestAnimationFrame(() => {
        timeoutRef.current = setTimeout(applyAll, 50);
      });
    }

    observerRef.current = new MutationObserver(() => {
      if (applyingRef.current) return;
      scheduleApply();
    });

    applyAll();

    return () => {
      observerRef.current?.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname, version]);

  return null;
}
