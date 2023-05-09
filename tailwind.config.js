/** @type {import('tailwindcss').Config} */

// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme'

export const darkMode = "class"
export const content = [
  "./node_modules/flowbite-react/**/*.js",
  "./src/**/*.{js,ts,jsx,tsx}",
  'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  "./node_modules/flowbite/**/*.js"
]
export const theme = {
  container: {
    center: true,
    padding: "2rem",
    screens: {
      "2xl": "1400px",
    },
  },
  extend: {
    typography: (theme) => ({
      DEFAULT: {
        css: {
          color: theme('colors.white'),
        },
      },
    }),
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
        5: "#1C1C1C",
      },
      black: {
        1: "#030712",
        2: "#0E1421"
      },
      yellow: {
        1: "#F3BA2F"
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

