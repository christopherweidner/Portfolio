import type { Metadata } from "next";
import PostTile from "@/components/blog/PostTile";
import { getAllPosts } from "@/lib/blog";
import { GRID_TILTS } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Blog — Christopher Weidner",
  description: "Notes on building software, sport and what I am learning.",
};

export default function Blog() {
  const posts = getAllPosts();

  return (
    <main className="flex-1 px-6 pb-24 pt-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="reveal font-display text-display uppercase leading-[0.9]">Blog</h1>
        <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed">
          Notes on building software, sport and what I am learning.
        </p>

        {posts.length === 0 ? (
          <p className="mt-14 text-ink-soft">Nothing here yet.</p>
        ) : (
          <ul className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <li key={post.slug}>
                <PostTile post={post} tilt={GRID_TILTS[i % GRID_TILTS.length]} titleAs="h2" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
