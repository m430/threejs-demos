import * as path from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cjs from '@rollup/plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cjs(),
    react()
  ],
  assetsInclude: ["**/*.obj", "**/*.gltf"],
  build: {
    target: "es2015",
    commonjsOptions: {
      include: /node_modules/,
    }
  },
  resolve: {
    alias: [
      { find: /@\//, replacement: path.join(__dirname, "./src/") },
    ]
  }
})
