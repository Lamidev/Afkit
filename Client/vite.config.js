// import path from "path"
// import tailwindcss from "@tailwindcss/vite"
// import react from "@vitejs/plugin-react"
// import { defineConfig } from "vite"

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })


import path from "path"
import tailwindcss from "@tailwindcss/vite" // The main Tailwind Vite plugin
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import typography from '@tailwindcss/typography'; // <--- NEW: Import typography plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      // <--- NEW: Pass options to the tailwindcss plugin
      plugins: [typography], // <--- NEW: Add typography here
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})