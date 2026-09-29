import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { host: true },                       // reachable from your phone on the same Wi-Fi
  optimizeDeps: { exclude: ["maplibre-gl"] },   // its web worker doesn't like the dep optimizer
});
