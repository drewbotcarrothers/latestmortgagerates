"use client";

import { useEffect } from "react";

// Map of glossary terms to their slugs for auto-linking
const glossaryTermMap: Record<string, string> = {
  "amortization": "amortization-period",
  "amortization period": "amortization-period",
  "apr": "apr",
  "annual percentage rate": "apr",
  "assumable mortgage": "assumable-mortgage",
  "blend and extend": "blend-and-extend",
  "cash back mortgage": "cash-back-mortgage",
  "closed mortgage": "closed-mortgage",
  "cmhc": "cmhc-insurance",
  "cmhc insurance": "cmhc-insurance",
  "mortgage default insurance": "cmhc-insurance",
  "conventional mortgage": "conventional-mortgage",
  "debt service ratios": "debt-service-ratios",
  "gds": "gds-ratio",
  "gross debt service": "gds-ratio",
  "tds": "tds-ratio",
  "total debt service": "tds-ratio",
  "down payment": "down-payment",
  "fhsa": "fhsa",
  "first home savings account": "fhsa",
  "fixed rate": "fixed-rate-mortgage",
  "fixed-rate mortgage": "fixed-rate-mortgage",
  "fixed rate mortgage": "fixed-rate-mortgage",
  "variable rate": "variable-rate-mortgage",
  "variable-rate mortgage": "variable-rate-mortgage",
  "variable rate mortgage": "variable-rate-mortgage",
  "heloc": "heloc",
  "home equity line of credit": "heloc",
  "high-ratio mortgage": "high-ratio-mortgage",
  "high ratio mortgage": "high-ratio-mortgage",
  "hbp": "home-buyers-plan",
  "home buyers' plan": "home-buyers-plan",
  "home buyer's plan": "home-buyers-plan",
  "ird": "ird",
  "interest rate differential": "ird",
  "insured mortgage": "insured-mortgage",
  "land transfer tax": "land-transfer-tax",
  "ltt": "land-transfer-tax",
  "ltv": "ltv",
  "loan to value": "ltv",
  "loan-to-value": "ltv",
  "mortgage broker": "mortgage-broker",
  "mortgage life insurance": "mortgage-life-insurance",
  "mortgage pre-approval": "mortgage-pre-approval",
  "pre-approval": "mortgage-pre-approval",
  "preapproval": "mortgage-pre-approval",
  "mortgage renewal": "mortgage-renewal",
  "renewal": "mortgage-renewal",
  "mortgage stress test": "mortgage-stress-test",
  "stress test": "mortgage-stress-test",
  "open mortgage": "open-mortgage",
  "posted rate": "posted-rate",
  "prime rate": "prime-rate",
  "refinancing": "refinancing",
  "refinance": "refinancing",
  "reverse mortgage": "reverse-mortgage",
  "second mortgage": "second-mortgage",
  "switch mortgage": "switch-mortgage",
  "term": "term",
  "porting": "porting",
  "portable mortgage": "porting",
  "convertible mortgage": "convertible-mortgage",
};

interface GlossaryLinkProps {
  contentSelector: string;
}

/**
 * Client-side component that auto-links glossary terms in content after mount.
 * This runs after hydration to avoid hydration mismatches.
 */
export default function GlossaryLink({ contentSelector }: GlossaryLinkProps) {
  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;

    const sortedTerms = Object.entries(glossaryTermMap).sort(
      (a, b) => b[0].length - a[0].length
    );

    function processNode(node: Node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        let html = text;

        for (const [term, slug] of sortedTerms) {
          const regex = new RegExp(
            `(?![^\u003c]*>)\\b${term.replace(/[.*+?^${}()|[\]\\\\]/g, "\\\\$&")}\\b`,
            "gi"
          );
          html = html.replace(
            regex,
            `<a href="/glossary#${slug}" class="text-teal-600 hover:text-teal-700 underline decoration-teal-300/50 hover:decoration-teal-500 transition-colors">$\u0026</a>`
          );
        }

        if (html !== text) {
          const wrapper = document.createElement("span");
          wrapper.innerHTML = html;
          node.parentNode?.replaceChild(wrapper, node);
        }
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.nodeName !== "A" &&
        node.nodeName !== "SCRIPT" &&
        node.nodeName !== "STYLE"
      ) {
        Array.from(node.childNodes).forEach(processNode);
      }
    }

    // Process all child nodes
    Array.from(container.childNodes).forEach(processNode);
  }, [contentSelector]);

  return null;
}
