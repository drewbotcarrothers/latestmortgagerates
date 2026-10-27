/**
 * Long video on the Latest Mortgage Rates channel: how to negotiate your rate.
 * Thursday noon Eastern series, after posted-vs-real (2026-10-15) and the
 * renewal offer checker (2026-10-22). The negotiate episode is scheduled for
 * 2026-10-29. Leave the id empty until that upload exists. Do not invent one.
 */
export const NEGOTIATE_RATE_VIDEO_ID = "";

export const NEGOTIATE_RATE_VIDEO = {
  heading: "Watch: how to negotiate your rate",
  caption:
    "Walk through a renewal offer, the gap below a bank's own posted rate, and the competing quote you take back.",
  title: "How to Negotiate Your Mortgage Rate in Canada",
  name: "How to Negotiate Your Mortgage Rate in Canada",
  uploadDate: "2026-10-29",
  scheduledLabel: "Thursday, October 29, 2026 at noon Eastern",
} as const;

/** Public long videos already on the channel. These are not the negotiate embed. */
export const NEGOTIATE_SERIES_EARLIER = [
  {
    id: "t-Ukya9dzPc",
    href: "https://www.youtube.com/watch?v=t-Ukya9dzPc",
    label: "posted versus real rates",
    date: "October 15, 2026",
  },
  {
    id: "anZgA1p9wNA",
    href: "https://www.youtube.com/watch?v=anZgA1p9wNA",
    label: "the renewal offer checker",
    date: "October 22, 2026",
  },
] as const;

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

/** Eleven-character YouTube id, or null when the slot is still waiting on the upload. */
export function negotiateRateVideoId(override?: string | null): string | null {
  const id = (override ?? NEGOTIATE_RATE_VIDEO_ID).trim();
  return VIDEO_ID.test(id) ? id : null;
}
