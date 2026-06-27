/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyberBg: '#0B1220',
        cyberBlue: '#2563EB',
        cyberDanger: '#DC2626',
        cyberSuccess: '#16A34A',
      }
    },
  },
  plugins: [],
}