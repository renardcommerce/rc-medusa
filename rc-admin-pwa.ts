// RC CHOICE Admin: favicon + installable web app for the Medusa admin (/app).
// Uses the supported admin.vite hook in medusa-config.ts. Only adds static icon files,
// a manifest and <head> tags. No service worker, no caching, no auth changes.
import fs from "node:fs"
import path from "node:path"
// vite is ESM-only; with module Node16 this CJS file needs the ESM types for `Plugin`.
import type { Plugin } from "vite" with { "resolution-mode": "import" }

const SRC_DIR = path.resolve(process.cwd(), "rc-admin-pwa") // folder at the repo root
const OUT_DIR = "rc-admin" // served as /app/rc-admin/...
const BASE = "/app/" + OUT_DIR + "/"

const FILES = {
  ico: "rc-choice-admin-favicon.d8a951c1.ico",
  svg: "rc-choice-admin-favicon.6075b8e0.svg",
  apple: "rc-choice-admin-apple-touch-icon.42a3ec84.png",
  manifest: "rc-choice-admin.webmanifest",
}

export function rcAdminPwa(): Plugin {
  return {
    name: "rc-admin-pwa",
    apply: "build",
    generateBundle() {
      for (const file of fs.readdirSync(SRC_DIR)) {
        this.emitFile({
          type: "asset",
          fileName: `${OUT_DIR}/${file}`,
          source: fs.readFileSync(path.join(SRC_DIR, file)),
        })
      }
    },
    transformIndexHtml(html) {
      // Drop any default favicon so ours is the only one.
      const cleaned = html.replace(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*>\s*/gi, "")
      return {
        html: cleaned,
        tags: [
          { tag: "link", attrs: { rel: "icon", href: BASE + FILES.ico, sizes: "32x32" }, injectTo: "head" },
          { tag: "link", attrs: { rel: "icon", href: BASE + FILES.svg, type: "image/svg+xml" }, injectTo: "head" },
          { tag: "link", attrs: { rel: "apple-touch-icon", href: BASE + FILES.apple }, injectTo: "head" },
          { tag: "link", attrs: { rel: "manifest", href: BASE + FILES.manifest }, injectTo: "head" },
          { tag: "meta", attrs: { name: "theme-color", content: "#0B2A78" }, injectTo: "head" },
          { tag: "meta", attrs: { name: "apple-mobile-web-app-title", content: "RC CHOICE Admin" }, injectTo: "head" },
        ],
      }
    },
  }
}

// medusa-config.ts — add inside defineConfig({ ... }), keep everything else as is:
//
//   import { rcAdminPwa } from "./rc-admin-pwa"
//   admin: {
//     ...bestaande admin-opties,
//     vite: () => ({ plugins: [rcAdminPwa()] }),
//   },
