import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  purge: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },

      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Assuming 'inter' is your custom font
      },
      colors: {
        cardBlue: {
          400: '#257bff',
        },

        activeSoft: {
          400: '#aff0fa',
          500: '#8bbfc6',
          600: '#678d93',
        },

        cancelColor:{
          400: '#eb2a2a',
          500: '#cc4343',
          600: '#993232'
        },

        cancelColorSoft:{
          100: '#f26363',
        },

        cardYellow: {
          400: '#ffaf25',
        },

        cardGreen: {
          400: '#1df57e',
        },
        
        cardRed: {
          400: '#f51d1d',
        },
        
        dashTitleColor: {
          400: '#393939',
        },

        dborderColor: {
          400: '#b3b3b3',
        },

        activeColor: {
          400: '#24c4ff',
          500: '#1AA5BB',
          600: '#0f616E',
        },

        colorBackground: {
          400: '#22d3ee',
          500: '#1aa5bb',
          600: '#0f616e',
        },

        defaultColor: {
          100: '#FFFFFF',
          200: '#f2f2f2',
        },

        blankBackground: {
          100: '#FFFFFF',
          200: '#cccccc',
          300: '#999999',
          400: '#656565',
        },

        cyanWhiteBackground: {
          100: '#CFFAFE',
          200: '#A5C7CB',
          300: '#7B9597',
        },

        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    function({ addUtilities }: { addUtilities: (utilities: Record<string, any>) => void }) {
      addUtilities({
        '.default-title-style': {
          '@apply text-xl md:text-2xl font-extrabold text-dashTitleColor-400': {},
          'font-family': 'Inter, sans-serif',
        },
      });
    },
  ],
};

export default config;
