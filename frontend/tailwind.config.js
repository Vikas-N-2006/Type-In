/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
   extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      colors: {
        // You can add the CS theme colors here if needed, but they are already in the components
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

