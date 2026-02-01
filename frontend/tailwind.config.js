/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#4f46e5',
                    hover: '#4338ca',
                },
                secondary: '#64748b',
                background: '#fdfdfd',
                foreground: '#1a1a1a',
            },
            fontFamily: {
                inter: ['var(--font-inter)', 'sans-serif'],
                outfit: ['var(--font-outfit)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
