import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { readFileSync, writeFileSync, copyFileSync } from 'fs'

// Плагин для обновления путей для GitHub Pages
const updatePathsPlugin = () => {
  return {
    name: 'update-paths',
    closeBundle() {
      if (process.env.NODE_ENV === 'production') {
        try {
          const indexPath = path.resolve(__dirname, 'dist/index.html')
          
          // Читаем index.html
          let indexContent = readFileSync(indexPath, 'utf-8')
          
          // Обновляем пути к иконкам и manifest в index.html (если они еще не обновлены)
          indexContent = indexContent.replace(
            /href="\/icon-/g,
            'href="/quaqa/icon-'
          )
          indexContent = indexContent.replace(
            /href="\/apple-touch-icon/g,
            'href="/quaqa/apple-touch-icon'
          )
          indexContent = indexContent.replace(
            /href="\/manifest\.json/g,
            'href="/quaqa/manifest.json'
          )
          
          // Сохраняем обновленный index.html
          writeFileSync(indexPath, indexContent)
          
          // Обновляем manifest.json для production с правильными путями
          const manifestPath = path.resolve(__dirname, 'dist/manifest.json')
          const manifestContent = readFileSync(manifestPath, 'utf-8')
          const manifest = JSON.parse(manifestContent)
          manifest.start_url = '/quaqa/'
          manifest.icons = manifest.icons.map((icon) => ({
            ...icon,
            src: icon.src.replace(/^\//, '/quaqa/')
          }))
          writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
          console.log('✅ manifest.json обновлен для GitHub Pages')
          console.log('✅ index.html обновлен с правильными путями для GitHub Pages')
        } catch (error) {
          console.warn('⚠️ Не удалось обновить пути:', error)
        }
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), updatePathsPlugin()],
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

