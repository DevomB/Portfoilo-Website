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
        secondary: "var(--color-secondary)",
        "secondary-dim": "var(--color-secondary-dim)",
        "secondary-bg": "var(--color-secondary-bg)",
        danger: "var(--color-danger)",
        warn: "var(--color-warn)",
        ok: "var(--color-ok)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        brand: ["var(--font-brand)", "system-ui", "sans-serif"],
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
