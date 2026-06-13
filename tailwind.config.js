/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pitch-black": "#08090a",
        "graphite": "#0f1011",
        "deep-slate": "#161718",
        "charcoal-grey": "#23252a",
        "porcelain": "#f7f8f8",
        "light-steel": "#d8dce0",
        "storm-cloud": "#9ca3af",
        "fog-grey": "#6b7280",
        "aether-blue": "#5e6ad2",
        "violet": "#7b68ee",
        "emerald": "#27a644",
        "warning-red": "#eb5757",
        "cyan-spark": "#02b8cc",
        "amber": "#d4a017",
        "neon-lime": "#e4f222",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.12)",
        md: "0 4px 12px rgba(0, 0, 0, 0.16)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.2)",
        card: "0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.02)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
