import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("mortgage calculator YouTube embed", () => {
  const component = read("src/components/YouTubeEmbed.astro");
  const page = read("src/pages/tools/mortgage-calculator/index.astro");
  const view = read("src/views/tools/mortgage-calculator/Page.tsx");

  it("uses a click-to-load nocookie facade with a title and VideoObject fields", () => {
    assert.match(page, /videoId="OLVOwq72A7o"/);
    assert.match(page, /Watch: how to use the mortgage payment calculator/);
    assert.match(page, /Mortgage Payment Calculator Demo: \$600,000 Home, 20% Down \(Canada\)/);
    assert.match(page, /uploadDate="2026-10-14"/);
    assert.match(page, /thumbnailUrl="https:\/\/i\.ytimg\.com\/vi\/OLVOwq72A7o\/maxresdefault\.jpg"/);
    assert.match(page, /embedUrl="https:\/\/www\.youtube-nocookie\.com\/embed\/OLVOwq72A7o"/);
    assert.match(page, /contentUrl="https:\/\/www\.youtube\.com\/watch\?v=OLVOwq72A7o"/);
    assert.match(page, /<YouTubeEmbed[\s\S]*\/>/);

    assert.match(component, /VideoObject/);
    assert.match(component, /youtube-nocookie\.com\/embed\//);
    assert.match(component, /loading="lazy"/);
    assert.match(component, /title=\{safeTitle\}/);
    assert.match(component, /data-youtube-embed/);
    assert.match(component, /<button/);

    const withoutTemplate = component.replace(/<template>[\s\S]*?<\/template>/, "");
    assert.doesNotMatch(withoutTemplate, /<iframe/);
    assert.match(component, /<template>[\s\S]*src=\{iframeSrc\}[\s\S]*<\/template>/);
    assert.match(component, /const iframeSrc = `\$\{embedUrl\}\?autoplay=1`;/);
    assert.doesNotMatch(component, /preconnect|iframe_api|youtube\.com\/embed\//);
  });

  it("places the embed after the guide and clear of the sidebar ad", () => {
    const ad = view.indexOf("<AdUnit");
    const slot = view.indexOf("data-calculator-video");
    const related = view.indexOf("<CalculatorRelatedTools");
    const footer = view.indexOf("<Footer");
    assert.ok(ad !== -1 && slot !== -1 && related !== -1 && footer !== -1);
    assert.ok(ad < slot && slot < related && related < footer);
    assert.doesNotMatch(view, /youtube|iframe|YouTubeEmbed/i);
    assert.doesNotMatch(page, /AdUnit/);

    const slotBlock = view.slice(slot, related);
    assert.match(slotBlock, /lg:col-span-2/);
    assert.doesNotMatch(slotBlock, /AdUnit/);
  });
});
