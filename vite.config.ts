import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('antd') || id.includes('@ant-design') || id.includes('@rc-component') || id.includes('rc-')) {
              return 'vendor-antd'
            }
            if (id.includes('axios') || id.includes('zustand')) {
              return 'vendor-data'
            }
          }

          if (id.includes('/src/pages/admin/')) {
            const adminPageMatch = id.match(/\/src\/pages\/admin\/([^/]+)\.tsx$/)
            if (adminPageMatch?.[1]) {
              return `admin-${adminPageMatch[1]}`
            }
            return 'admin-pages'
          }
        },
      },
    },
  },
})
