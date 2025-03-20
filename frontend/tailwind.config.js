/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "flapp-blue": "#aad8ff",
        "flapp-lightBg": "#f6fbff",
        "flapp-dark": "#131a35",
        "flapp-gray": "#76777c",
        "flapp-lightGray": "#e2e2e2",
      },
      boxShadow: {
        card: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)",
        "card-hover":
          "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
