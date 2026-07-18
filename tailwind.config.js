/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        // 主色：引用 CSS 变量，随主题切换
        primary: {
          50: "var(--color-primary-bg, #fff7ed)",
          100: "var(--color-primary-bg, #ffedd5)",
          200: "var(--color-primary-bg, #fed7aa)",
          300: "var(--color-primary-light, #fdba74)",
          400: "var(--color-primary-light, #fb923c)",
          500: "var(--color-primary, #f97316)",
          600: "var(--color-primary-dark, #ea580c)",
          700: "var(--color-primary-dark, #c2410c)",
          800: "var(--color-primary-dark, #9a3412)",
          900: "var(--color-primary-dark, #7c2d12)",
        },
        secondary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        // 背景与文字层：引用 CSS 变量
        bg: {
          base: "var(--color-bg-base)",
          soft: "var(--color-bg-soft)",
          card: "var(--color-bg-card)",
          hover: "var(--color-bg-hover)",
        },
        content: {
          strong: "var(--color-text-strong)",
          base: "var(--color-text-base)",
          muted: "var(--color-text-muted)",
        },
        // 兼容旧 dark-100/200/300 用法，映射到暖色变量
        dark: {
          100: "var(--color-bg-card)",
          200: "var(--color-bg-soft)",
          300: "var(--color-bg-base)",
        },
      },
      fontFamily: {
        mono: ["Roboto Mono", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
