import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";

/** Only the generated slugs exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return { title: `${post.title} — Christopher Weidner`, description: post.summary };
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  return (
    <main className="flex-1 px-6 pb-16 pt-12">
      <article className="mx-auto w-full max-w-[68ch]">
        <Link
          href="/blog"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-label transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          ← All posts
        </Link>

        <header className="mt-8">
          <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
            {formatDate(post.date)}
          </time>
          <h1 className="reveal mt-3 font-display text-display uppercase leading-[0.92]">{post.title}</h1>
        </header>

        <div className="prose-post mt-10" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}
