import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage } from 'http'

const API_PORT = process.env.API_PORT || '3001'
const API_URL = process.env.VITE_API_URL || `http://localhost:${API_PORT}`

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('error', (err, _req: IncomingMessage, res: any) => {
            console.error('❌ Proxy connection error:', err.message)
            console.error(`   Failed to connect to API server on ${API_URL}`)
            console.error('   Make sure dev-server.js is running')
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ 
              error: `Cannot connect to API server on ${API_URL}`,
              details: 'Make sure dev-server.js is running in another terminal',
              solution: 'Run: node dev-server.js'
            }))
          })
          proxy.on('proxyReq', (_proxyReq, req: IncomingMessage, _res: any) => {
            const timestamp = new Date().toISOString()
            console.log(`[${timestamp}] → ${req.method} ${req.url}`)
          })
          proxy.on('proxyRes', (proxyRes, _req: any, _res: any) => {
            const timestamp = new Date().toISOString()
            console.log(`[${timestamp}] ← ${proxyRes.statusCode}`)
          })
        }
      }
    }
  }
})
