/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'darkBlue': '#2749A3',
        'oceanBlue': '#307DA2',
        'blue': '#86B6CD',
        'babyBlue': '#C6E6FF',
        'lightBlue': '#F0F8FF',

        'midGreen': '#00a76f',
        'lightGreen': '#B8E3CA',
        'darkRed': '#B71D18',
        'brightRed': '#FF5630',
        'lightOrange': '#E3B8B1',
        'darkOrange': '#AF6A5F',
        'yellow': '#F3C762',

        'black': '#000000',
        'grey': '#7D7A83',
        'midGrey': '#d2d2d2',
        'light-grey': '#E0E0E0',
        'whiteGrey': '#f4f6f8',
        'white': '#ffffff',

        'lighter-grey': '#F4F2F2',
        'blue-2':"#9FC8D8",
      },
      fontFamily: {
        LPPA: ["Kodchasan", 'sans-serif'],
      },
      height: {
        '9/10': '90%',
        '8/10': '80%',
        '36rem': '36rem',
        '30rem': '30rem',
        'nmax': 'calc(100vh - 64px)',

      },minHeight: {
        '9/10': '90%',
        '8/10': '80%',
        '36rem': '36rem',
        '30rem': '30rem',
        'nmax': 'calc(100vh - 64px)',
      },
      width: {
        '9/10': '90%',
        '8/10': '80%',
        '36rem': '36rem',
        '30rem': '30rem',
      },
      minWidth: {
        '9/10': '90%',
        '8/10': '80%',
        '36rem': '36rem',
        '30rem': '30rem',
      },
      flex: {
        center: '0 1 auto',
      },
    },
  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities }) {
      const newUtilities = {
        '.flex-center': {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      };

      addUtilities(newUtilities);
    }
  ],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "aqua", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
}
