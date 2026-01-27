import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base path (repo name)
export default defineConfig({
  base: '/tahoe-four-seasons-rentals/',
  plugins: [react()],
})
