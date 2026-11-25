import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    alias: {
      "server-only": fileURLToPath(new URL("./test/empty.ts", import.meta.url)),
    },
  },
});
