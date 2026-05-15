import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0B10",
        panel: "#12141D",
        line: "rgba(255,255,255,0.10)",
        mint: "#67E8A5",
        sky: "#6BD3FF",
        amber: "#F8C65B",
        rose: "#FF7E9D"
      },
      boxShadow: {
        soft: "0 20px 80px rgba(0,0,0,0.26)",
        glow: "0 0 0 1px rgba(103,232,165,0.20), 0 18px 60px rgba(107,211,255,0.18)"
      }
    }
  },
  plugins: []
};

export default config;
