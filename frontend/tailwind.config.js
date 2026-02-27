/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./src/**/*.{js,jsx}', './index.html'],
    theme: {
        extend: {
            colors: {
                neon: {
                    green: '#00ff88',
                    cyan: '#00d4ff',
                    blue: '#00d4ff',
                    yellow: '#ffdd00',
                    gold: '#ffc800',
                    pink: '#ff00ff',
                },
                dark: {
                    base: '#0a0a0f',
                    card: '#0f0f1a',
                    border: '#1a1a2e',
                },
            },
            fontFamily: {
                orbitron: ['"Orbitron"', 'sans-serif'],
                mono: ['"Share Tech Mono"', '"JetBrains Mono"', 'monospace'],
                jetbrains: ['"JetBrains Mono"', 'Consolas', 'monospace'],
                exo: ['"Exo 2"', 'sans-serif'],
            },
            boxShadow: {
                'glow-green': '0 0 20px rgba(0,255,136,0.4), 0 0 60px rgba(0,255,136,0.1)',
                'glow-cyan': '0 0 20px rgba(0,212,255,0.4)',
                'glow-pink': '0 0 20px rgba(255,0,255,0.4)',
                'glow-gold': '0 0 20px rgba(255,200,0,0.4)',
            },
            backgroundImage: {
                'cyber-grid': "linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)",
                'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            keyframes: {
                float: {
                    '0%,100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                'pulse-glow': {
                    '0%,100%': { boxShadow: '0 0 10px rgba(0,255,136,0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(0,255,136,0.8)' },
                },
                scan: {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '0 200px' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '0% 0%' },
                    '100%': { backgroundPosition: '200% 200%' },
                },
                logoPulse: {
                    '0%,100%': { textShadow: '0 0 10px rgba(0,255,136,0.4)' },
                    '50%': { textShadow: '0 0 30px rgba(0,255,136,0.9)' },
                },
                statusPulse: {
                    '0%,100%': { opacity: '1' },
                    '50%': { opacity: '0.2' },
                },
                ripple: {
                    from: { transform: 'scale(0)', opacity: '0.4' },
                    to: { transform: 'scale(3)', opacity: '0' },
                },
                powerOn: {
                    '0%': { opacity: '0' },
                    '20%': { opacity: '0.4' },
                    '100%': { opacity: '0' },
                },
            },
            animation: {
                float: 'float 4s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                shimmer: 'shimmer 4s ease-in-out infinite',
                logoPulse: 'logoPulse 3s ease-in-out infinite',
                statusPulse: 'statusPulse 1.4s ease-in-out infinite',
                ripple: 'ripple 0.6s ease-out forwards',
            },
        },
    },
    plugins: [],
}
