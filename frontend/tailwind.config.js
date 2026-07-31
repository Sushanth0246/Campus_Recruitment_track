/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0F1220",
        surface: "#171B2E",
        surfaceAlt: "#1E2440",
        border: "#2A3050",
        amber: {
          DEFAULT: "#F5A623",
          soft: "#FCD9A0",
        },
        teal: {
          DEFAULT: "#2DD4BF",
        },
        violet: {
          DEFAULT: "#7C6CF0",
        },
        coral: {
          DEFAULT: "#EF6461",
        },
        ink: {
          DEFAULT: "#E7E9F5",
          muted: "#9AA1C4",
          faint: "#5E6489",
        },
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.04) inset, 0 8px 24px -12px rgba(0,0,0,0.5)",
        glow: "0 0 0 1px rgba(245,166,35,0.35), 0 0 24px rgba(245,166,35,0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
