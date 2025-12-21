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
      '@/components': path.resolve(__dirname, './src/components'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  css: {
    // PostCSS обработка
    postcss: './postcss.config.js',
    // Dev source maps для CSS
    devSourcemap: true,
  },
  build: {
    // Source maps для отладки (только в development)
    sourcemap: process.env.NODE_ENV === 'development',
    // Минификация
    minify: 'esbuild',
    // CSS код сплиттинг
    cssCodeSplit: true,
    // Оптимизация chunk size
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'xlsx-vendor': ['xlsx'],
        },
        // Именование файлов для лучшего кеширования
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  // Оптимизация зависимостей
  optimizeDeps: {
    include: [],
  },
  // Настройки сервера для разработки
  server: {
    port: 5173,
    open: false,
    cors: true,
  },
  // Настройки preview
  preview: {
    port: 4173,
    open: false,
    strictPort: true,
  },
})

