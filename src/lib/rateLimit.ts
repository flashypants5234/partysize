"use client";

import { useCallback, useRef } from "react";

// Blocks rapid repeated submissions without slowing down normal fast typing/work.
export function useRateLimit(minIntervalMs = 2500) {
  const lastRunRef = useRef<number>(0);

  return useCallback((): boolean => {
    const now = Date.now();
    if (now - lastRunRef.current < minIntervalMs) {
      return false;
    }
    lastRunRef.current = now;
    return true;
  }, [minIntervalMs]);
}