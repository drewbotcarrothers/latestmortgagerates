import type { APIRoute } from "astro";
import { buildLlmsTxt } from "../lib/llmsTxt";

export const prerender = true;

/** /llms.txt — rebuilt from guides, tools, rates, and the reported-rate file. */
export const GET: APIRoute = () =>
  new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
