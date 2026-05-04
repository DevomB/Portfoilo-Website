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
      padding: {
        DEFAULT: "var(--shell-inline)",
      },
      screens: {
        "2xl": "72rem",
      },
    },
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        accent: {
          blue: "var(--color-accent-blue)",
          "blue-dim": "var(--color-accent-blue-dim)",
          purple: "var(--color-accent-purple)",
          "purple-dim": "var(--color-accent-purple-dim)",
        },
        muted: "var(--color-muted)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "system-ui", "sans-serif"],
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
        glow:
          "0 0 36px rgba(210, 106, 58, 0.18), 0 1px 0 rgba(255, 255, 255, 0.6) inset",
        card: "0 1px 0 rgba(255, 255, 255, 0.7) inset, 0 18px 50px rgba(29, 21, 15, 0.14)",
      },
      ringOffsetColor: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
      },
    },
  },
  plugins: [],
};
