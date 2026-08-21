"use client";

import { useEffect } from "react";
import { trackPageView } from "@/app/portal/actions";

/**
 * Reports the page the client is currently viewing so the assigned worker and
 * admin can see their live location in the case activity panel.
 */
export default function TrackPage({ path }: { path: string }) {
  useEffect(() => {
    void trackPageView(path);
  }, [path]);

  return null;
}
