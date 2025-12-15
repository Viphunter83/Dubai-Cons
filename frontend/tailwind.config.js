
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0f0f13',
                card: 'rgba(255, 255, 255, 0.03)',
                glass: 'rgba(20, 20, 25, 0.7)',
                gold: {
                    light: '#f4d03f',
                    DEFAULT: '#d4af37',
                    dark: '#b48f17',
                },
                cyan: {
                    light: '#33fffc',
                    DEFAULT: '#00f2ea',
                    dark: '#00c2bb',
                },
                magenta: {
                    light: '#ff3377',
                    DEFAULT: '#ff0055',
                    dark: '#cc0044',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(212, 175, 55, 0.15)',
                'glow-hover': '0 0 30px rgba(212, 175, 55, 0.3)',
            }
        },
    },
    plugins: [],
}
