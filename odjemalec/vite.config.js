import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Dream Journal',
        short_name: 'DreamJournal',
        description: 'Aplikacija za beleženje sanj in analiziranje vzorcev',
        theme_color: '#2563eb',  // modra iz Tailwind barv
        icons: [
          {
            src: 'logo.png', // ikone pripravi v /public
            sizes: '500x500',
            type: 'image/png',
          }
        ]
      },
      workbox: {
        // konfiguriraj cache, če želiš (lahko za začetek pustiš privzeto)
      }
    })
  ],
})
