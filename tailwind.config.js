/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        border: "var(--color-border)",
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
      },
      boxShadow: {
        glow: "0 0 48px rgba(91, 157, 255, 0.15), 0 0 80px rgba(167, 139, 250, 0.08)",
      },
    },
  },
  plugins: [],
};
