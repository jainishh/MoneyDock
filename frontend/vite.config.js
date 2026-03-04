import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',

      // ─── Web App Manifest ─────────────────────────────────────────────────
      // This is what makes the browser offer "Add to Home Screen" on mobile
      manifest: {
        name: 'MoneyDock',
        short_name: 'MoneyDock',
        description: 'MoneyDock – Your smart trading dashboard',
        theme_color: '#0b0e14',
        background_color: '#0b0e14',
        display: 'standalone',       // opens as an app (no browser chrome)
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },

      // ─── Workbox (Service Worker) Config ──────────────────────────────────
      workbox: {
        // Cache static assets (JS, CSS, fonts, images) for fast loads
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],

        // API calls: always try network first (live stock data must be fresh)
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https?:\/\/.*\/socket\.io\/.*/i,
            handler: 'NetworkOnly', // WebSocket — never cache
          },
        ],

        // IMPORTANT: Do NOT set navigateFallback here.
        // For a React SPA, the service worker already caches index.html and
        // serves it for all navigations. Setting offline.html here would show
        // the offline page even when the user IS online.
      },

      devOptions: {
        enabled: true,   // show SW active in dev (install prompt works)
        type: 'module',
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
