import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/rr/",
  server: {
    proxy: {
      // Proxies '/api?lat=...' to 'https://rr.jasonluxie.workers.dev/?lat=...'
      '/api': {
        target: 'https://rr.jasonluxie.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
