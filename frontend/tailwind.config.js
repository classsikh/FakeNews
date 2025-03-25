/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        'hero': '100vh',
      },
      colors: {
        'hero': {
          'primary': '#1a1a1a',
          'secondary': '#2a2a2a',
          'accent': '#3a3a3a',
        },
      },
      animation: {
        grain: 'grain 8s steps(10) infinite',
        fadeIn: 'fadeIn 1s ease-in',
        slideDown: 'slideDown 0.8s ease-out',
        slideUp: 'slideUp 0.8s ease-out',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0)' },
          '70%': { transform: 'translate(0, 10%)' },
          '80%': { transform: 'translate(-15%, 0)' },
          '90%': { transform: 'translate(10%, 5%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '.5',
          },
        },
      },
      boxShadow: {
        'glow': '0 0 30px -5px rgba(0, 0, 0, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      backgroundOpacity: {
        '15': '0.15',
        '85': '0.85',
      },
      backgroundImage: {
        'feature-pattern': "url('/src/assets/noise.png')",
        'dots': 'radial-gradient(circle, #333333 1px, transparent 1px)',
        'grid': 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
      },
      backgroundSize: {
        'dots-sm': '20px 20px',
        'dots-md': '30px 30px',
        'grid-sm': '20px 20px',
        'grid-md': '30px 30px',
      },
      backgroundPosition: {
        'feature': 'center center',
      },
      backgroundBlendMode: {
        'overlay': 'overlay',
        'soft-light': 'soft-light',
      },
    },
  },
  plugins: [],
}
