/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
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
        'presale': "url('/src/assets/bg-presale.jpg')",
        'certificate': "url('/src/assets/bg-certificate.png')",
        'activity': "url('/src/assets/activity.png')",
        'espaco': "url('/src/assets/espaco.jpg')",
        'espaco2': "url('/src/assets/espaco2.jpg')",
        'florest': "url('/src/assets/bg-florest.jpg')",
      },
      colors: {
  			background: 'green',
  			container: {
  				primary: '#03364B',
  				secondary: '#012939'
  			},
  			green: {
  				primary: '#75D63A',
          secondary: '#062c01',
  				header: '#044640',
          btn: '#229B13'
  			},
  			blue: {
  				primary: '#3E9EF5'
  			}
  		},
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

