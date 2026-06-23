import react from "@astrojs/react";
import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
});
