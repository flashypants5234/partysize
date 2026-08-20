import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/config";

// ─── SSG ──────────────────────────────────────────────────────
export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

// ─── Per-page SEO ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Minimal markdown-ish renderer ────────────────────────────
// Converts headings, code blocks, and paragraphs without adding a
// heavy markdown dependency. Sufficient for the demo content.
function renderContent(raw: string) {
  const lines = raw.split("\n");
  const output: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      output.push(
        <pre
          key={key++}
          className="bg-neutral-50 border border-neutral-200 rounded-xl p-5 overflow-x-auto text-sm font-mono text-neutral-800 my-6"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      output.push(
        <h2
          key={key++}
          className="text-xl font-bold tracking-tight mt-10 mb-3 text-neutral-900"
        >
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      output.push(
        <h3
          key={key++}
          className="text-lg font-semibold mt-8 mb-2 text-neutral-900"
        >
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Numbered list item
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      output.push(
        <ol key={key++} className="list-decimal pl-6 my-4 space-y-1 text-neutral-700">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list item
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].startsWith("- ") || lines[i].startsWith("* "))
      ) {
        items.push(lines[i].slice(2));
        i++;
      }
      output.push(
        <ul key={key++} className="list-disc pl-6 my-4 space-y-1 text-neutral-700">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: inlineMarkdown(item) }} />
          ))}
        </ul>
      );
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph
    output.push(
      <p
        key={key++}
        className="text-neutral-700 leading-relaxed mb-4"
        dangerouslySetInnerHTML={{ __html: inlineMarkdown(line) }}
      />
    );
    i++;
  }
  return output;
}

/** Bold and inline-code rendering */
function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="bg-neutral-100 rounded px-1 py-0.5 text-sm font-mono">$1</code>');
}

// ─── Page ─────────────────────────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost =
    currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <nav className="text-sm text-neutral-400 mb-8" aria-label="Breadcrumb">
        <Link href="/blog" className="hover:text-neutral-700 transition">
          Blog
        </Link>{" "}
        <span aria-hidden="true">›</span>{" "}
        <span className="text-neutral-700 line-clamp-1">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-neutral-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
          {post.tags.map((t) => (
            <span key={t} className="bg-neutral-100 rounded-full px-2.5 py-0.5">
              {t}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          {post.title}
        </h1>
        <p className="text-neutral-600 text-lg leading-relaxed">{post.excerpt}</p>
      </header>

      <hr className="border-neutral-100 mb-10" />

      {/* Body */}
      <div className="prose-equivalent">{renderContent(post.content)}</div>

      <hr className="border-neutral-100 mt-14 mb-10" />

      {/* Prev / Next */}
      <nav
        className="flex items-center justify-between gap-4"
        aria-label="Post navigation"
      >
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="group flex flex-col items-start"
          >
            <span className="text-xs text-neutral-400 mb-1">← Previous</span>
            <span className="text-sm font-semibold group-hover:underline line-clamp-2">
              {prevPost.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="group flex flex-col items-end text-right"
          >
            <span className="text-xs text-neutral-400 mb-1">Next →</span>
            <span className="text-sm font-semibold group-hover:underline line-clamp-2">
              {nextPost.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
