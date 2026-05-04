import Link from "next/link";

const items = [
  {
    school: "UC San Diego Extended Studies",
    detail:
      "Multivariable Calculus & Ordinary Differential Equations · Jun–Dec 2025 · Grade: A / A",
    sub:
      "Summer 2025 (MV Calc) · Fall 2025 (ODE) — transcripts hosted on LinkedIn / outbound PDFs.",
    links: [
      {
        label: "Extended Studies · UC San Diego",
        href: "https://extendedstudies.ucsd.edu/",
      },
    ],
  },
  {
    school: "Norco College · Concurrent enrollment",
    detail:
      "CIS-5 · CIS-17A · CIS-17B · CIS-17C — all A grades · Certificate pathway completed.",
    sub: "Heavy emphasis on data structures and disciplined C++ debugging.",
    links: [],
  },
];

const certs = [
  {
    name: "HackerRank · SQL Intermediate",
    href: "https://www.hackerrank.com/certificates/c0c28b8206b3",
    meta: "Issued May 2024 · Credential C0C28B8206B3",
  },
  {
    name: "HackerRank · SQL Basic",
    href: "https://www.hackerrank.com/certificates/900b33f389dd",
    meta: "Issued May 2024 · Credential 900B33F389DD",
  },
];

const card = "card-soft p-6";

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-28 section-y">
      <div className="mb-8 sm:mb-10">
        <p className="text-fluid-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Education & certifications
        </p>
        <h2 className="font-heading mt-3 text-fluid-3xl font-semibold tracking-tight text-ink">
          Coursework & certificates
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-6">
          {items.map((item) => (
            <article key={item.school} className={card}>
              <h3 className="font-heading text-fluid-lg font-semibold text-ink">
                {item.school}
              </h3>
              <p className="mt-2 text-fluid-sm text-muted">{item.detail}</p>
              <p className="mt-3 text-fluid-sm text-muted">{item.sub}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 touch-manipulation items-center text-fluid-sm font-medium text-accent-blue hover:text-accent-blue-dim sm:min-h-0"
                  >
                    {l.label} →
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className={card}>
          <h3 className="font-heading text-fluid-lg font-semibold text-ink">
            Certificates
          </h3>
          <ul className="mt-4 space-y-4">
            {certs.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 touch-manipulation flex-col justify-center font-medium text-accent-blue hover:text-accent-blue-dim sm:min-h-0"
                >
                  <span>{c.name}</span>
                  <span className="text-fluid-sm font-normal text-muted">
                    {c.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-fluid-xs text-muted">
            Transcripts and grade PDFs are not in this repo; ask on LinkedIn or
            email if you need them.
          </p>
        </div>
      </div>
    </section>
  );
}
