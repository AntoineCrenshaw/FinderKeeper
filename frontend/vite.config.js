import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000/api",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5000/uploads",
      },
    },
  },
});
