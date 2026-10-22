/** Public byline. Do not publish a surname. */
export const AUTHOR_NAME = "Andrew";

export const AUTHOR_PATH = "/author/andrew/";

export const AUTHOR_BIO =
  "Andrew is a personal finance expert, DIY investor and life optimizer based in Toronto, Canada. With over 19 years of corporate experience at a leading Canadian company, Andrew combines deep industry knowledge with a passion for technology to help others navigate personal finance and streamline their daily lives.";

export const AUTHOR_FOCUS = [
  {
    title: "Posted mortgage rates",
    body: "Daily comparisons of fixed and variable rates that Canadian lenders publish on their own sites, split by term and by insured or uninsured when the source page says so.",
  },
  {
    title: "Renewals and rates below posted",
    body: "How a renewal letter compares with rates self-reported by Canadian borrowers online, and what that gap is for when you talk to a bank.",
  },
  {
    title: "The math around the rate",
    body: "Payments, the stress test, default-insurance premiums, closing costs, and rent versus buy, with the formula written down next to the calculator.",
  },
  {
    title: "What actually moves a quote",
    body: "Bank of Canada decisions for variable rates, bond yields for fixed rates, and the difference between a posted shelf rate and a discounted offer.",
  },
] as const;
