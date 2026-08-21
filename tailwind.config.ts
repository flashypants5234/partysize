import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050c1a",
          900: "#0b1e3a",
          800: "#122a52",
          700: "#1a3a6e",
          600: "#234a8a",
        },
        accent: {
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
        },
        brass: {
          100: "#f5edd9",
          400: "#c8a951",
          600: "#a4842f",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
