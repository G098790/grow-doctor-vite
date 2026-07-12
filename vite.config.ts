import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

// Standard Vite + React SPA config.
//   - tailwindcss     Tailwind v4 vite plugin
//   - tsConfigPaths   resolves the "@/*" alias declared in tsconfig.json
//   - viteReact       React 19 JSX/HMR support
// No SSR, no TanStack Start, no Cloudflare/Nitro runtime — this builds a
// plain static bundle in dist/ that can be served by any static host
// (e.g. Render Static Site).
export default defineConfig({
  plugins: [tailwindcss(), tsConfigPaths({ projects: ["./tsconfig.json"] }), viteReact()],
  resolve: {
    alias: {
      "@": `${process.cwd()}/src`,
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  server: {
    host: true,
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
});
