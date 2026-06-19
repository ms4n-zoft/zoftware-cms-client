/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"],
        syne: ["Syne", "-apple-system", "BlinkMacSystemFont", "\"Segoe UI\"", "sans-serif"],
      },
    },
  },
};
