/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "var(--shell-inline)" },
      screens: { "2xl": "72rem" },
    },
    extend: {
      // Solid tokens take Tailwind's <alpha-value> so the /opacity modifier
      // works (text-muted/60 -> rgb(154 143 176 / 0.6)). The three tokens
      // that are already translucent (border, accent-bg, secondary-bg) are
      // plain values and must not be given a modifier.
      colors: {
        bg: "rgb(var(--color-bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
        "surface-elevated": "rgb(var(--color-surface-elevated-rgb) / <alpha-value>)",
        border: "var(--color-border)",
        ink: "rgb(var(--color-ink-rgb) / <alpha-value>)",
        accent: "rgb(var(--color-accent-rgb) / <alpha-value>)",
        "accent-dim": "rgb(var(--color-accent-dim-rgb) / <alpha-value>)",
        "accent-bg": "var(--color-accent-bg)",
        "code-bg": "rgb(var(--color-code-bg-rgb) / <alpha-value>)",
        muted: "rgb(var(--color-muted-rgb) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary-rgb) / <alpha-value>)",
        "secondary-dim": "rgb(var(--color-secondary-dim-rgb) / <alpha-value>)",
        "secondary-bg": "var(--color-secondary-bg)",
        danger: "rgb(var(--color-danger-rgb) / <alpha-value>)",
        warn: "rgb(var(--color-warn-rgb) / <alpha-value>)",
        ok: "rgb(var(--color-ok-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],          // IBM Plex Sans — body
        display: ["var(--font-display)", "system-ui", "sans-serif"],   // Bricolage — hero, UI chrome
        title: ["var(--font-title)", "system-ui", "sans-serif"],       // Space Grotesk — page titles
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],       // Geist Mono — data
        wordmark: ["var(--font-wordmark)", "system-ui", "sans-serif"], // Anybody — footer DEVOM
      },
      fontSize: {
        "fluid-xs": "var(--text-xs)",
        "fluid-sm": "var(--text-sm)",
        "fluid-base": "var(--text-base)",
        "fluid-lg": "var(--text-lg)",
        "fluid-xl": "var(--text-xl)",
        "fluid-2xl": "var(--text-2xl)",
        "fluid-3xl": "var(--text-3xl)",
        "fluid-4xl": "var(--text-4xl)",
        "fluid-hero": "var(--text-hero)",
      },
      spacing: {
        section: "var(--section-y)",
        shell: "var(--shell-inline)",
      },
      boxShadow: {
        card: "0 1px 3px rgb(var(--brand-black-rgb) / 0.5), 0 0 0 1px rgb(var(--brand-purple-rgb) / 0.08)",
        "card-hover": "0 6px 20px rgb(var(--brand-purple-rgb) / 0.25), 0 0 0 1px rgb(var(--brand-purple-rgb) / 0.35)",
        glow: "0 0 0 3px rgb(var(--brand-green-rgb) / 0.35)",
      },
    },
  },
  plugins: [],
};
