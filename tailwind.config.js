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
        'centro-dev': "url('/src/assets/bg-dev-center.png')",
        'checkout': "url('/src/assets/bg-s-checkout.png')",
        'card': "url('/src/assets/card.png')",
        'presale': "url('/src/assets/bg-presale.png')",
        'certificate': "url('/src/assets/bg-certificate.png')"
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

