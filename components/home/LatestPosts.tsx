import Link from "next/link";
import PostTile from "@/components/blog/PostTile";
import { getAllPosts } from "@/lib/blog";
import { GRID_TILTS } from "@/lib/motion";

const LATEST_COUNT = 3;

/** The newest posts as tiles. Renders nothing while the blog is empty. */
export default function LatestPosts() {
  const posts = getAllPosts().slice(0, LATEST_COUNT);
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="latest-posts" className="px-6 py-24 sm:px-10">
      <div className="text-center">
        <h2 id="latest-posts" className="font-display text-section uppercase leading-none">
          Latest Posts
        </h2>
        <p className="mt-3 text-[15px]">Notes on building, training and learning.</p>
      </div>

      <ul className="mx-auto mt-14 grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <PostTile post={post} tilt={GRID_TILTS[i % GRID_TILTS.length]} />
          </li>
        ))}
      </ul>

      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-label transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          All posts →
        </Link>
      </div>
    </section>
  );
}
