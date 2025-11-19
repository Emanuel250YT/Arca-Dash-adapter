/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["var(--font-raleway)"],
        dancing: ["var(--font-dancing-script)"],
        alanta: ["var(--font-alanta)"],
        brlnsr: ["var(--font-brlnsr)"],
        comfortaabold: ["var(--font-comfortaabold)"],
        comfortaalight: ["var(--font-comfortaalight)"],
        comfortaaregular: ["var(--font-comfortaaregular)"],
        lovinaitalic: ["var(--font-lovinaitalic)"],
        lovinaregular: ["var(--font-lovinaregular)"],
        minal: ["var(--font-minal)"],
        silverstar: ["var(--font-silverstar)"],
      },
    },
  },
  plugins: [],
};
