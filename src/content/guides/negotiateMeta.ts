import { communityRates } from "../../lib/communityRates";

/** Dates for the negotiate guide. updatedDate follows the reported-rate file. */
export const negotiateGuide = {
  slug: "negotiate-mortgage-rate",
  path: "/guides/negotiate-mortgage-rate/",
  headline: "How much below posted can you negotiate?",
  description:
    "See how far below each Big-5 posted rate Canadian borrowers report getting, then use the steps to negotiate a renewal. Self-reported, unverified, and not an offer.",
  publishedIso: "2026-10-18",
  updatedDate: communityRates.asOf,
};
