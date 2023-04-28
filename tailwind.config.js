/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage:{
        'folha-papiro': "url('/src/assets/bg-papiro.png')",
        'folha-recibo': "url('/src/assets/nota.png')"
      }
    },
  },
  plugins: [],
}

