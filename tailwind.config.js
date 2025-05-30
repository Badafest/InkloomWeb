/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "var(--primary-dark)",
        "border": "var(--border)",
        primary: "var(--primary)",
        "primary-light": "var(--primary-light)",
        secondary: "var(--secondary)",
        "secondary-light": "var(--secondary-light)",
        success: "var(--success)",
        danger: "var(--danger)",
        white: "var(--white)",
        gray: "var(--gray)",
        "gray-50": "var(--gray-50)",
        black: "var(--black)",
      }
    },
  },
  plugins: [],
}