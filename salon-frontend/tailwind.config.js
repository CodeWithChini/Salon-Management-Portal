/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1A1611',
          50: '#F5F3F0',
          100: '#E8E3DC',
          200: '#C9C0B3',
          300: '#A99C89',
          400: '#7C6F5C',
          500: '#564C3E',
          600: '#3A3226',
          700: '#2A241B',
          800: '#1A1611',
          900: '#100D09',
        },
        stone: {
          DEFAULT: '#ECE7DD',
          50: '#FBFAF7',
          100: '#F5F2EB',
          200: '#ECE7DD',
          300: '#DDD5C4',
        },
        brass: {
          DEFAULT: '#AD8A4E',
          50: '#F8F2E7',
          100: '#EFE1C4',
          200: '#DEC48D',
          300: '#CBA968',
          400: '#AD8A4E',
          500: '#8C6E3B',
          600: '#6C542C',
          700: '#4E3C1F',
        },
        emerald: {
          DEFAULT: '#2C4A3B',
          50: '#EAF0EC',
          100: '#C7D9CD',
          200: '#93B6A2',
          300: '#5E8E72',
          400: '#3D6B53',
          500: '#2C4A3B',
          600: '#1F362A',
          700: '#15251D',
        },
        clay: {
          DEFAULT: '#AC5240',
          50: '#F7E9E5',
          100: '#EAC3BA',
          200: '#D89686',
          300: '#C36F5A',
          400: '#AC5240',
          500: '#8A4032',
          600: '#672F25',
        },
        gold: {
          DEFAULT: '#C79A3F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(26,22,17,0.06)',
        lift: '0 12px 30px -12px rgba(26,22,17,0.35)',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
