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
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <svg
          className="w-6 h-6 text-gray-700"
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

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`transition font-medium ${
              currentPage === item.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 md:hidden z-50">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-medium transition ${
                currentPage === item.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
