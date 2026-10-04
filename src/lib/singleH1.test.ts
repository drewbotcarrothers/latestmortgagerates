import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("..", import.meta.url));

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if ([".tsx", ".astro"].includes(extname(full))) files.push(full);
  }
  return files;
}

function h1Count(source: string): number {
  return (source.match(/<h1[\s>]/g) || []).length;
}

describe("exactly one h1 per page", () => {
  it("does not use an h1 for the site name in any header", () => {
    const header = readFileSync(join(src, "components/Header.tsx"), "utf8");
    const home = readFileSync(join(src, "views/HomePage.tsx"), "utf8");
    assert.equal(h1Count(header), 0);
    assert.match(header, /Latest Mortgage Rates Canada/);
    assert.equal(h1Count(home), 1);
    assert.match(home, /<Header\b/);
    assert.doesNotMatch(home, /<h1[^>]*>[^<]*Latest Mortgage Rates Canada/);
    assert.match(home, /<h1[^>]*>\s*Today's Best Mortgage Rates\s*<\/h1>/);
    for (const file of walk(join(src, "components"))) {
      assert.equal(h1Count(readFileSync(file, "utf8")), 0, file);
    }
  });

  it("gives every page view one h1, except the blog not-found branch", () => {
    const extras: string[] = [];
    const missing: string[] = [];
    for (const file of walk(join(src, "views"))) {
      const source = readFileSync(file, "utf8");
      const count = h1Count(source);
      if (count === 0 && !source.includes("<main")) continue;
      if (file.endsWith("BlogPost.tsx")) {
        assert.equal(count, 2, "article and not-found are alternate renders");
        continue;
      }
      if (count === 0) missing.push(file);
      if (count > 1) extras.push(`${file} (${count})`);
    }
    assert.deepEqual(missing, []);
    assert.deepEqual(extras, []);
  });

  it("does not add an h1 in astro page shells", () => {
    const offenders = walk(join(src, "pages"))
      .concat(walk(join(src, "layouts")))
      .filter((file) => h1Count(readFileSync(file, "utf8")) > 0);
    assert.deepEqual(offenders, []);
  });
});
