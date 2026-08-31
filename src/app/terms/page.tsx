import type { Metadata } from "next";
import LegalPage, {
  LegalLink,
  LegalSection,
  LegalSummary,
} from "@/app/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Plain-language terms for devomb.com: a personal portfolio provided as-is. Demos are illustrative and nothing here is financial advice.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      lede="There is no service being sold here, so these are short. Mostly they say: this is a portfolio, use it freely, and do not treat it as advice."
      updated="August 30, 2026"
    >
      <LegalSummary>
        <p>
          Read anything, run any demo, link to whatever you like. Everything is
          provided as-is with no guarantees. The simulations are illustrations of
          engineering work, not predictions — nothing on this site is financial,
          investment, or trading advice.
        </p>
      </LegalSummary>

      <LegalSection heading="What this site is">
        <p>
          devomb.com is a personal portfolio: project write-ups, technical notes,
          and a few interactive demos of code I have written. It is not a product,
          there is nothing to buy, and there are no accounts. Using the site does
          not create a client, advisory, or professional relationship between us.
        </p>
      </LegalSection>

      <LegalSection heading="Provided as-is">
        <p>
          Everything here is offered without warranty of any kind, express or
          implied — including fitness for a particular purpose, accuracy, or
          uninterrupted availability. Pages may be wrong, out of date, or offline.
          To the fullest extent the law allows, I am not liable for any loss or
          damage arising from your use of this site, its code, or anything you
          decide to do after reading it.
        </p>
      </LegalSection>

      <LegalSection heading="Not financial advice">
        <p>
          Some of this site covers markets, trading systems, and backtesting. All of
          it is educational and descriptive of engineering work. None of it is
          investment advice, a recommendation, a solicitation, or an offer to buy or
          sell anything, and it is not tailored to your situation.
        </p>
        <p>
          Simulated, hypothetical, and backtested results carry well-known
          limitations: they are computed with hindsight, they do not represent
          actual trading, and they do not account for the full cost and slippage of
          real execution. Past or simulated performance says nothing about future
          results. Trading involves substantial risk of loss. Do your own research
          and talk to a licensed professional before risking money.
        </p>
      </LegalSection>

      <LegalSection heading="The demos">
        <p>
          The interactive demos are illustrations, not tools you should rely on for
          decisions. They run bounded simulations, approximate where that keeps them
          fast, and can be wrong. Please use them at a human pace — automated
          hammering of the demo endpoints, scraping, or anything intended to degrade
          the site for other people is not permitted.
        </p>
      </LegalSection>

      <LegalSection heading="Content and code">
        <p>
          The writing, design, and imagery on this site are mine. Source code for
          the projects lives in its own repositories and is governed by whatever
          license each repository states — follow that license, not this page.
          Quoting a paragraph with attribution and a link is always fine;
          republishing the site wholesale is not.
        </p>
      </LegalSection>

      <LegalSection heading="Privacy">
        <p>
          The site collects essentially nothing about you. The details are on the{" "}
          <LegalLink href="/privacy">privacy policy</LegalLink> page.
        </p>
      </LegalSection>

      <LegalSection heading="Changes and contact">
        <p>
          These terms can change; the date at the top says when they last did.
          Questions go through the{" "}
          <LegalLink href="https://github.com/DevomB">GitHub</LegalLink> or{" "}
          <LegalLink href="https://www.linkedin.com/in/devomb/">LinkedIn</LegalLink>{" "}
          links in the footer.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
