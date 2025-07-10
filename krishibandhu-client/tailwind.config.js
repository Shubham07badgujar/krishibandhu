module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        'pulse-sun': 'pulseSun 2s infinite',
        'rain-drop': 'raindrop 1.5s infinite linear',
        'cloud-move': 'cloudMove 10s linear infinite',
        'lightning': 'flash 1s infinite'
      },
      keyframes: {
        pulseSun: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' }
        },
        raindrop: {
          '0%': { top: '-20%' },
          '100%': { top: '120%' }
        },
        cloudMove: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        flash: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
