import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://campored-backend.onrender.com',
        changeOrigin: true,
        // El backend valida el header Origin contra su lista de CORS.
        // En local el browser envía localhost, que no está en esa lista → 403.
        // Sobreescribimos Origin para que el proxy parezca el propio backend.
        headers: {
          origin: 'https://campored-backend.onrender.com',
        },
      },
    },
  },
})
