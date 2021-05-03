module.exports = {
  prefix: 'tw-',
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
        auto: 'auto',
      }
    },
  },

  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
