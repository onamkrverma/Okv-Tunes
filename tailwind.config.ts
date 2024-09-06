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
    },
  },
  plugins: [],
};
export default config;
