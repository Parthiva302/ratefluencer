/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        surface: '#1E293B',
        primary: '#8B5CF6',
        secondary: '#1E293B',
        accent: '#8B5CF6',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        textLight: '#F1F5F9',
        textMuted: '#94A3B8'
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
