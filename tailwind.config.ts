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
          dark: "#121316", // Editorial dark background from Untitled-1
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F5F2EB",
          dark: "#1B1B1F", // Surface container low
          darkMuted: "#161719",
          darkElevated: "#1F1F23", // Surface container
          darkHigh: "#292A2D", // Surface container high
          darkHighest: "#343538", // Surface container highest
        },
        linen: {
          DEFAULT: "#E3E2E6", // Editorial off-white / on-surface in dark mode
          muted: "#D8C3AE",   // on-surface-variant
          subtle: "#A08E7B",  // outline
          faint: "#6E6459",
        },
        brand: {
          50: "#FAF6EE",
          100: "#F5ECD8",
          200: "#EBD8B1",
          300: "#DFC187",
          400: "#D4AB5E",
          500: "#FFB963", // Editorial warm amber gold
          600: "#E59318",
          700: "#8D6020",
          800: "#6B4617",
          900: "#492E0E",
        },
        amber: {
          50: "#FDF9EE",
          100: "#FAEFD4",
          200: "#F5DDA9",
          300: "#EFC679",
          400: "#FFC785",
          500: "#FFB963", // Primary active CTA (Warm Amber Gold from Untitled-1)
          600: "#E59318",
          700: "#CA7927",
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
          amber: "#FFB963",
          amberBg: "#2A2015",
          coral: "#D96B43",
          coralBg: "#FBECE6",
          lavender: "#83CFFF",
          lavenderBg: "#142838",
        },
        'surface-dim': '#121316',
        'surface-container-low': '#1B1B1F',
        'surface-container': '#1F1F23',
        'surface-container-high': '#292A2D',
        'surface-container-highest': '#343538',
        'surface-container-lowest': '#0D0E11',
        'brand-primary': '#FFB963',
        'brand-secondary': '#4E9B78',
        'gentle-green': '#4E9B78',
        'gentle-green-text': '#A7DCBE',
        'gentle-amber': '#FFB963',
        'gentle-amber-text': '#FFDDAC',
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
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 3px -1px rgba(0, 0, 0, 0.05)",
        focus: "0 8px 24px -4px rgba(255, 185, 99, 0.15), 0 3px 6px -2px rgba(0, 0, 0, 0.1)",
        sheet: "0 -8px 30px rgba(0, 0, 0, 0.2)",
      },
      borderRadius: {
        // Tightened radii across all screens to ensure disciplined geometry
        '3xl': '1rem',
        '4xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
export default config;
