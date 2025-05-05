/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'white': '#FFF',
                'blue': '#2523D5',
                'pink': '#FA3C91'
            },
            fontFamily: {
                sora: ['Sora', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
