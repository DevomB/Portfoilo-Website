const roles = [
  {
    org: "Roosevelt Connect · Eleanor Roosevelt HS",
    title: "Full-Stack Developer",
    span: "Jul 2024 – Present · Hybrid · Eastvale",
    bullets: [
      "Platform for resources, messaging, and academic tools (thousands of students).",
      "Flutter client with API integrations.",
    ],
  },
  {
    org: "Virtual Medical Missions",
    title: "President · Head of Computer Science",
    span: "Apr 2024 – Present · Hybrid · Eastvale",
    bullets: [
      "Telemedicine deployments (400+ patients in rural Kenya on recent missions).",
      "High read/write PostgreSQL usage during live sessions; Tailwind UI.",
    ],
  },
  {
    org: "Drip",
    title: "Founding Engineer Intern",
    span: "Jan 2026 – Apr 2026 · Hybrid · San Francisco",
    bullets: ["Internship: feature work on an early-stage product."],
  },
  {
    org: "WebWork Innovations",
    title: "Founder · Lead Developer",
    span: "Jun 2024 – Jan 2026 · Hybrid · Eastvale",
    bullets: [
      "10+ client sites: Next.js, Tailwind, Vercel, PostgreSQL, Node, TypeScript.",
    ],
  },
  {
    org: "Ascend Labs",
    title: "CEO · Founder · Developer",
    span: "Sep 2024 – Nov 2025 · Remote · Eastvale",
    bullets: ["Small experiments and prototypes in JS ecosystems."],
  },
];

const cardClass =
  "card-soft p-5 sm:p-6 border-l-4 border-l-accent-blue pl-4 sm:pl-5";

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-28 section-y">
      <div className="mb-8 sm:mb-10">
        <p className="text-fluid-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Experience
        </p>
        <h2 className="font-heading mt-3 text-fluid-3xl font-semibold tracking-tight text-ink">
          Work
        </h2>
      </div>
      <ul className="space-y-5 sm:space-y-6">
        {roles.map((job) => (
          <li key={job.org + job.title}>
            <article className={cardClass}>
              <p className="text-fluid-xs font-semibold uppercase tracking-wide text-muted">
                {job.span}
              </p>
              <h3 className="font-heading mt-2 text-fluid-xl font-semibold text-ink">
                {job.title}
              </h3>
              <p className="text-fluid-sm text-muted">{job.org}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-fluid-sm leading-relaxed text-muted marker:text-accent-blue">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
