import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5001',
      },
      '/socket.io': {
        target: process.env.VITE_SOCKET_URL || 'ws://localhost:5001',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
});
