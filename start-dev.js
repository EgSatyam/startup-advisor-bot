#!/usr/bin/env node

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log('\n' + '='.repeat(60))
console.log('🚀 Starting Startup Advisor Bot - All Services')
console.log('='.repeat(60) + '\n')

// Start API Server
console.log('📡 Starting API Server on port 3001...')
const apiServer = spawn('node', ['dev-server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
})

apiServer.on('error', (error) => {
  console.error('❌ Failed to start API server:', error.message)
  process.exit(1)
})

// Wait for API server to be ready
const waitForServer = (port, maxAttempts = 30) => {
  return new Promise((resolve, reject) => {
    let attempts = 0
    
    const checkServer = () => {
      attempts++
      const req = http.get(`http://localhost:${port}/health`, (res) => {
        if (res.statusCode === 200) {
          console.log('✅ API server is ready!\n')
          resolve()
        } else {
          setTimeout(checkServer, 100)
        }
      })
      
      req.on('error', () => {
        if (attempts >= maxAttempts) {
          reject(new Error(`API server not ready after ${maxAttempts * 100}ms`))
        } else {
          setTimeout(checkServer, 100)
        }
      })
    }
    
    checkServer()
  })
}

// Wait for API server to start
waitForServer(3001)
  .then(() => {
    console.log('🌐 Starting Frontend (Vite) on port 5173...\n')
    
    const viteServer = spawn('vite', [], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: true
    })

    viteServer.on('error', (error) => {
      console.error('❌ Failed to start Vite:', error.message)
      process.exit(1)
    })

    // Handle graceful shutdown
    const handleShutdown = () => {
      console.log('\n\n👋 Shutting down all services...')
      apiServer.kill('SIGTERM')
      viteServer.kill('SIGTERM')
      setTimeout(() => process.exit(0), 1000)
    }

    process.on('SIGINT', handleShutdown)
    process.on('SIGTERM', handleShutdown)
  })
  .catch((error) => {
    console.error('❌ Error:', error.message)
    console.error('The API server failed to start. Check the logs above.')
    apiServer.kill()
    process.exit(1)
  })
