"use client";

import Link from "next/link";
import { useState } from "react";

interface NavigationProps {
  currentPage?: "rates" | "guides" | "glossary" | "tools";
}

export default function Navigation({ currentPage }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Rates", id: "rates" },
    { href: "/blog", label: "Guides", id: "guides" },
    { href: "/glossary", label: "Glossary", id: "glossary" },
    { href: "/tools", label: "Tools", id: "tools" },
  ];

  return (
    <nav className="relative">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg
            className={`w-6 h-6 text-slate-700 dark:text-slate-200 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === item.id
                ? "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-teal-600 dark:hover:text-teal-400"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={`absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 md:hidden z-50 overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {navItems.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
              currentPage === item.id
                ? "bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-r-2 border-teal-500"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            style={{ 
              transitionDelay: isMenuOpen ? `${index * 50}ms` : '0ms',
              transform: isMenuOpen ? 'translateX(0)' : 'translateX(10px)',
              opacity: isMenuOpen ? 1 : 0
            }}
          >
            <span className="flex-1">{item.label}</span>
            {currentPage === item.id && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}
