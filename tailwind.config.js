/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        green: {
          1: "#22C55E",
          2: "#0E3F2D",
        },
        blue: {
          1: "#558AF2",
          2: "#84ADFF",
          3: "#213660"
        },
        red: {
          1: "#F2323F",
          2: "#440C10",
        },
        grey: {
          1: "#6B7280",
          2: "#111827",
          3: "#1F2A41",
          4: "#2B3958",
          5: '#1E293B'
        },
        black: {
          1: "#030712",
          2: "#0E1421"
        },
        yellow: {
          1: "#F3BA2F"
        },
        orage: {
          1: "#F7931A"
        }
      }
    },
    fontFamily: {
      sans: ['var(--poppins-font)', ...fontFamily.sans],
    }
  },
}
export const plugins = [
  require("flowbite/plugin")
]

