module.exports = {
  prefix: 'tw-',
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      gridTemplateRows: {
        auto: 'auto',
      }
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
