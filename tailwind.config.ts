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
    themes: ["bumblebee"],
  },
};
export default config;
