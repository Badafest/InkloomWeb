/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-dark": "#023047",
        primary: "#219ebc",
        "primary-light": "#8ecae6",
        secondary: "#fb8500",
        "secondary-light": "#ffb703",
        success: "#386641",
        danger: "#bc4749",
        white: "#fffffc",
        gray: "#39444a",
        black: "#01161e",
      },
      fontFamily: {
        sans: ["'Inter'", 'ui-serif', 'serif'],
        mono: ["'Fira Code'", 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}