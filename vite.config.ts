/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { version } from './package.json'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Simple check for required environment variables in production builds
  if (mode === 'production') {
    const required = [
      'VITE_SUPABASE_URL', 
      'VITE_SUPABASE_ANON_KEY'
    ];
    
    required.forEach(key => {
      if (!process.env[key]) {
        console.warn(`\x1b[33m⚠️  Warning: ${key} is not defined in current environment.\x1b[0m`);
      }
    });
  }

  return {
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react';
              if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('sonner')) return 'vendor-ui';
              if (id.includes('leaflet') || id.includes('react-leaflet')) return 'vendor-maps';
              if (id.includes('recharts')) return 'vendor-charts';
              return 'vendor';
            }
          }
        }
      }
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  };
})
