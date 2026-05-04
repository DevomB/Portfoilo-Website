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
    <section className="section-y">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-fluid-xs font-semibold uppercase tracking-wider text-muted">
            Volunteering
          </p>
          <h2 className="font-heading mt-2 text-fluid-3xl font-semibold tracking-tight text-white">
            Community work
          </h2>
          <ul className="mt-8 space-y-8">
            {volunteering.map((v) => (
              <li key={v.title}>
                <p className="text-fluid-xs font-semibold uppercase tracking-wide text-muted">
                  {v.span}
                </p>
                <h3 className="font-heading mt-2 text-fluid-xl font-semibold text-white">
                  {v.title}
                </h3>
                <p className="mt-2 text-fluid-sm leading-relaxed text-muted">
                  {v.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-fluid-xs font-semibold uppercase tracking-wider text-muted">
            Skills · Languages
          </p>
          <h2 className="font-heading mt-2 text-fluid-3xl font-semibold tracking-tight text-white">
            Skills
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-fluid-sm text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
          <dl className="mt-10 space-y-4 rounded-xl border border-border bg-surface p-6 shadow-card">
            <div>
              <dt className="text-fluid-xs uppercase tracking-wide text-muted">
                English
              </dt>
              <dd className="text-fluid-sm text-white">
                Full professional proficiency
              </dd>
            </div>
            <div>
              <dt className="text-fluid-xs uppercase tracking-wide text-muted">
                Gujarati
              </dt>
              <dd className="text-fluid-sm text-white">
                Limited working proficiency
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
