import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 1920,
    host: true,
    proxy: {
      "/api": {
        target: "https://newtechbot.ru",
        changeOrigin: true,
      },
    },
  },
});
