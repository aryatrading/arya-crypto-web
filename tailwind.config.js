/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      green_light: "#22C55E",
      green_dark: "#0E3F2D",
      blue_light: "#84ADFF",
      blue_dark: "#558AF2",
      blue_darker: "#213660",
      red_light: "#F2323F",
      red_dark: "#440C10",
      grey_light: "#6B7280",
      grey_dark: "#111827",
      grey_darker: "#1F2A41",
      grey_darkest: "#2B3958",
      black_dark: "#0E1421",
      black_darker: "#030712",
      yellow: "#F3BA2F"
    }
  },
  plugins: [],
}

