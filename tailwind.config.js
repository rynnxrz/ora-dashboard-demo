/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ora: {
                    primary: '#2A9D8F',  // Teal
                    dark: '#264653',     // Dark Blue
                    light: '#E9F5F5',    // Light BG
                    warning: '#E9C46A',  // Yellow
                    danger: '#E76F51',   // Red/Orange
                    accent: '#F4A261'    // Sandy
                }
            },
            fontSize: {
                'xxs': '0.65rem'
            }
        },
    },
    plugins: [],
}
