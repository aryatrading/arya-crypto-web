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
    padding: "1.5rem"
  },
  extend: {
    typography: (theme) => ({
      DEFAULT: {
        css: {
          color: theme('colors.white'),
        },
      },
    }),
    screens: {
      '2xl': '1440px',
    },
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
        6: '#1E293B',
        7: '#334155',
      },
      black: {
        1: "#030712",
        2: "#0E1421"
      },
      yellow: {
        1: "#F3BA2F"
      },
      orange: {
        1: "#F7931A"
      }
    },
    keyframes: {
      overlayShow: {
        from: { opacity: 0 },
        to: { opacity: .3 },
      },
      contentShow: {
        from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
        to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
      },
    },
    animation: {
      overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
      contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  fontFamily: {
    sans: ['var(--poppins-font)', ...fontFamily.sans],
  }
}

export const plugins = [
  require("flowbite/plugin")
]

