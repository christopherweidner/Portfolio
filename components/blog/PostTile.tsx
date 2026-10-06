import TiltCard from "@/components/ui/TiltCard";
import { formatDate, type PostMeta } from "@/lib/blog";

type Props = {
  post: PostMeta;
  tilt?: number;
  /** h2 on /blog (under the page h1), h3 inside a home section. */
  titleAs?: "h2" | "h3";
};

/** One post as a tile. Used by /blog and the home page's latest posts. */
export default function PostTile({ post, tilt = 0, titleAs: Title = "h3" }: Props) {
  return (
    <TiltCard tilt={tilt} href={`/blog/${post.slug}`} className="flex h-full flex-col gap-3 p-6 text-left [--card-bg:var(--ground-soft)]">
      <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
        {formatDate(post.date)}
      </time>
      <Title className="font-display text-[1.75rem] uppercase leading-[0.95] text-ink">{post.title}</Title>
      <p className="text-[14px] leading-relaxed">{post.summary}</p>
      <span className="mt-auto pt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-blue">Read →</span>
    </TiltCard>
  );
}
