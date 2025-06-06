import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  server: {
    open: true,
  },
  define: {
    'process.env': {}
  }
});