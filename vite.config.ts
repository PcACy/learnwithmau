import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'audio/**/*.mp3', 'data/strokes/**/*.json'],
      manifest: {
        name: 'Learn with Mau · Hanzi Arcade',
        short_name: 'Hanzi Arcade',
        description: 'Modulare Offline-Lernplattform für Chinesisch-Anfänger (HSK 1)',
        theme_color: '#10b981',
        background_color: '#09090b',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,mp3,json}'],
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'audio',
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200, 206],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('hanzi-writer')) {
              return 'vendor-hanzi-writer';
            }
            if (id.includes('dexie') || id.includes('canvas-confetti') || id.includes('zustand')) {
              return 'vendor-libs';
            }
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('react-router')) {
              return 'vendor-react';
            }
            return 'vendor-misc';
          }
          if (id.includes('/src/data/vocabDetails')) {
            return 'data-vocab-details';
          }
          if (id.includes('/src/data/stories.json')) {
            return 'data-stories';
          }
          if (id.includes('/src/data/dialogues.json')) {
            return 'data-dialogues';
          }
          if (id.includes('/src/data/mockExam.json')) {
            return 'data-exam';
          }
          if (id.includes('/src/data/pinyinData')) {
            return 'data-pinyin';
          }
          if (id.includes('/src/data/grammar.json') || id.includes('/src/data/grammarPitfalls')) {
            return 'data-grammar';
          }
          if (id.includes('/src/data/strokeGuideData')) {
            return 'data-strokes';
          }
          if (id.includes('/src/data/cultureNotes')) {
            return 'data-culture';
          }
          if (id.includes('/src/data/')) {
            return 'data-vocab-core';
          }
        },
      },
    },
  },
});


