"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import MenuOverlay from "./MenuOverlay";

const navLinks = [
  { title: "Demo", path: "#demo" },
  { title: "About", path: "#about" },
  { title: "Experience", path: "#experience" },
  { title: "Projects", path: "#projects" },
  { title: "Education", path: "#education" },
  { title: "Contact", path: "#contact" },
];

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    if (!navbarOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [navbarOpen]);

  const barPadTop = "env(safe-area-inset-top, 0px)";

  return (
    <header
      className="fixed left-0 right-0 top-0 z-[100] border-b border-border/70 bg-surface/90 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/70"
      style={{ paddingTop: barPadTop }}
    >
      <div className="mx-auto flex min-h-[3.25rem] w-[min(100%-2*var(--shell-inline),76rem)] items-center justify-between gap-4 px-[var(--shell-inline)] py-2.5 sm:min-h-14 sm:py-3">
        <Link
          href="/"
          className="font-heading text-fluid-lg font-semibold tracking-tight text-ink sm:text-fluid-xl"
        >
          Devom <span className="text-accent-blue">Brahmbhatt</span>
        </Link>

        <nav
          className="menu hidden items-center md:flex"
          id="navbar"
          aria-label="Main navigation"
        >
          <ul className="flex flex-row flex-wrap items-center gap-0.5 lg:gap-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setNavbarOpen((o) => !o)}
            aria-expanded={navbarOpen}
            aria-controls="mobile-nav-panel"
            aria-label={navbarOpen ? "Close menu" : "Open menu"}
            className="inline-flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-ink/70 transition hover:bg-surface-elevated hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
          >
            {navbarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {navbarOpen ? (
        <>
          <button
            type="button"
            className="fixed bottom-0 left-0 right-0 z-[90] touch-manipulation bg-bg/70 backdrop-blur-[2px] md:hidden"
            style={{
              top: "calc(3.25rem + env(safe-area-inset-top, 0px))",
            }}
            aria-label="Close menu"
            onClick={() => setNavbarOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="fixed bottom-0 left-0 right-0 z-[95] max-h-[min(70vh,calc(100dvh-3.5rem))] overflow-y-auto border-t border-border bg-surface shadow-card md:hidden"
            style={{
              top: "calc(3.25rem + env(safe-area-inset-top, 0px))",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
            }}
          >
            <MenuOverlay
              links={navLinks}
              onNavigate={() => setNavbarOpen(false)}
            />
          </div>
        </>
      ) : null}
    </header>
  );
}
