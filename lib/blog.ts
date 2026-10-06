import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * The blog.
 *
 * One post is one Markdown file in content/blog. The file name is the URL
 * slug; the front matter carries title, date (YYYY-MM-DD) and summary, and
 * `draft: true` keeps a post out of production builds. Publishing is
 * committing the file.
 *
 * Posts are written by the site owner and committed to the repo, so the
 * rendered HTML is trusted and not sanitised.
 */

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  draft: boolean;
};

export type Post = PostMeta & { html: string };

type Options = { dir?: string; includeDrafts?: boolean };

export const BLOG_DIR = join(process.cwd(), "content", "blog");

const SLUG = /^[a-z0-9-]+$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function requireString(slug: string, field: string, value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`content/blog/${slug}.md: missing "${field}" in front matter`);
  }
  return value.trim();
}

function isRealDate(text: string): boolean {
  const date = new Date(`${text}T00:00:00Z`);
  return ISO_DATE.test(text) && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text;
}

/** YAML turns an unquoted 2026-10-06 into a Date; bring it back to text. */
function toIsoDate(slug: string, value: unknown, source: string): string {
  // YAML rolls 2026-02-30 over to 2026-03-02, so read the date as written.
  const written = source.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m)?.[1];
  const text = value instanceof Date ? (written ?? "") : value;
  if (typeof text !== "string" || !isRealDate(text)) {
    throw new Error(`content/blog/${slug}.md: "date" must be YYYY-MM-DD`);
  }
  return text;
}

export function parsePost(slug: string, source: string): Post {
  const { data, content } = matter(source);
  return {
    slug,
    title: requireString(slug, "title", data.title),
    date: toIsoDate(slug, data.date, source),
    summary: requireString(slug, "summary", data.summary),
    draft: data.draft === true,
    html: marked.parse(content, { async: false }),
  };
}

function resolve(options: Options = {}) {
  return {
    dir: options.dir ?? BLOG_DIR,
    includeDrafts: options.includeDrafts ?? process.env.NODE_ENV !== "production",
  };
}

function readPost(dir: string, slug: string): Post {
  return parsePost(slug, readFileSync(join(/*turbopackIgnore: true*/ dir, `${slug}.md`), "utf8"));
}

export function getAllPosts(options?: Options): PostMeta[] {
  const { dir, includeDrafts } = resolve(options);
  if (!existsSync(/*turbopackIgnore: true*/ dir)) return [];

  return readdirSync(/*turbopackIgnore: true*/ dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.slice(0, -3);
      if (!SLUG.test(slug)) {
        throw new Error(`content/blog/${file}: file name must be lowercase letters, digits and hyphens`);
      }
      return readPost(dir, slug);
    })
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({ slug: post.slug, title: post.title, date: post.date, summary: post.summary, draft: post.draft }));
}

export function getPost(slug: string, options?: Options): Post | null {
  const { dir, includeDrafts } = resolve(options);
  if (!SLUG.test(slug) || !existsSync(join(dir, `${slug}.md`))) return null;

  const post = readPost(dir, slug);
  return includeDrafts || !post.draft ? post : null;
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
