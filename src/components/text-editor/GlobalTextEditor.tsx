"use client";

import dynamic from "next/dynamic";

const TextEditorMount = dynamic(() => import("./TextEditorMount"), { ssr: false });

export default function GlobalTextEditor() {
  return <TextEditorMount />;
}