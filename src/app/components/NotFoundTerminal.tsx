"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { projects } from "@/data/projects";
import { suggestRoute } from "@/lib/suggestRoute";

/* Every public route on the site. Project and demo paths come from the data
   file so a new project is suggestable without touching this list. */
const ROUTES: readonly string[] = [
  "/",
  "/#about",
  "/#experience",
  "/#projects",
  "/privacy",
  "/terms",
  ...projects.map((p) => `/projects/${p.slug}`),
  ...projects.flatMap((p) => (p.demoPath ? [p.demoPath] : [])),
];

/* The 404 page is prerendered once at build time, so the request path is
   only knowable in the browser. Reading it through useSyncExternalStore
   keeps the server render deterministic and avoids a hydration mismatch. */
const noop = () => () => {};
const getPath = () => window.location.pathname;
const getServerPath = () => null;

export default function NotFoundTerminal() {
  const path = useSyncExternalStore(noop, getPath, getServerPath);
  const suggestion = path ? suggestRoute(path, ROUTES) : "/";

  return (
    <div className="bg-surface px-5 py-6 font-mono text-fluid-sm space-y-2">
      <p className="text-muted break-all">
        <span className="text-secondary">{">"}</span> GET {path ?? "…"}
      </p>
      <p className="text-danger">Error: 404 — route not found</p>
      <p className="text-muted">No handler registered for this path.</p>
      <p className="text-muted mt-2">
        Did you mean:{" "}
        <Link href={suggestion} className="text-accent hover:text-accent-dim transition-colors">
          {suggestion}
        </Link>
        {" "}?
      </p>
    </div>
  );
}
