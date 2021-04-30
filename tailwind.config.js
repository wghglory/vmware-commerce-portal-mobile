// https://dev.to/angular/setup-tailwindcss-in-angular-the-easy-way-1i5l

module.exports = {
  purge: { enabled: process.env.NODE_ENV === 'production', content: ['./src/**/*.{html,ts}'] },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'cds-dark': 'var(--cds-global-color-construction-800)',
      },
    },
    // https://tailwindcss.com/docs/breakpoints
    screens: {
      xs: '576px',
      sm: '768px',
      // => @media (min-width: 768px) { ... }
      md: '992px',
      lg: '1200px',
      xl: '1440px',
      '2xl': '1600px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
