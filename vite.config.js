import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set `base` to the repository name so GH Pages serves assets correctly
export default defineConfig({
  base: '/SMH2026/',
  plugins: [react()]
})

