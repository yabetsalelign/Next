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
          DEFAULT: "#F7F8FA",
          dark: "#0F141C",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F1F3F6",
          dark: "#171E29",
          darkMuted: "#1E2736",
        },
        brand: {
          50: "#EEF2F8",
          100: "#D9E3F0",
          200: "#B5C8E1",
          300: "#8FAECF",
          400: "#658FBD",
          500: "#3D6F9E",
          600: "#2B5279",
          700: "#1E3B58",
          800: "#14283C",
          900: "#0D1A27",
        },
        ink: {
          primary: "#0F172A",
          secondary: "#475569",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        gentle: {
          green: "#2A724E",
          greenBg: "#EBF6F0",
          amber: "#995A1E",
          amberBg: "#FDF4EB",
          coral: "#A33C3C",
          coralBg: "#FDF0F0",
          lavender: "#495898",
          lavenderBg: "#EEF1FA",
        },
        'surface-dim': '#cbdbf5',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e3ecfa',
        'surface-container-lowest': '#ffffff',
        'brand-primary': '#1e3851',
        'brand-secondary': '#365f80',
        'gentle-green': '#e8f8f0',
        'gentle-green-text': '#1b6d47',
        'gentle-amber': '#fff4e6',
        'gentle-amber-text': '#8c5311',
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
