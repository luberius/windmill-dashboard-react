const defaultTheme = require('tailwindcss/defaultTheme');
const windmill = require('@luberius/fork-windmill-react-ui/config');

module.exports = windmill({
  mode: 'jit',
  purge: [
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/containers/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './node_modules/react-toastify/dist/ReactToastify.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        bottom: '0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)'
      }
    }
  }
});
