import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// `npm run dev`        → http (fine on the laptop; phones refuse geolocation over http)
// `npm run dev:https`  → self-signed https so a phone on the same Wi-Fi can share location
// GITHUB_PAGES=1       → build for https://<user>.github.io/kAppit/ (set by the deploy workflow)
const https = process.env.HTTPS === "1";
const pages = process.env.GITHUB_PAGES === "1";

/** GitHub Pages has no SPA rewrite: it serves 404.html for unknown paths.
 *  Shipping a copy of index.html as 404.html makes deep links like /welcome work. */
function spaFallback() {
  return {
    name: "spa-404-fallback",
    closeBundle() {
      const dir = resolve(__dirname, "dist");
      copyFileSync(resolve(dir, "index.html"), resolve(dir, "404.html"));
    },
  };
}

export default defineConfig({
  base: pages ? "/kAppit/" : "/",
  plugins: [react(), ...(https ? [basicSsl()] : []), ...(pages ? [spaFallback()] : [])],
  server: { host: true },
  optimizeDeps: { exclude: ["maplibre-gl"] },
});
