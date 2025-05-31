import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'injectManifest',    // uporabljamo svoj SW
      srcDir: 'src',                   // tam naj bo service-worker.js
      filename: 'service-worker.js',   // kam v dist ga postavi
      includeAssets: [                 // asseti iz public, ki jih želimo zajeti
        'favicon.svg',
        'robots.txt',
        'logo-192x192.png',
        'logo-512x512.png',
        'offline.html'
      ],
      manifest: {
        name: 'Dreamly',
        short_name: 'Dreamly',
        description: 'Aplikacija za beleženje sanj in analiziranje vzorcev',
        theme_color: '#C084FC',
        background_color: '#E9D5FF',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: 'logo-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      injectManifest: {
        // največja velikost v bajtih, npr. 5 * 1024 * 1024 = 5 MiB
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024},
      workbox: {
        // katere fajle naj precache-a (injekcija v __WB_MANIFEST)
        globPatterns: ['**/*.{js,css,html,png,svg,ico,json,jsx}'],
        // dopolni runtime-caching pravila, če želiš
        runtimeCaching: [
          {
            // primer: klice na lastno API domeno
            urlPattern: /^https:\/\/api\.tvoja-domena\.si\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60,
              },
            },
          },
          {
            // primer: slike
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
    }),
  ],
})
