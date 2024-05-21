import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { src: resolve("src/") } },
  build: { lib: { entry: resolve(__dirname, "src/main.ts"), formats: ["es"] } },
  plugins: [dts()],
});
