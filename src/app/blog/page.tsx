import type { Metadata } from "next";
import Link from "next/link";
import { SITE, BLOG_POSTS } from "@/data/config";

export const metadata: Metadata = {
  title: "Blog",
  description: `Writing on design, engineering, and craft by ${SITE.name}.`,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  return (
    <>
      {/* ── PAGE HEADER ──────────────────────────────────────── */}
      <section className="soft-grad">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-sm font-semibold uppercase tracking-widest accent-text mb-3">
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Writing
          </h1>
          <p className="text-neutral-600 text-lg max-w-xl">
            Occasional essays on design process, engineering craft, and shipping
            things people actually use.
          </p>
        </div>
      </section>

      {/* ── POST LIST ────────────────────────────────────────── */}
      <section className="py-20 border-t border-neutral-100">
        <div className="max-w-3xl mx-auto px-6">
          <ul className="divide-y divide-neutral-100">
            {BLOG_POSTS.map((post) => (
              <li key={post.slug} className="py-8 first:pt-0">
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="flex flex-wrap gap-3 mb-2 text-xs text-neutral-400">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                    {post.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-neutral-100 rounded-full px-2.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold group-hover:accent-text transition mb-2">
                    {post.title}
                  </h2>
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-block text-sm font-medium accent-text group-hover:underline">
                    Read more →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
