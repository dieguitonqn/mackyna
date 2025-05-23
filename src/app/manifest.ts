// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mackyna App',
    short_name: 'Mackyna',
    description: 'Aplicacion de Mackyna',
    start_url: '/',
    display: 'standalone',
    
    icons: [
      {
        src: '/favicon_man/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      // ... (otros tamaños y propósito maskable)
    ],
  }
}