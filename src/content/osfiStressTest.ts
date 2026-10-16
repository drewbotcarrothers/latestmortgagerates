/** OSFI backgrounder, effective November 21, 2024. */
export const OSFI_MQR_BACKGROUNDER_URL =
  "https://www.osfi-bsif.gc.ca/en/news/backgrounder-minimum-qualifying-rate-mqr";

/**
 * What OSFI requires on a renewal switch.
 * Insured straight switches were already outside this test. A refinance or
 * added funds still uses the prescribed minimum qualifying rate.
 */
export const STRAIGHT_SWITCH_STRESS_TEST =
  "Since November 21, 2024, OSFI no longer requires the prescribed minimum qualifying rate (the stress test) for an uninsured straight switch to a new federally regulated lender at renewal, when the loan amount and the remaining amortization do not increase. Insured straight switches were already exempt. A refinance, or a switch that adds funds or lengthens the amortization, still triggers the stress test.";

export const STRAIGHT_SWITCH_STRESS_TEST_CITE = `${STRAIGHT_SWITCH_STRESS_TEST} OSFI’s November 21, 2024 backgrounder: ${OSFI_MQR_BACKGROUNDER_URL}`;
