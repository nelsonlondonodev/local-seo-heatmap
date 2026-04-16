import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Simple check for required environment variables in production builds
  if (mode === 'production') {
    const required = [
      'VITE_SUPABASE_URL', 
      'VITE_SUPABASE_ANON_KEY', 
      'VITE_SERPER_API_KEY'
    ];
    
    required.forEach(key => {
      if (!process.env[key]) {
        console.warn(`\x1b[33m⚠️  Warning: ${key} is not defined in current environment.\x1b[0m`);
      }
    });
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
})
