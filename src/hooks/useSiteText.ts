"use client";

import { useEffect, useSyncExternalStore } from "react";
import { siteText } from "@/lib/siteText";

export function useSiteTextStore() {
  useEffect(() => {
    siteText.load();
  }, []);

  return useSyncExternalStore(
    (cb) => siteText.subscribe(cb),
    () => siteText.version(),
    () => 0
  );
}

export function useSiteTextValue(key: string, fallback: string) {
  useSiteTextStore();
  siteText.registerDefault(key, fallback);
  return siteText.get(key, fallback);
}