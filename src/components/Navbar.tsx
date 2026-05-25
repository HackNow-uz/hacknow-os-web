"use client";

import { useState } from "react";

const navLinks = [
  { href: "#download", label: "Download" },
  { href: "#features", label: "Features" },
  { href: "#docs", label: "Docs" },
  { href: "#releases", label: "Releases" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,10,10,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,23,68,0.08)",
      }}
      role="banner"
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14"
        aria-label="Asosiy navigatsiya"
      >
        {/* Brand: wordmark only */}
        <a
          href="/"
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] rounded"
          aria-label="HackNow OS bosh sahifasi"
        >
          <span
            className="font-mono text-sm font-semibold tracking-tight"
            style={{ color: "#f0f0f0" }}
          >
            HackNow{" "}
            <span style={{ color: "#FF1744" }}>OS</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-mono px-3 py-1.5 rounded transition-hover hover:text-[#f0f0f0] hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
                style={{ color: "#a4b1cd" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="https://hacknow.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono px-3 py-1.5 rounded transition-hover hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
            style={{ color: "#5a6a84" }}
          >
            hacknow.uz
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded transition-hover hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
          style={{ color: "#a4b1cd" }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Menyuni yopish" : "Menyuni ochish"}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu — controlled by aria-expanded, uses height transition */}
      <div
        id="mobile-menu"
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? "400px" : "0",
          transition: "max-height 0.2s ease",
          borderTop: menuOpen ? "1px solid rgba(255,23,68,0.08)" : "none",
        }}
        aria-hidden={!menuOpen}
      >
        <ul className="px-4 pt-2 pb-4 space-y-0.5" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block py-2.5 px-3 text-sm font-mono rounded transition-hover hover:bg-white/5 hover:text-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
                style={{ color: "#a4b1cd" }}
                onClick={() => setMenuOpen(false)}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span style={{ color: "#FF1744", marginRight: "0.5rem" }} aria-hidden="true">▶</span>
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-1">
            <a
              href="https://hacknow.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 px-3 text-sm font-mono rounded transition-hover hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[#FF1744] focus:ring-offset-1 focus:ring-offset-[#0a0a0a]"
              style={{ color: "#5a6a84" }}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span style={{ color: "rgba(255,23,68,0.4)", marginRight: "0.5rem" }} aria-hidden="true">▶</span>
              hacknow.uz
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
