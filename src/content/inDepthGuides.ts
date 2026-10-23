import { firstTimeBuyerPrograms } from "./guides/firstTimeBuyerPrograms";
import { fixedVsVariable } from "./guides/fixedVsVariable";
import { lenderTypes } from "./guides/lenderTypes";
import { bigFiveBanks } from "./guides/bigFiveBanks";
import { blendAndExtend } from "./guides/blendAndExtend";
import { closingCosts } from "./guides/closingCosts";
import { postedVsDiscounted } from "./guides/postedVsDiscounted";
import { prepaymentPenalties } from "./guides/prepaymentPenalties";
import { rateHold } from "./guides/rateHold";
import { renewalPlaybook } from "./guides/renewalPlaybook";
import { stressTestGuide } from "./guides/stressTestGuide";
import { switchingLenders } from "./guides/switchingLenders";
import type { InDepthGuide } from "./guides/shared";
import { guideWordCount } from "./guides/shared";

export type { GuideFaq, InDepthGuide } from "./guides/shared";
export { guideWordCount } from "./guides/shared";

/** Long-form guides, in the order they appear on the hub and the author page. */
export const IN_DEPTH_GUIDES: InDepthGuide[] = [
  renewalPlaybook,
  prepaymentPenalties,
  stressTestGuide,
  lenderTypes,
  fixedVsVariable,
  firstTimeBuyerPrograms,
  switchingLenders,
  postedVsDiscounted,
  closingCosts,
  bigFiveBanks,
  blendAndExtend,
  rateHold,
];

export function guideBySlug(slug: string): InDepthGuide {
  const guide = IN_DEPTH_GUIDES.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Unknown guide: ${slug}`);
  return guide;
}

export function inDepthGuideWordCounts(): Record<string, number> {
  return Object.fromEntries(IN_DEPTH_GUIDES.map((guide) => [guide.slug, guideWordCount(guide)]));
}
