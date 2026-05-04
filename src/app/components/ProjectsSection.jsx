import Link from "next/link";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const projects = [
  {
    title: "Poker-Bot · NL Hold’em engine",
    description:
      "C++20 library: dealing, betting phases, Monte Carlo equity, parallel runners, GoogleTest.",
    accent: "from-accent-blue/35 via-accent-purple/12 to-accent-purple/28",
    repo: "https://github.com/DevomB/Poker-Bot",
    preview: null,
  },
  {
    title: "Roosevelt Connect",
    description:
      "Flutter app and APIs for school resources, communication, and academics.",
    accent: "from-accent-purple/28 via-accent-blue/12 to-accent-blue/22",
    repo: null,
    preview: null,
  },
  {
    title: "Virtual Medical Missions",
    description:
      "501(c)(3) telemedicine: scheduling and records with a Tailwind front end and PostgreSQL-backed APIs.",
    accent: "from-accent-blue/22 via-accent-purple/18 to-accent-purple/26",
    repo: null,
    preview: "https://www.vmmhealthcare.org/",
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-28 py-16 md:py-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
            Projects
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Projects
          </h2>
        </div>
        <Link
          href="https://github.com/DevomB"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-purple hover:text-accent-purple-dim"
        >
          Browse GitHub <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-sm"
          >
            <div
              className={`mb-6 h-28 rounded-xl bg-gradient-to-br ${project.accent} opacity-90`}
              aria-hidden
            />
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {project.repo ? (
                <Link
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-accent-blue px-4 py-2 text-xs font-semibold text-bg hover:bg-accent-blue-dim"
                >
                  Source & tests
                </Link>
              ) : null}
              {project.preview ? (
                <Link
                  href={project.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-white hover:border-accent-purple"
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
