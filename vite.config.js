import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/Engineering-Unit-Converter-V1.3.3/' 
    : './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

