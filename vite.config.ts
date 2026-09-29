import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// `npm run dev` → http (fine on the laptop; phones refuse geolocation over http)
// `npm run dev:https` → self-signed https so a phone on the same Wi-Fi can share location
const https = process.env.HTTPS === "1";

export default defineConfig({
  plugins: [react(), ...(https ? [basicSsl()] : [])],
  server: { host: true },
  optimizeDeps: { exclude: ["maplibre-gl"] },
});
