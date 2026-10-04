import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import rates from "../../data/rates.json";
import { allLenderLogos, logoBox, LOGO_FRAME, type LogoSize } from "./lenderLogos";

const MAX_BYTES = 15 * 1024;
const CANVAS = { width: 320, height: 80 };

function rasterSize(file: string, bytes: Buffer): { width: number; height: number } {
  if (file.endsWith(".png")) {
    assert.equal(bytes.toString("ascii", 1, 4), "PNG", `${file} is not a PNG`);
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", `${file} is not a WebP`);
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", `${file} is not a WebP`);
  assert.equal(bytes.toString("ascii", 12, 16), "VP8X", `${file} is not an extended WebP`);
  const width = 1 + bytes.readUIntLE(24, 3);
  const height = 1 + bytes.readUIntLE(27, 3);
  return { width, height };
}

test("every lender in the live rate feed has a self-hosted logo on one canvas", () => {
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
    assert.equal(logo.width, CANVAS.width, `${slug} manifest width`);
    assert.equal(logo.height, CANVAS.height, `${slug} manifest height`);
    const filePath = path.join(process.cwd(), "public", "logos", logo.file);
    assert.equal(fs.existsSync(filePath), true, filePath);
    const bytes = fs.readFileSync(filePath);
    assert.ok(bytes.length > 200, `${slug} file is empty`);
    assert.ok(bytes.length <= MAX_BYTES, `${slug} is ${bytes.length} bytes`);

    if (logo.file.endsWith(".svg")) {
      const text = bytes.toString("utf8");
      assert.match(text, /viewBox="0 0 320 80"/, `${slug} viewBox`);
      assert.match(text, /width="320"/, `${slug} svg width`);
      assert.match(text, /height="80"/, `${slug} svg height`);
    } else {
      const size = rasterSize(logo.file, bytes);
      assert.deepEqual(size, CANVAS, `${slug} raster canvas`);
    }
  }

  for (const size of Object.keys(LOGO_FRAME) as LogoSize[]) {
    const box = logoBox(size);
    assert.deepEqual(box, LOGO_FRAME[size]);
    assert.equal(box.width / box.height, CANVAS.width / CANVAS.height, size);
  }
});
