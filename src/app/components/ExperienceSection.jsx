const roles = [
  {
    org: "Roosevelt Connect · Eleanor Roosevelt HS",
    title: "Full-Stack Developer",
    span: "Jul 2024 – Present · Hybrid · Eastvale",
    bullets: [
      "School-wide platform nearing launch for 5,000+ students — resources, comms, and academic tooling.",
      "Flutter client work paired with resilient backend integrations.",
    ],
  },
  {
    org: "Virtual Medical Missions",
    title: "President · Head of Computer Science",
    span: "Apr 2024 – Present · Hybrid · Eastvale",
    bullets: [
      "Telemedicine iteration supporting 400+ tribal Kenyans with mission-critical reliability.",
      "10k+ database reads / 2k+ writes per operational slice — Tailwind & modern web stack.",
    ],
  },
  {
    org: "Drip",
    title: "Founding Engineer Intern",
    span: "Jan 2026 – Apr 2026 · Hybrid · San Francisco",
    bullets: ["Early-stage product engineering inside a compressed internship cadence."],
  },
  {
    org: "WebWork Innovations",
    title: "Founder · Lead Developer",
    span: "Jun 2024 – Jan 2026 · Hybrid · Eastvale",
    bullets: [
      "Delivered 10+ production websites at 100% client satisfaction.",
      "Next.js · Tailwind · Vercel · PostgreSQL · Node · TypeScript.",
    ],
  },
  {
    org: "Ascend Labs",
    title: "CEO · Founder · Developer",
    span: "Sep 2024 – Nov 2025 · Remote · Eastvale",
    bullets: ["Built product velocity experiments across modern JS ecosystems."],
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
          Roles where ownership mattered
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
