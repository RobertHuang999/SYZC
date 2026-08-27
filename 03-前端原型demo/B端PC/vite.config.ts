import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

function fixFileProtocolHtml(): Plugin {
  return {
    name: "fix-file-protocol-html",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        const scriptMatch = html.match(
          /<script(?: type="module")?(?: crossorigin)? src="(\.\/assets\/[^"]+)"><\/script>/,
        )
        if (!scriptMatch) {
          return html.replace(/ crossorigin/g, "")
        }

        const scriptSrc = scriptMatch[1]
        const withoutScript = html
          .replace(
            /<script(?: type="module")?(?: crossorigin)? src="\.\/assets\/[^"]+"><\/script>\n?/,
            "",
          )
          .replace(/ crossorigin/g, "")

        return withoutScript.replace(
          "</body>",
          `  <script src="${scriptSrc}"></script>\n</body>`,
        )
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss(), fixFileProtocolHtml()],
  build: {
    modulePreload: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "iife",
        inlineDynamicImports: true,
        name: "SyzcPrototype",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@docs": path.resolve(import.meta.dirname, "../../02-PRD文档"),
    },
  },
  server: {
    fs: {
      allow: ["..", "../../02-PRD文档"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
