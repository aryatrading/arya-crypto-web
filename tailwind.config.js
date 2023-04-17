/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      green_one: "#22C55E",
      green_two: "#0E3F2D",
      blue_two: "#84ADFF",
      blue_one: "#558AF2",
      blue_three: "#213660",
      red_one: "#F2323F",
      red_two: "#440C10",
      grey_one: "#6B7280",
      grey_two: "#111827",
      grey_three: "#1F2A41",
      grey_four: "#2B3958",
      black_two: "#0E1421",
      black_one: "#030712",
      yellow_one: "#F3BA2F",
      white: "#F9FAFB"
    }
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

