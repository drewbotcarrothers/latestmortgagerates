import { bankOfCanadaMortgage } from "./guides/bankOfCanadaMortgage";
import { bigFiveBanks } from "./guides/bigFiveBanks";
import { blendAndExtend } from "./guides/blendAndExtend";
import { closingCosts } from "./guides/closingCosts";
import { cmhcMortgageInsurance } from "./guides/cmhcMortgageInsurance";
import { firstTimeBuyerPrograms } from "./guides/firstTimeBuyerPrograms";
import { fixedVsVariable } from "./guides/fixedVsVariable";
import { helocRates } from "./guides/helocRates";
import { lenderTypes } from "./guides/lenderTypes";
import { lockInVariable } from "./guides/lockInVariable";
import { portingMortgage } from "./guides/portingMortgage";
import { postedVsDiscounted } from "./guides/postedVsDiscounted";
import { prepaymentPenalties } from "./guides/prepaymentPenalties";
import { rateHold } from "./guides/rateHold";
import { renewalPlaybook } from "./guides/renewalPlaybook";
import { renewalVsRefinance } from "./guides/renewalVsRefinance";
import { renewalWave2027 } from "./guides/renewalWave2027";
import { stressTestGuide } from "./guides/stressTestGuide";
import { switchingLenders } from "./guides/switchingLenders";
import { thirtyYearAmortization } from "./guides/thirtyYearAmortization";
import type { InDepthGuide } from "./guides/shared";
import { guideWordCount } from "./guides/shared";

export type { GuideFaq, InDepthGuide } from "./guides/shared";
export { guideWordCount } from "./guides/shared";

/** Long-form guides, in the order they appear on the hub, the menu, and the author page. */
export const IN_DEPTH_GUIDES: InDepthGuide[] = [
  renewalPlaybook,
  renewalWave2027,
  switchingLenders,
  renewalVsRefinance,
  portingMortgage,
  blendAndExtend,
  rateHold,
  prepaymentPenalties,
  fixedVsVariable,
  lockInVariable,
  postedVsDiscounted,
  bankOfCanadaMortgage,
  bigFiveBanks,
  lenderTypes,
  helocRates,
  firstTimeBuyerPrograms,
  closingCosts,
  cmhcMortgageInsurance,
  stressTestGuide,
  thirtyYearAmortization,
];

export function guideBySlug(slug: string): InDepthGuide {
  const guide = IN_DEPTH_GUIDES.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Unknown guide: ${slug}`);
  return guide;
}

export function inDepthGuideWordCounts(): Record<string, number> {
  return Object.fromEntries(IN_DEPTH_GUIDES.map((guide) => [guide.slug, guideWordCount(guide)]));
}
