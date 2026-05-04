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

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-28 py-16 md:py-20">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent-purple">
          Experience
        </p>
        <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
          Work
        </h2>
      </div>
      <div className="relative space-y-12 border-l border-border pl-8">
        <ul className="space-y-12">
          {roles.map((job) => (
            <li key={job.org + job.title} className="relative">
              <span className="absolute -left-[39px] mt-1 h-3 w-3 rounded-full border-2 border-accent-blue bg-bg shadow-[0_0_14px_rgba(91,157,255,0.45)]" />
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-blue">
                {job.span}
              </p>
              <h3 className="mt-2 text-xl font-bold text-white">{job.title}</h3>
              <p className="text-muted">{job.org}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-accent-purple">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
