import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

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
