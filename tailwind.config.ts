/** @format */

import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 1s linear infinite",
        "fade-in": "fadeIn 0.3s ease forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translate(-50%, -40%)" },
          "100%": { opacity: "1", transform: "translate(-50%, -50%)" },
        },
      },
      backgroundImage: {
        linear:
          "linear-gradient(77deg, rgba(10,38,64,1) 16%, rgba(28,61,91,1) 79%)",
        "1": "url('/images/bg/2.jpg')",
      },
      fontFamily: {
        cabin: ["Cabin", "sans-serif"],
        "comic-neue": ["Comic Neue", "sans-serif"],
        arvo: ["Arvo", "serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#00796b",
          "primary-focus": "#004d40",
          "primary-content": "#ffffff",
          secondary: "#ff5722",
          "secondary-focus": "#e64a19",
          "secondary-content": "#ffffff",
          accent: "#ff5722",
          "accent-focus": "#e64a19",
          "accent-content": "#ffffff",
          neutral: "#000000",
          "neutral-focus": "#333333",
          "neutral-content": "#ffffff",
          "base-100": "#000000",
          "base-200": "#121212",
          "base-300": "#1e1e1e",
          "base-content": "#ffffff",
        },
      },
    ],
  },
};
export default config;
