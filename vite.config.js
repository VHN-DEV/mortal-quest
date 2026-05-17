import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

export default defineConfig({
  plugins: [
    tailwindcss(),
    ViteEjsPlugin(),
    ViteImageOptimizer({
      exclude: /Phosphor-.*\.svg/,
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      svg: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'sortAttrs' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  base: './',
  build: {
    chunkSizeWarningLimit: 1000,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('gsap')) return 'vendor-gsap';
            if (id.includes('@capacitor')) return 'vendor-capacitor';
            if (id.includes('@phosphor-icons')) return 'vendor-icons';
            return 'vendor';
          }
        },
      },
    },
  },
});
