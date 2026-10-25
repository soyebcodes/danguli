import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        rickshaw: {
          red: "#f43f5e",
          yellow: "#facc15",
          green: "#22c55e",
          ink: "#1f2937",
          cream: "#fff7ed",
        },
      },
      boxShadow: {
        panel: "0 20px 50px rgba(15, 23, 42, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
