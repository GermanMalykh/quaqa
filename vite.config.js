import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages - замените '/quaqa/' на имя вашего репозитория
  // Если репозиторий называется 'username.github.io', используйте '/'
  base: process.env.NODE_ENV === 'production' ? '/quaqa/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'xlsx-vendor': ['xlsx'],
        },
      },
    },
  },
})
