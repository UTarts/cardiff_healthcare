import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <--- KEPT YOUR TAILWIND V4 PLUGIN
    
    // PWA CONFIGURATION
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      
      // 1. MANIFEST (Minimal to avoid aggressive "Install App" prompts)
      manifest: {
        name: 'Cardiff Healthcare',
        short_name: 'Cardiff',
        description: 'ISO Certified Pharmaceutical Company',
        theme_color: '#0ea5e9',
        icons: [
          {
            src: 'logo.webp', // Ensure this file exists in your 'public' folder
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'logo.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ]
      },
      
      // 2. WORKBOX (Caching Strategies for Offline Speed)
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Cache Supabase & Unsplash Images (StaleWhileRevalidate)
            urlPattern: ({ url }) => url.href.includes('supabase.co') || url.href.includes('unsplash.com'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
              }
            }
          },
          {
            // Cache Google Fonts (CacheFirst)
            urlPattern: ({ url }) => url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 Year
              }
            }
          }
        ]
      }
    })
  ],
})