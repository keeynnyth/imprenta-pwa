import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "LAGOGRAPHI | Sistema de Gestión",
        short_name: "LAGOGRAPHI",
        description:
          "Sistema de Gestión de Imprenta LAGOGRAPHI",

        theme_color: "#f97316",
        background_color: "#f1f5f9",

        display: "standalone",
        orientation: "portrait",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "icono-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icono-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});