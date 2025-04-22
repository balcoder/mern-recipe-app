import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // The target URL where the requests will be proxied
        changeOrigin: true, // Changes the origin of the host header to the target URL
        secure: false, // If the target URL uses HTTPS, set this to true
        // rewrite: (path) => path.replace(/^\/api/, ''), // Rewrites the path if needed
        // agent: new http.Agent(), // Optional, can be used to configure the HTTP agent
      },
    },
  },
  plugins: [
    react(),
  tailwindcss()
],
})
