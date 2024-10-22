import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true, // Usa polling para detectar cambios en archivos
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
