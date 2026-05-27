// When deploying on Vercel, we bypass @lovable.dev/vite-tanstack-config because it
// hardcodes @cloudflare/vite-plugin. Vercel needs the "vercel" server preset instead.
// For local dev / Cloudflare, the lovable config is used as before.

import { defineConfig as defineViteConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isVercel = !!process.env.VERCEL;

let config;

if (isVercel) {
  // ── Vercel build ──────────────────────────────────────────────────────
  config = defineViteConfig({
    plugins: [
      tsconfigPaths(),
      tailwindcss(),
      tanstackStart({
        server: {
          entry: "server",
          preset: "vercel",
        },
      }),
      react(),
    ],
    build: {
      chunkSizeWarningLimit: 15000,
    },
  });
} else {
  // ── Local dev / Cloudflare build (original lovable config) ────────────
  const { defineConfig } = await import("@lovable.dev/vite-tanstack-config");
  config = defineConfig({
    tanstackStart: {
      server: { entry: "server" },
    },
    vite: {
      build: {
        chunkSizeWarningLimit: 15000,
      },
    },
  });
}

export default config;
