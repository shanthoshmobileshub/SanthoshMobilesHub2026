import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set `base` to the repository name so GH Pages serves assets correctly
export default defineConfig({
  base: '/MySite/',
  plugins: [react()]
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
