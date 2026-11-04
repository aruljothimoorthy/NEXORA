import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('three') || id.includes('@react-three')) {
            return 'three-vendor'
          }
          if (id.includes('recharts') || id.includes('d3-')) {
            return 'charts-vendor'
          }
          if (id.includes('@dnd-kit')) {
            return 'dnd-vendor'
          }
          if (id.includes('framer-motion')) {
            return 'motion-vendor'
          }
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('react-redux') ||
            id.includes('@reduxjs') ||
            id.includes('/react/')
          ) {
            return 'react-vendor'
          }
          return 'vendor'
        },
      },
    },
  },
})
