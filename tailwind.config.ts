import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // الألوان الأساسية
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",

        // ألوان تيليجرام المخصصة (المضافة حديثاً)
        tg: {
          bg: "var(--tg-bg)",
          'bg-dark': "var(--tg-bg-dark)",
          card: "var(--tg-card)",
          'card-dark': "var(--tg-card-dark)",
          text: "var(--tg-text)",
          'text-dark': "var(--tg-text-dark)",
          'text-light': "var(--tg-text-light)",
          'text-light-dark': "var(--tg-text-light-dark)",
          blue: "var(--tg-blue)",
          light: "var(--tg-light)",
          success: "var(--tg-success)",
          warning: "var(--tg-warning)",
          error: "var(--tg-error)",
        },

        // ألوان المخططات (احتفظ بها إذا كنت تستخدمها)
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        
        // ألوان الشريط الجانبي (اختياري)
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      
      // إضافة تدرجات لونية لتخفيف السطوع (اختياري)
      backgroundImage: {
        'tg-gradient-light': 'linear-gradient(to bottom, var(--tg-bg), hsl(0, 0%, 90%)',
        'tg-gradient-dark': 'linear-gradient(to bottom, var(--tg-bg-dark), hsl(220, 13%, 10%)',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
} satisfies Config;