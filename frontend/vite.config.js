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
      includeAssets: ['offline.html', 'icons/*.png'],
      manifest: {
        name: 'MoneyDock',
        short_name: 'MoneyDock',
        description: 'MoneyDock – Your smart trading dashboard',
        theme_color: '#0b0e14',
        background_color: '#0b0e14',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache all static assets aggressively
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Network-first for API routes (live data must always be fresh)
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https?:\/\/.*\/socket\.io\/.*/i,
            handler: 'NetworkOnly', // never cache websocket traffic
          },
        ],
        // Show offline.html when user navigates to uncached page while offline
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/socket\.io\//],
      },
      devOptions: {
        enabled: false, // disable SW in dev to avoid stale cache headaches
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
