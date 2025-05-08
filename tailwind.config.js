/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "var(--primary-dark)",
        "primary-dark-50": "var(--primary-dark)-50",
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        secondary: "var(--secondary)",
        "secondary-light": "var(--secondary-light)",
        success: "var(--success)",
        danger: "var(--danger)",
        white: "var(--white)",
        gray: "var(--gray)",
        black: "var(--black)",
      },
      fontFamily: {
        sans: ["'Inter'", 'ui-serif', 'serif'],
        mono: ["'Fira Code'", 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}