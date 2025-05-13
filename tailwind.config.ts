import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cream-50": "#FFFAEB",
        "medical-blue": {
          50: "#EBF8FF",
          100: "#D1EBFF",
          500: "#3B82F6",
          700: "#1D4ED8",
          900: "#1E3A8A",
        },
        "medical-teal": {
          50: "#F0FDFA",
          100: "#CCFBF1",
          500: "#14B8A6",
          700: "#0F766E",
          900: "#134E4A",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
}

export default config 