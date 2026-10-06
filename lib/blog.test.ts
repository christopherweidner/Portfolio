import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { formatDate, getAllPosts, getPost, parsePost } from "./blog";

const post = (fm: string, body = "Hello **world**.") => `---\n${fm}\n---\n\n${body}\n`;

const fixtures: string[] = [];
afterAll(() => {
  for (const dir of fixtures) rmSync(dir, { recursive: true, force: true });
});

function fixtureDir(files: Record<string, string>): string {
  const dir = mkdtempSync(join(tmpdir(), "blog-"));
  fixtures.push(dir);
  for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
  return dir;
}

describe("parsePost", () => {
  it("reads front matter and renders markdown", () => {
    const p = parsePost("first", post('title: First\ndate: 2026-10-06\nsummary: "A start."'));
    expect(p).toMatchObject({ slug: "first", title: "First", date: "2026-10-06", summary: "A start.", draft: false });
    expect(p.html).toContain("<strong>world</strong>");
  });

  it("keeps an unquoted YAML date as YYYY-MM-DD", () => {
    expect(parsePost("d", post("title: D\ndate: 2026-01-02\nsummary: S")).date).toBe("2026-01-02");
  });

  it("names the file when a field is missing", () => {
    expect(() => parsePost("broken", post("title: X\ndate: 2026-10-06"))).toThrow(/broken\.md.*summary/);
  });

  it("rejects an impossible calendar date", () => {
    expect(() => parsePost("bad", post("title: X\ndate: 2026-02-30\nsummary: S"))).toThrow(/bad\.md.*"date" must be YYYY-MM-DD/);
    expect(() => parsePost("bad", post('title: X\ndate: "2026-13-45"\nsummary: S'))).toThrow(/"date" must be YYYY-MM-DD/);
  });

  it("rejects a malformed date", () => {
    expect(() => parsePost("bad", post("title: X\ndate: 6.10.2026\nsummary: S"))).toThrow(/bad\.md.*date/);
  });

  it("reads draft: true", () => {
    expect(parsePost("d", post("title: D\ndate: 2026-01-02\nsummary: S\ndraft: true")).draft).toBe(true);
  });
});

describe("getAllPosts / getPost", () => {
  const dir = fixtureDir({
    "older.md": post("title: Older\ndate: 2025-05-01\nsummary: O"),
    "newer.md": post("title: Newer\ndate: 2026-02-01\nsummary: N"),
    "secret.md": post("title: Secret\ndate: 2026-09-01\nsummary: S\ndraft: true"),
    "notes.txt": "ignored",
  });

  it("lists posts newest first without drafts", () => {
    expect(getAllPosts({ dir, includeDrafts: false }).map((p) => p.slug)).toEqual(["newer", "older"]);
  });

  it("includes drafts when asked", () => {
    expect(getAllPosts({ dir, includeDrafts: true }).map((p) => p.slug)).toEqual(["secret", "newer", "older"]);
  });

  it("finds a post by slug", () => {
    expect(getPost("newer", { dir, includeDrafts: false })?.title).toBe("Newer");
  });

  it("returns null for unknown, hidden-draft or unsafe slugs", () => {
    expect(getPost("missing", { dir, includeDrafts: false })).toBeNull();
    expect(getPost("secret", { dir, includeDrafts: false })).toBeNull();
    expect(getPost("../package", { dir, includeDrafts: true })).toBeNull();
  });

  it("throws on a file name that is not a valid slug", () => {
    const bad = fixtureDir({ "My Post.md": post("title: T\ndate: 2026-01-01\nsummary: S") });
    expect(() => getAllPosts({ dir: bad })).toThrow(/My Post\.md.*lowercase letters, digits and hyphens/);
  });

  it("returns an empty list when the folder does not exist", () => {
    expect(getAllPosts({ dir: join(dir, "nope") })).toEqual([]);
  });
});

describe("formatDate", () => {
  it("formats in British English, independent of timezone", () => {
    expect(formatDate("2026-10-06")).toBe("6 October 2026");
  });
});
