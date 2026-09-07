import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [vue(), tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/img/favicon.png', 'assets/img/apple-touch-icon.png', 'assets/img/masked-icon.png'],
      devOptions: {
        enabled: true,
        type: 'module'
      },
      manifest: {
        name: 'PlanoK - Gestão de Consumo',
        short_name: 'PlanoK',
        description: 'Descrição do meu aplicativo Vue PWA',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'assets/img/pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'assets/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'assets/img/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' 
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  
});