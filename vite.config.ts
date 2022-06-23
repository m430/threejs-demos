import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cjs(),
    react()
  ],
  optimizeDeps: {

  },
  assetsInclude: ["**/*.obj", "**/*.gltf"],
  build: {
    minify: false,
    commonjsOptions: {
      include: /node_modules/,
    }
  }
})
