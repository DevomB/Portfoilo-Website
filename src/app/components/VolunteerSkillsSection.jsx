const volunteering = [
  {
    title: "Coordinator of Volunteers · Boy Scouts of America",
    span: "Aug 2019 – Present · Social services · Inland Empire",
    detail:
      "200+ hours coordinating agencies across Eastvale Council, Social Services, and Vantage Point Church.",
  },
  {
    title: "Community Volunteer · Feeding America",
    span: "Dec 2023 – Present · ERHS FBLA cohort",
    detail:
      "Fundraised $3k+ for Beacon Hill Church Food Pantry alongside a 25-person volunteer squad.",
  },
];

const skills = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "PostgreSQL",
  "Node.js",
  "Flutter",
  "C++",
  "Algorithms",
];

export default function VolunteerSkillsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-purple">
            Volunteering
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Community work
          </h2>
          <ul className="mt-8 space-y-8">
            {volunteering.map((v) => (
              <li key={v.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-purple/90">
                  {v.span}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-muted">{v.detail}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-accent-blue">
            Skills · Languages
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Skills
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-border bg-surface-elevated px-4 py-1 text-sm text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
          <dl className="mt-10 space-y-4 rounded-xl border border-border bg-surface/70 p-6">
            <div>
              <dt className="text-xs uppercase tracking-wide text-accent-purple">
                English
              </dt>
              <dd className="text-white">Full professional proficiency</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-accent-purple">
                Gujarati
              </dt>
              <dd className="text-white">Limited working proficiency</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
