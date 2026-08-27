import path from "node:path"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
        name: "SyzcApp",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@docs": path.resolve(__dirname, "../../02-PRD文档"),
    },
  },
  server: {
    port: 5174,
    fs: {
      allow: ["..", "../../02-PRD文档"],
    },
  },
})
