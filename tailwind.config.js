/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage:{
        'folha-papiro': "url('/src/assets/bg-papiro.png')",
        'folha-recibo': "url('/src/assets/nota.png')",
        'certificate-instagram': "url('/src/assets/bg-certificate.jpg')",
        'centro-pesquisa': "url('/src/assets/bg-centro-pesquisa.png')",
        'centro-pesquisa2': "url('/src/assets/bg-centro-pesquisa2.png')",
      }
    },
  },
  plugins: [],
}

