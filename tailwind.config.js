// tailwind.config.js

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      maxWidth: {
        "9xl": "96rem", // This adds a 9xl size, 96rem is equivalent to 1536px
      },
    },
  },
  plugins: [],
};
