"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

export type SitePage =
  | "rates"
  | "guides"
  | "glossary"
  | "tools"
  | "blog"
  | "trends"
  | "experts"
  | "ebook"
  | "real-rates"
  | "negotiate"
  | "offer-check"
  | "lenders";

interface NavigationProps {
  currentPage?: SitePage;
}

interface NavLink {
  href: string;
  label: string;
}

interface NavMenu {
  id: string;
  label: string;
  /** Wide menus align to the trigger's right edge so they stay inside the viewport. */
  align: "left" | "right";
  columns?: 1 | 2;
  links: NavLink[];
}

const GUIDE_HREF = "/mortgage-guide/";

const MENUS: NavMenu[] = [
  {
    id: "rates",
    label: "Rates",
    align: "left",
    links: [
      { href: "/", label: "Today's rates" },
      { href: "/real-mortgage-rates/", label: "Real mortgage rates" },
      { href: "/trends/", label: "Rate trends" },
      { href: "/rates/5-year-fixed/", label: "5-year fixed" },
      { href: "/rates/variable/", label: "Variable rates" },
      { href: "/rates/insured/", label: "Insured rates" },
      { href: "/rates/uninsured/", label: "Uninsured rates" },
    ],
  },
  {
    id: "lenders",
    label: "Lenders",
    align: "left",
    columns: 2,
    links: [
      { href: "/", label: "Compare all lenders" },
      { href: "/lenders/rbc/", label: "RBC" },
      { href: "/lenders/td/", label: "TD" },
      { href: "/lenders/scotiabank/", label: "Scotiabank" },
      { href: "/lenders/bmo/", label: "BMO" },
      { href: "/lenders/cibc/", label: "CIBC" },
      { href: "/lenders/nationalbank/", label: "National Bank" },
      { href: "/lenders/nesto/", label: "nesto" },
      { href: "/lenders/wealthsimple/", label: "Wealthsimple" },
      { href: "/lenders/atb/", label: "ATB" },
      { href: "/lenders/vancity/", label: "Vancity" },
      { href: "/lenders/meridian/", label: "Meridian" },
      { href: "/lenders/firstnational/", label: "First National" },
      { href: "/lenders/truenorth/", label: "True North" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    align: "right",
    columns: 2,
    links: [
      { href: "/tools/", label: "All calculators" },
      { href: "/tools/renewal-offer-checker/", label: "Renewal offer checker" },
      { href: "/tools/mortgage-calculator/", label: "Payment calculator" },
      { href: "/tools/affordability-calculator/", label: "Affordability" },
      { href: "/tools/mortgage-renewal-calculator/", label: "Renewal calculator" },
      { href: "/tools/refinance-calculator/", label: "Refinance calculator" },
      { href: "/tools/stress-test-qualifier/", label: "Stress test" },
      { href: "/tools/mortgage-penalty-calculator/", label: "Penalty calculator" },
      { href: "/tools/cmhc-insurance-calculator/", label: "CMHC insurance" },
      { href: "/tools/land-transfer-tax-calculator/", label: "Land transfer tax" },
      { href: "/tools/closing-costs-calculator/", label: "Closing costs" },
      { href: "/tools/rent-vs-buy-calculator/", label: "Rent vs buy" },
    ],
  },
  {
    id: "guides",
    label: "Guides",
    align: "right",
    links: [
      { href: "/guides/negotiate-mortgage-rate/", label: "Negotiate your rate" },
      { href: "/compare/", label: "Compare mortgages" },
      { href: "/glossary/", label: "Glossary" },
      { href: "/experts/", label: "Experts" },
      { href: "/cities/", label: "Rates by city" },
      { href: "/methodology/", label: "Rate methodology" },
    ],
  },
];

const BLOG: NavLink = { href: "/blog/", label: "Blog" };

const SECTION_FOR_PAGE: Record<SitePage, string> = {
  rates: "rates",
  "real-rates": "rates",
  trends: "rates",
  lenders: "lenders",
  tools: "tools",
  "offer-check": "tools",
  negotiate: "guides",
  glossary: "guides",
  experts: "guides",
  blog: "blog",
  ebook: "ebook",
  guides: "ebook",
};

function sectionFromPath(path: string): string | null {
  if (path.startsWith("/mortgage-guide")) return "ebook";
  if (path.startsWith("/lenders")) return "lenders";
  if (path.startsWith("/tools")) return "tools";
  if (path.startsWith("/blog")) return "blog";
  if (
    path.startsWith("/glossary") ||
    path.startsWith("/guides") ||
    path.startsWith("/experts") ||
    path.startsWith("/compare") ||
    path.startsWith("/cities") ||
    path.startsWith("/methodology")
  ) {
    return "guides";
  }
  if (
    path === "/" ||
    path.startsWith("/rates") ||
    path.startsWith("/real-mortgage-rates") ||
    path.startsWith("/trends")
  ) {
    return "rates";
  }
  return null;
}

function normalizePath(path: string): string {
  if (path === "/") return "/";
  const base = path.split("#")[0].split("?")[0];
  return base.endsWith("/") ? base : `${base}/`;
}

const PAGE_HREF: Partial<Record<SitePage, string>> = {
  rates: "/",
  "real-rates": "/real-mortgage-rates/",
  trends: "/trends/",
  negotiate: "/guides/negotiate-mortgage-rate/",
  "offer-check": "/tools/renewal-offer-checker/",
  tools: "/tools/",
  glossary: "/glossary/",
  experts: "/experts/",
  blog: "/blog/",
  ebook: GUIDE_HREF,
  guides: GUIDE_HREF,
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

const ctaClass =
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900";

function GuideCta({ current, className = "" }: { current: boolean; className?: string }) {
  return (
    <a
      href={GUIDE_HREF}
      className={`${ctaClass} ${current ? "ring-2 ring-teal-700 ring-offset-2" : ""} ${className}`}
      aria-current={current ? "page" : undefined}
    >
      <GuideIcon />
      Mortgage Guide
    </a>
  );
}

function linkClass(current: boolean) {
  return `block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
    current
      ? "bg-teal-50 font-medium text-teal-800 dark:bg-teal-900/40 dark:text-teal-200"
      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;
}

function moveFocus(items: HTMLElement[], current: Element | null, delta: number) {
  if (!items.length) return;
  const index = items.indexOf(current as HTMLElement);
  const next = index === -1 ? (delta > 0 ? 0 : items.length - 1) : (index + delta + items.length) % items.length;
  items[next]?.focus();
}

export default function Navigation({ currentPage }: NavigationProps) {
  const baseId = useId();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimer = useRef<number | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [pinnedMenu, setPinnedMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [path, setPath] = useState<string | null>(null);
  const openMenuRef = useRef(openMenu);
  const pinnedMenuRef = useRef(pinnedMenu);
  openMenuRef.current = openMenu;
  pinnedMenuRef.current = pinnedMenu;

  useEffect(() => {
    setPath(normalizePath(window.location.pathname));
  }, []);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
        setPinnedMenu(null);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const current = openMenuRef.current;
      setOpenMenu(null);
      setPinnedMenu(null);
      if (current) {
        triggerRefs.current[current]?.focus();
      }
      if (mobileOpen) {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, baseId]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const section = path ? sectionFromPath(path) : currentPage ? SECTION_FOR_PAGE[currentPage] : null;

  function hrefCurrent(href: string, menuId?: string) {
    if (href === "/" && menuId === "lenders") return false;
    if (path) return path === normalizePath(href);
    const expected = currentPage ? PAGE_HREF[currentPage] : undefined;
    return expected === href;
  }

  function clearCloseTimer() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openFromHover(id: string) {
    clearCloseTimer();
    setOpenMenu(id);
  }

  function scheduleClose() {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => {
      setOpenMenu((current) => {
        const pinned = pinnedMenuRef.current;
        if (pinned && pinned === current) return current;
        return pinned;
      });
    }, 140);
  }

  function toggleMenu(id: string) {
    clearCloseTimer();
    if (pinnedMenu === id) {
      setPinnedMenu(null);
      setOpenMenu(null);
      return;
    }
    setPinnedMenu(id);
    setOpenMenu(id);
  }

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, id: string, menuId: string) {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setPinnedMenu(id);
    setOpenMenu(id);
    window.requestAnimationFrame(() => {
      document.getElementById(menuId)?.querySelector<HTMLElement>("a")?.focus();
    });
  }

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a"));
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(items, document.activeElement, 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(items, document.activeElement, -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  function onMobileKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a, button"));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const mobilePanelId = `${baseId}-mobile`;

  return (
    <nav ref={navRef} aria-label="Primary" className="flex items-center">
      <div className="hidden items-center gap-0.5 lg:flex lg:flex-nowrap">
        {MENUS.map((menu) => {
          const menuId = `${baseId}-${menu.id}`;
          const open = openMenu === menu.id;
          const active = section === menu.id;
          return (
            <div
              key={menu.id}
              className="relative"
              onMouseEnter={() => openFromHover(menu.id)}
              onMouseLeave={scheduleClose}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setOpenMenu((current) => (current === menu.id ? null : current));
                }
              }}
            >
              <button
                type="button"
                ref={(node) => {
                  triggerRefs.current[menu.id] = node;
                }}
                className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                  active || open
                    ? "text-teal-700 dark:text-teal-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
                aria-expanded={open}
                aria-haspopup="true"
                aria-controls={menuId}
                onClick={() => toggleMenu(menu.id)}
                onKeyDown={(event) => onTriggerKeyDown(event, menu.id, menuId)}
              >
                {menu.label}
                <Chevron open={open} />
              </button>
              <div
                id={menuId}
                role="region"
                aria-label={menu.label}
                hidden={!open}
                onMouseEnter={clearCloseTimer}
                onKeyDown={onMenuKeyDown}
                className={`absolute top-full z-50 pt-2 ${menu.align === "right" ? "right-0" : "left-0"} ${open ? "" : "hidden"}`}
              >
                <ul
                  className={`rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900 ${
                    menu.columns === 2 ? "grid w-[22rem] grid-cols-2" : "w-56"
                  }`}
                >
                  {menu.links.map((link, index) => {
                    const current = hrefCurrent(link.href, menu.id);
                    const span = menu.columns === 2 && index === 0;
                    return (
                      <li key={`${menu.id}-${link.href}-${link.label}`} className={span ? "col-span-2" : undefined}>
                        <a href={link.href} className={linkClass(current)} aria-current={current ? "page" : undefined}>
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
        <a
          href={BLOG.href}
          className={`whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
            section === "blog"
              ? "text-teal-700 dark:text-teal-300"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
          aria-current={section === "blog" ? "page" : undefined}
        >
          {BLOG.label}
        </a>
        <GuideCta current={section === "ebook"} className="ml-2" />
      </div>

      <button
        ref={menuButtonRef}
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 lg:hidden dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls={mobilePanelId}
        onClick={() => {
          setMobileOpen((open) => !open);
          setOpenMenu(null);
        }}
      >
        {mobileOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="absolute inset-x-0 top-full z-40 h-screen bg-slate-900/40 lg:hidden"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div
        id={mobilePanelId}
        hidden={!mobileOpen}
        style={mobileOpen ? { maxHeight: "calc(100dvh - 100%)" } : undefined}
        className={`absolute inset-x-0 top-full z-50 overflow-y-auto border-t border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900 lg:hidden ${
          mobileOpen ? "" : "hidden"
        }`}
        onKeyDown={onMobileKeyDown}
      >
        <div className="mx-auto max-w-7xl px-4 py-4">
          <GuideCta current={section === "ebook"} className="w-full" />
          {MENUS.map((menu) => (
            <div key={menu.id} className="mt-4">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{menu.label}</p>
              <ul>
                {menu.links.map((link) => {
                  const current = hrefCurrent(link.href, menu.id);
                  return (
                    <li key={`m-${menu.id}-${link.href}-${link.label}`}>
                      <a
                        href={link.href}
                        className={linkClass(current)}
                        aria-current={current ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <a
              href={BLOG.href}
              className={linkClass(section === "blog")}
              aria-current={section === "blog" ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
            >
              {BLOG.label}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
