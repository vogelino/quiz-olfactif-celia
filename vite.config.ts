import path from "node:path";

import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@memory": path.resolve(__dirname, "src/games/Memory"),
    },
  },
  plugins: [
    solidStart({ ssr: false }),
    tailwindcss(),
    nitro(process.env.VERCEL ? { preset: "vercel" } : {}),
  ],
});
