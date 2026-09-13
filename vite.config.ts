import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cinnamonspare-cghuahbdcqa5g9ek.westus3-01.azurewebsites.net',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://cinnamonspare-cghuahbdcqa5g9ek.westus3-01.azurewebsites.net',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
