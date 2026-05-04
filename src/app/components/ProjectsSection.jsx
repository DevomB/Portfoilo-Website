import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const projects = [
  {
    title: "Poker-Bot · NL Hold’em engine",
    description:
      "C++20 library: dealing, betting phases, Monte Carlo equity, parallel runners, GoogleTest.",
    repo: "https://github.com/DevomB/Poker-Bot",
    preview: null,
  },
  {
    title: "Roosevelt Connect",
    description:
      "Flutter app and APIs for school resources, communication, and academics.",
    repo: null,
    preview: null,
  },
  {
    title: "Virtual Medical Missions",
    description:
      "501(c)(3) telemedicine: scheduling and records with a Tailwind front end and PostgreSQL-backed APIs.",
    repo: null,
    preview: "https://www.vmmhealthcare.org/",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-28 section-y">
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-fluid-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Projects
          </p>
          <h2 className="font-heading mt-3 text-fluid-3xl font-semibold tracking-tight text-ink">
            Selected work
          </h2>
        </div>
        <Link
          href="https://github.com/DevomB"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 touch-manipulation items-center gap-2 text-fluid-sm font-medium text-accent-blue hover:text-accent-blue-dim sm:min-h-0"
        >
          Browse GitHub <ArrowTopRightOnSquareIcon className="h-5 w-5 shrink-0" />
        </Link>
      </div>

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col card-soft p-6"
          >
            <div className="mb-5 h-1.5 w-12 rounded-full bg-accent-blue/80" aria-hidden />
            <h3 className="font-heading text-fluid-xl font-semibold text-ink">
              {project.title}
            </h3>
            <p className="mt-3 flex-1 text-fluid-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.repo ? (
                <Link
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full bg-accent-blue px-5 text-fluid-xs font-semibold text-white transition hover:bg-accent-blue-dim sm:min-h-0"
                >
                  Source & tests
                </Link>
              ) : null}
              {project.preview ? (
                <Link
                  href={project.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 touch-manipulation items-center justify-center rounded-full border border-border bg-surface-elevated px-5 text-fluid-xs font-semibold text-ink transition hover:bg-white sm:min-h-0"
                >
                  Live preview
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
