"use client";

import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
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

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3 lg:py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white md:text-2xl"
        >
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
            Devom Brahmbhatt
          </span>
        </Link>
        <div className="block md:hidden">
          {!navbarOpen ? (
            <button
              type="button"
              onClick={() => setNavbarOpen(true)}
              aria-label="Open menu"
              className="rounded-md border border-border px-3 py-2 text-muted hover:border-accent-blue hover:text-white"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setNavbarOpen(false)}
              aria-label="Close menu"
              className="rounded-md border border-border px-3 py-2 text-muted hover:border-accent-blue hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="menu hidden w-auto md:block" id="navbar">
          <ul className="mt-0 flex flex-col space-y-2 p-4 md:flex-row md:space-x-6 md:space-y-0 md:p-0">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {navbarOpen ? (
        <div className="border-t border-border bg-surface md:hidden">
          <MenuOverlay links={navLinks} onNavigate={() => setNavbarOpen(false)} />
        </div>
      ) : null}
    </nav>
  );
}
