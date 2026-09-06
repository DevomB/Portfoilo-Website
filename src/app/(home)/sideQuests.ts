/**
 * Side quests: things built for joy, not for the portfolio. They get a
 * screenshot, one line, and a link out — never a project page or a demo.
 *
 * "Also built" is the quieter tier beneath it: names and links only, so the
 * work is findable without being given a spot it hasn't earned.
 */

export type SideQuest = {
  name: string;
  /** One line. Quotation marks when it is a quote, sentence case when it is mine. */
  blurb: string;
  /** Where the card links. The live site. */
  url: string;
  repo: string;
  /** Screenshot under public/, 16:9. */
  image: string;
};

export const sideQuests: SideQuest[] = [
  {
    name: "Iron Man",
    blurb: "“Genius, billionaire, playboy, philanthropist”",
    url: "https://iron-man.devomb.com",
    repo: "https://github.com/DevomB/Iron-Man",
    image: "/images/side-quests/iron-man.jpg",
  },
  {
    name: "Spider Man",
    blurb: "Guess who my favorite superhero is",
    url: "https://spiderman.devomb.com",
    repo: "https://github.com/DevomB/Spiderman",
    image: "/images/side-quests/spiderman.jpg",
  },
];

export type AlsoBuilt = { name: string; url: string };

export const alsoBuilt: AlsoBuilt[] = [
  /* NOTE — demo candidate. Gaussian Solver takes a matrix and reduces it to
     reduced row echelon form; that is a natural in-site interactive (type a
     matrix, watch the row operations). Until it is built it stays a link. */
  { name: "Gaussian Solver", url: "https://github.com/DevomB/Gaussian-Solver" },
];
