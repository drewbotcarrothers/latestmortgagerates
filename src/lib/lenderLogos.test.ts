import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import rates from "../../data/rates.json";
import { allLenderLogos, logoBox } from "./lenderLogos";

const MAX_BYTES = 15 * 1024;

test("every lender in the live rate feed has a self-hosted logo", () => {
  const slugs = [...new Set(rates.map((row) => row.lender_slug))].sort();
  const logos = allLenderLogos();
  const bySlug = new Map(logos.map((logo) => [logo.slug, logo]));

  assert.deepEqual(
    logos.map((logo) => logo.slug).sort(),
    slugs,
    "manifest slugs should match data/rates.json",
  );

  for (const slug of slugs) {
    const logo = bySlug.get(slug);
    assert.ok(logo, slug);
    assert.equal(logo.kind, "logo", `${slug} should be a sourced logo`);
    assert.ok(logo.file, `${slug} missing file`);
    assert.ok(logo.source_url?.startsWith("https://"), `${slug} missing source_url`);
    assert.match(logo.retrieved, /^\d{4}-\d{2}-\d{2}$/);
    const filePath = path.join(process.cwd(), "public", "logos", logo.file);
    assert.equal(fs.existsSync(filePath), true, filePath);
    const size = fs.statSync(filePath).size;
    assert.ok(size > 200, `${slug} file is empty`);
    assert.ok(size <= MAX_BYTES, `${slug} is ${size} bytes`);
    const box = logoBox(logo.width, logo.height, "sm");
    assert.equal(box.height, 28);
    assert.ok(box.width >= 28 && box.width <= 112);
  }
});
