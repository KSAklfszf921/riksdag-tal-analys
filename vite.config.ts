import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  build: {
    outDir: 'public_html'
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy Riksdag API requests during development to avoid CORS issues
      "/riksdag-api": {
        target: "https://data.riksdagen.se",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/riksdag-api/, ""),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
