import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  INDEXNOW_HOST,
  INDEXNOW_MAX_URLS,
  buildIndexNowBody,
  chooseUrlList,
  chunkUrls,
  filterHostUrls,
  findIndexNowKey,
  submitIndexNow,
  urlsFromSitemapTree,
} from "./indexnow.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));

describe("IndexNow", () => {
  it("reads page URLs from a sitemap index and skips the sitemap files themselves", () => {
    const urls = urlsFromSitemapTree({
      "sitemap-index.xml": `<?xml version="1.0"?><sitemapindex>
        <sitemap><loc>https://latestmortgagerates.ca/sitemap-0.xml</loc></sitemap>
      </sitemapindex>`,
      "sitemap-0.xml": `<?xml version="1.0"?><urlset>
        <url><loc>https://latestmortgagerates.ca/</loc></url>
        <url><loc>https://latestmortgagerates.ca/editorial-policy/</loc></url>
        <url><loc>https://latestmortgagerates.ca/llms.txt</loc></url>
      </urlset>`,
    });
    assert.deepEqual(urls, [
      "https://latestmortgagerates.ca/",
      "https://latestmortgagerates.ca/editorial-policy/",
      "https://latestmortgagerates.ca/llms.txt",
    ]);
  });

  it("submits a changed list when one is provided, otherwise every sitemap URL", () => {
    const all = ["https://latestmortgagerates.ca/a/", "https://latestmortgagerates.ca/b/"];
    assert.deepEqual(chooseUrlList(all, []), all);
    assert.deepEqual(chooseUrlList(all, ["https://latestmortgagerates.ca/b/"]), [
      "https://latestmortgagerates.ca/b/",
    ]);
  });

  it("caps each request at 10,000 URLs", () => {
    const urls = Array.from({ length: INDEXNOW_MAX_URLS + 1 }, (_, i) => `https://latestmortgagerates.ca/p/${i}/`);
    const chunks = chunkUrls(urls);
    assert.equal(chunks.length, 2);
    assert.equal(chunks[0].length, 10000);
    assert.equal(chunks[1].length, 1);
  });

  it("builds the IndexNow body from the public key file", () => {
    const key = findIndexNowKey(join(root, "public"));
    assert.match(key.key, /^[a-f0-9]{32}$/);
    assert.equal(key.fileName, `${key.key}.txt`);
    const body = buildIndexNowBody({
      host: INDEXNOW_HOST,
      key: key.key,
      urls: ["https://latestmortgagerates.ca/"],
    });
    assert.equal(body.host, "latestmortgagerates.ca");
    assert.equal(body.keyLocation, `https://latestmortgagerates.ca/${key.key}.txt`);
    assert.deepEqual(body.urlList, ["https://latestmortgagerates.ca/"]);
    assert.deepEqual(filterHostUrls(["https://example.com/", "https://latestmortgagerates.ca/guides/"]), [
      "https://latestmortgagerates.ca/guides/",
    ]);
  });

  it("POSTs the payload and does not throw away a failed response", async () => {
    const dir = mkdtempSync(join(tmpdir(), "indexnow-"));
    const key = "abc123abc123abc123abc123abc123ab";
    writeFileSync(join(dir, `${key}.txt`), key);
    writeFileSync(
      join(dir, "sitemap-0.xml"),
      "<urlset><url><loc>https://latestmortgagerates.ca/guides/</loc></url></urlset>",
    );
    const calls: { url: string; body: string }[] = [];
    const ok = await submitIndexNow({
      distDir: dir,
      keyDir: dir,
      fetchImpl: async (url: string, init: { body: string }) => {
        calls.push({ url, body: init.body });
        return { ok: true, text: async () => "" };
      },
    });
    assert.equal(ok.submitted, 1);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /api\.indexnow\.org\/indexnow/);
    const payload = JSON.parse(calls[0].body);
    assert.equal(payload.key, key);
    assert.deepEqual(payload.urlList, ["https://latestmortgagerates.ca/guides/"]);

    await assert.rejects(() =>
      submitIndexNow({
        distDir: dir,
        keyDir: dir,
        fetchImpl: async () => ({ ok: false, status: 422, text: async () => "no" }),
      }),
    );
  });
});
