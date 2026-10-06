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

/** YAML turns an unquoted 2026-10-06 into a Date; bring it back to text. */
function toIsoDate(slug: string, value: unknown): string {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (typeof text !== "string" || !ISO_DATE.test(text)) {
    throw new Error(`content/blog/${slug}.md: "date" must be YYYY-MM-DD`);
  }
  return text;
}

export function parsePost(slug: string, source: string): Post {
  const { data, content } = matter(source);
  return {
    slug,
    title: requireString(slug, "title", data.title),
    date: toIsoDate(slug, data.date),
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
  return parsePost(slug, readFileSync(join(dir, `${slug}.md`), "utf8"));
}

export function getAllPosts(options?: Options): PostMeta[] {
  const { dir, includeDrafts } = resolve(options);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readPost(dir, file.slice(0, -3)))
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
