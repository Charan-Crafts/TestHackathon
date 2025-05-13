/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'gradient-x': 'gradient-x 10s ease infinite',
        'shine': 'shine 2s linear infinite',
        'shine-slow': 'shine 8s linear infinite',
        'pulse-shadow': 'pulse-shadow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-in-out',
        'blink': 'blink 1s step-end infinite',
        'twinkle': 'twinkle 5s ease-in-out infinite',
        'rotate-y-90': 'rotateY90 0.5s ease-in-out forwards',
        'rotate-y-0': 'rotateY0 0.5s ease-in-out forwards',
        'translate-z-10': 'translateZ10 0.3s ease-out forwards',
        'tilt': 'tilt 10s infinite linear',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'scale-check': 'scale-check 0.5s ease-out forwards 0.2s',
        'slideIn': 'slideIn 0.5s ease-out',
        'spin': 'spin 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-shadow': {
          '0%, 100%': {
            'box-shadow': '0 0 15px 5px rgba(139, 92, 246, 0.3)',
          },
          '50%': {
            'box-shadow': '0 0 20px 5px rgba(139, 92, 246, 0.6)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        rotateY90: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(90deg)' },
        },
        rotateY0: {
          '0%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        translateZ10: {
          '0%': { transform: 'translateZ(0)' },
          '100%': { transform: 'translateZ(10px)' },
        },
        tilt: {
          '0%, 50%, 100%': {
            transform: 'rotate(0deg)',
          },
          '25%': {
            transform: 'rotate(0.5deg)',
          },
          '75%': {
            transform: 'rotate(-0.5deg)',
          },
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-check': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        slideIn: {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.5,
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        spin: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      perspective: {
        '500': '500px',
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      rotate: {
        'y-90': 'rotateY(90deg)',
        'y-10': 'rotateY(10deg)',
        'y-0': 'rotateY(0)',
      },
      translate: {
        'z-10': 'translateZ(10px)',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(139, 92, 246, 0.5)',
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.5)',
        'glow-purple': '0 0 15px -3px rgba(126, 34, 206, 0.5)',
        'glow-blue': '0 0 15px -3px rgba(37, 99, 235, 0.5)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      colors: {
        brand: {
          900: '#3D52A0', // Deep blue
          700: '#7091E6', // Lighter blue
          500: '#8697C4', // Muted blue
          300: '#ADBBDA', // Pale blue
          100: '#EDE8F5', // Very light blue
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 