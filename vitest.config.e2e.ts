import swc from "unplugin-swc"
import { resolve } from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  oxc: false,
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
    setupFiles: ["./test/setup-e2e.ts"],
    pool: "threads",
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
