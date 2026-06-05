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
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        border: "var(--color-border)",
        ink: "var(--color-ink)",
        accent: "var(--color-accent)",
        "accent-dim": "var(--color-accent-dim)",
        "accent-bg": "var(--color-accent-bg)",
        "code-bg": "var(--color-code-bg)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
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
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        glow: "0 0 0 3px rgba(22,163,74,0.15)",
      },
    },
  },
  plugins: [],
};
