import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { projects, getProject } from "@/data/projects";
import Navbar from "@/app/components/Navbar";

export function generateStaticParams() {
  return projects
    .filter((p) => p.demoSlug && p.demoSlug !== "poker-lab" && p.liveUrl)
    .map((p) => ({ slug: p.demoSlug as string }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.demoSlug === slug);
  if (!project) return {};
  return {
    title: `${project.name} — Demo`,
    description: project.tagline,
  };
}

export default async function DemoExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // find the project whose demoSlug matches
  const project = projects.find((p) => p.demoSlug === slug);
  if (!project || !project.liveUrl) notFound();

  // also support looking up by project slug for direct linking
  const fallback = getProject(slug);
  const liveProject = project ?? fallback;
  if (!liveProject?.liveUrl) notFound();

  return (
    <>
      <Navbar />
      <main className="flex flex-col" style={{ height: "100dvh" }}>
        {/* demo header bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-white px-[var(--shell-inline)] py-2 pt-14">
          <div className="flex items-center gap-3">
            <Link
              href={`/projects/${liveProject.slug}`}
              className="inline-flex items-center gap-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              {liveProject.name}
            </Link>
            <span className="text-border">·</span>
            <span className="chip-accent px-2 py-0.5 font-mono text-[0.6rem]">live demo</span>
          </div>
          <Link
            href={liveProject.liveUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-fluid-xs text-muted transition-colors hover:text-ink"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            open in new tab
          </Link>
        </div>

        {/* iframe */}
        <iframe
          src={liveProject.liveUrl}
          title={`${liveProject.name} live demo`}
          className="flex-1 w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </main>
    </>
  );
}
