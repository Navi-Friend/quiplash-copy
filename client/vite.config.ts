import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: {
      origin: 'http://localhost:8000/',
    },
  },
  build: {
    // generate .vite/manifest.json in outDir
    manifest: true,
    rollupOptions: {
      input: '/path/to/main.js',
    },
  },
  plugins: [react()],
})
