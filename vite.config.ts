import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Disable HMR overlay for static HTML pages
    hmr: {
      overlay: false,
    },
  },
  // Exclude original_files from being processed
  optimizeDeps: {
    exclude: ['original_files'],
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        widget: path.resolve(__dirname, 'widget.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
})
