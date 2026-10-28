import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Mirrors the rewrite in vercel.json so `vite preview` serves the prerendered
// case study instead of the SPA fallback.
const previewRewrites = {
  name: 'preview-rewrites',
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === '/work/chess-and-truck' || req.url?.startsWith('/work/chess-and-truck?')) {
        req.url = req.url.replace('/work/chess-and-truck', '/work/chess-and-truck/index.html')
      }
      next()
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), previewRewrites],
})
