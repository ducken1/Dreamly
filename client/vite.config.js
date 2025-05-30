import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Dreamly',
        short_name: 'Dreamly',
        description: 'Aplikacija za beleženje sanj in analiziranje vzorcev',
        theme_color: '#C084FC',
        background_color: '#E9D5FF',
        icons: [
          {
            src: 'logo.png',
            sizes: '500x500',
            type: 'image/png',
          },
          {
            src: 'logo-512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ],
      },
    }),
  ],
})
