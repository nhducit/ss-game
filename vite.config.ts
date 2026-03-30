import path from "path"
import { execSync } from "child_process"
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

const commitTime = execSync('git log -1 --format=%cI').toString().trim()

// https://vite.dev/config/
export default defineConfig({
  define: {
    __COMMIT_TIME__: JSON.stringify(commitTime),
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
