import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import emailPlugin from './vite-email-plugin.js';

export default defineConfig({
  plugins: [react(), emailPlugin()],
  server: {
    port: 3000,
    host: true,
  },
});
