/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {

    extend: {
      colors:{
        'dark-blue':'#2749A3',
        'ocean-blue':'#307DA2',
        'blue':'#86B6CD',
        'baby-blue':'#C6E6FF',
        'yellow':'#F3C762',
        'light-blue':'#F0F8FF',
        'grey':'#7D7A83',
        'light-grey':'#E0E0E0',
      },
      fontFamily: {
        LPPA: ["Kodchasan",'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
}
