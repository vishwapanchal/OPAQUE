import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [react(), basicSsl()],
  base: '/',
  build: {
    outDir: '../static/unified',
    emptyOutDir: true,
  },
  server: {
    host: true,
    proxy: {
      '/api': 'http://10.225.12.76:8000'
    }
  }
})