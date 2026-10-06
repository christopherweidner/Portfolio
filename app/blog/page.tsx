import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Christopher Weidner",
  description: "Notes on building software, sport and what I am learning.",
};

export default function Blog() {
  const posts = getAllPosts();

  return (
    <main className="flex-1 px-6 pb-16 pt-12">
      <div className="mx-auto w-full max-w-[68ch]">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">Blog</h1>

        {posts.length === 0 ? (
          <p className="mt-10 text-ink-faint">Nothing here yet.</p>
        ) : (
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
                >
                  <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
                    {formatDate(post.date)}
                  </time>
                  <h2 className="mt-2 font-display text-[1.75rem] uppercase leading-[0.95] transition-colors group-hover:text-blue">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-[15px] leading-relaxed">{post.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
