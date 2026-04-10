import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: "0",
      DEFAULT: "0",
      sm: "0",
      md: "0",
      lg: "0",
      xl: "0",
      full: "0",
    },
    extend: {
      colors: {
        navy: "#1B2838",
        gold: "#E8B800",
        "grey-text": "#6B7B8D",
        "grey-border": "#E8ECF0",
        "grey-bg": "#F5F6F8",
        "input-border": "#D0D5DC",
        green: "#2E7D32",
        amber: "#E8A000",
        red: "#C62828",
        background: "#FFFFFF",
        foreground: "#1B2838",
      },
      fontFamily: {
        sans: ["'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
