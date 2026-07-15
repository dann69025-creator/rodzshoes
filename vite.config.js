import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Aumentamos el límite de advertencia a 1600 kB para que deje de molestar
    chunkSizeWarningLimit: 1600, 
    
    rollupOptions: {
      output: {
        // 2. Le decimos a Vite que separe las librerías pesadas en un archivo llamado 'vendor'
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});