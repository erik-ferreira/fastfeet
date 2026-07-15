import swc from "unplugin-swc"
import { resolve } from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  oxc: false,
  test: {
    globals: true,
    root: "./",
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
    },
    tsconfigPaths: true,
  },
})
