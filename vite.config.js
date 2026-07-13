import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // REEMPLAZA 'rodzshoes' por el nombre exacto de tu repositorio en GitHub
  base: '/rodzshoes/', 
})