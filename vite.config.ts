import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    // Memory optimizations for 5,500+ pages
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Disable manual chunks to prevent memory issues with large builds
        manualChunks: undefined,
        // Optimize for large number of pages
        maxParallelFileOps: 5,
      },
    },
    sourcemap: mode === 'development',
  },
  publicDir: 'public',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
