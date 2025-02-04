import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        action: "#FF3131",
      },
      backgroundColor: {
        primary: "#0d0d0d",
        secondary: "#171717",
      },
      backgroundImage: {
        custom_gradient:
          "linear-gradient(45deg, rgb(63 100 233 / 45%), rgb(233 63 63 / 45%),rgb(255 184 0 / 45%))",
      },

      textColor: {
        primary: "#ffffff",
      },
      boxShadow: {
        primary: "0 0 5px 5px #202020",
      },

      keyframes: {
        loadingBar: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
        scale: {
          "0%": { transform: "scale(1.0)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1.0)" },
        },
      },
      animation: {
        scaleSize: "scale 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
