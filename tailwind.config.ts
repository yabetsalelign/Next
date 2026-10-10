import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#F7F5F0",
          dark: "#12131C", // Warm dark indigo/charcoal base
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F5F2EB",
          dark: "#1A1B26", // Warm elevated card surface
          darkMuted: "#161722",
          darkElevated: "#222332",
        },
        linen: {
          DEFAULT: "#F4F1EA", // Soft off-white / linen primary text in dark mode
          muted: "#C5C0B6",
          subtle: "#8E887E",
          faint: "#5E5850",
        },
        brand: {
          50: "#FAF6EE",
          100: "#F5ECD8",
          200: "#EBD8B1",
          300: "#DFC187",
          400: "#D4AB5E",
          500: "#C7953B", // Warm gold
          600: "#B07D2C",
          700: "#8D6020",
          800: "#6B4617",
          900: "#492E0E",
        },
        amber: {
          50: "#FDF9EE",
          100: "#FAEFD4",
          200: "#F5DDA9",
          300: "#EFC679",
          400: "#E9AE4E",
          500: "#E5953F", // Primary active CTA (Warm Amber Gold)
          600: "#CA7927",
          700: "#A55C1A",
          800: "#7E4314",
          900: "#4F260A",
        },
        sage: {
          50: "#F2F7F4",
          100: "#E1EDE6",
          200: "#C3DBCF",
          300: "#9CC4B1",
          400: "#75AB92",
          500: "#4E9B78", // Completed / Done state (Muted Sage Green)
          600: "#3D8263",
          700: "#2F674E",
          800: "#224C3A",
          900: "#163125",
        },
        terracotta: {
          DEFAULT: "#D96B43",
          subtle: "#FBECE6",
          dark: "#7A3118",
        },
        ink: {
          primary: "#1C1917",
          secondary: "#57534E",
          muted: "#78716C",
          subtle: "#A8A29E",
        },
        gentle: {
          green: "#4E9B78",
          greenBg: "#E1EDE6",
          amber: "#CA7927",
          amberBg: "#FAEFD4",
          coral: "#D96B43",
          coralBg: "#FBECE6",
          lavender: "#7469B6",
          lavenderBg: "#EFEFF9",
        },
        'surface-dim': '#161722',
        'surface-container-low': '#1A1B26',
        'surface-container': '#222332',
        'surface-container-lowest': '#12131C',
        'brand-primary': '#E5953F',
        'brand-secondary': '#4E9B78',
        'gentle-green': '#4E9B78',
        'gentle-green-text': '#A7DCBE',
        'gentle-amber': '#FAEFD4',
        'gentle-amber-text': '#FADBB4',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: "0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 3px -1px rgba(15, 23, 42, 0.04)",
        focus: "0 8px 24px -4px rgba(43, 82, 121, 0.12), 0 3px 6px -2px rgba(15, 23, 42, 0.05)",
        sheet: "0 -8px 30px rgba(0, 0, 0, 0.08)",
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
