import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set `base` conditionally based on the command
export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? '/SanthoshMobilesHub2026/' : '/',
    plugins: [react()],
  }
})

