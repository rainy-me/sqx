import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";
import { buildWorker } from "./buildWorker";

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  build: {
    emptyOutDir: true,
    outDir: path.resolve(__dirname, "../dist/client"),
  },
  plugins: [
    vue(),
    // buildWorker()
  ],
  resolve: {
    alias: {
      sqx: path.resolve(__dirname, ".."),
    },
  },
  server: {
    fs: {
      allow: [".."],
    },
    proxy: {
      "^/api/.*": {
        target: "http://localhost:4000/",
        changeOrigin: true,
      },
    },
  },
});
