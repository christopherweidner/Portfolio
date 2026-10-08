import Image from "next/image";
import TiltCard from "@/components/ui/TiltCard";
import { formatDate, type PostMeta } from "@/lib/blog";

type Props = {
  post: PostMeta;
  tilt?: number;
  /** h2 on /blog (under the page h1), h3 inside a home section. */
  titleAs?: "h2" | "h3";
};

/** One post as a tile, with its cover on top when it has one. Used by /blog and the home page's latest posts. */
export default function PostTile({ post, tilt = 0, titleAs: Title = "h3" }: Props) {
  return (
    <TiltCard tilt={tilt} href={`/blog/${post.slug}`} className="flex h-full flex-col text-left [--card-bg:var(--ground-soft)]">
      {post.cover ? (
        <div className="relative aspect-[3/2] w-full shrink-0">
          <Image src={post.cover.src} alt={post.cover.alt} fill sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 90vw" className="object-cover" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.14em] text-label">
          {formatDate(post.date)}
        </time>
        <Title className="font-display text-[1.75rem] uppercase leading-[0.95] text-ink">{post.title}</Title>
        <p className="text-[14px] leading-relaxed">{post.summary}</p>
        <span className="mt-auto pt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-blue">Read →</span>
      </div>
    </TiltCard>
  );
}
