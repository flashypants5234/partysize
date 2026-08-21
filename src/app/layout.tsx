import type { Metadata } from "next";
import "./globals.css";
import "@/styles/asset-shield-skin.css";
import "@/styles/case-portal.css";
import "@/styles/text-editor.css";
import ContentProvider from "@/components/text-editor/ContentProvider";
import TextEditorMount from "@/components/text-editor/TextEditorMount";

export const metadata: Metadata = {
  title: "American Shield Insurance (Demo)",
  description:
    "A demo asset-protection platform template. Not a government agency and not affiliated with the FDIC.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased">
        {children}
        <ContentProvider />
        <TextEditorMount />
      </body>
    </html>
  );
}