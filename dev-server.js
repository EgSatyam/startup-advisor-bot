import http from 'http'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env.local file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

try {
  const envPath = join(__dirname, '.env.local')
  const envContent = readFileSync(envPath, 'utf-8')
  const lines = envContent.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key) {
        process.env[key.trim()] = valueParts.join('=').trim()
      }
    }
  }
  console.log('✅ Loaded .env.local')
} catch (error) {
  console.warn('⚠️  Could not load .env.local:', error.message)
}

const SYSTEM_PROMPT = `You are an experienced startup advisor and business consultant with deep expertise in:
- Early-stage startup strategy and execution
- Fundraising (seed rounds, Series A/B, venture capital)
- Product-market fit and customer discovery
- Team building and organizational culture
- Growth strategies and scaling
- Market analysis and competitive positioning
- Business models and revenue strategies
- Common startup pitfalls and how to avoid them

Your role is to provide practical, actionable advice based on proven startup methodologies and real-world experience. 
Be concise but thorough, and ask clarifying questions when needed to give better advice.
Always be encouraging but realistic about both opportunities and challenges.`

let PORT = parseInt(process.env.API_PORT || '3001', 10)

async function handleChatRequest(bodyStr) {
  try {
    let parsedBody
    try {
      parsedBody = JSON.parse(bodyStr)
    } catch {
      return {
        status: 400,
        error: 'Invalid JSON in request body'
      }
    }

    const { message, conversationHistory = [] } = parsedBody

    if (!message || typeof message !== 'string') {
      return {
        status: 400,
        error: 'Message is required and must be a string'
      }
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
      console.error('GOOGLE_GEMINI_API_KEY not configured')
      return {
        status: 500,
        error: 'API configuration error. Please ensure GOOGLE_GEMINI_API_KEY is set in .env.local'
      }
    }

    // Build conversation contents with system instruction as first message
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\nUser query: ${message}`
          }
        ]
      },
      ...conversationHistory.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ]

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          }
        })
      }
    )

    console.log(`🌐 Gemini API Response Status: ${response.status}`)

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch {
        errorData = { error: { message: response.statusText } }
      }
      console.error('❌ Gemini API error:', errorData)

      if (response.status === 401) {
        console.error('🔑 API Key issue: Invalid or expired API key')
        return {
          status: 401,
          error: 'Invalid API key - authentication failed. Check your GOOGLE_GEMINI_API_KEY in .env.local'
        }
      }

      if (response.status === 400) {
        const errorMsg = errorData.error?.message || 'Bad request'
        console.error('ℹ️  This might be a model name issue. Check that gemini-1.5-flash-latest is available.')
        return {
          status: 400,
          error: `Model error: ${errorMsg}. Try checking with: https://ai.google.dev/models`
        }
      }

      return {
        status: response.status,
        error: errorData.error?.message || 'Failed to generate response from API'
      }
    }

    const data = await response.json()
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!assistantMessage) {
      console.error('❌ No assistant message in response:', data)
      return {
        status: 500,
        error: 'No response text received from API'
      }
    }

    console.log('✨ Successfully generated response')
    return {
      status: 200,
      message: assistantMessage,
      response: assistantMessage
    }
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return {
      status: 500,
      error: `Failed to process request: ${errorMessage}`
    }
  }
}

const server = http.createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // Health check endpoint
  if (req.url === '/health' && req.method === 'GET') {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    res.writeHead(200)
    res.end(JSON.stringify({ 
      status: 'ok',
      port: PORT,
      apiKeyConfigured: !!apiKey
    }))
    return
  }

  // Route API requests
  if (req.url === '/api/chat' && req.method === 'POST') {
    console.log('\n📥 Incoming chat request...')
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('error', (error) => {
      console.error('❌ Request error:', error)
      res.writeHead(400)
      res.end(JSON.stringify({ error: 'Request error' }))
    })
    req.on('end', async () => {
      try {
        console.log('📨 Processing request...')
        const result = await handleChatRequest(body)
        const status = result.status || 500
        delete result.status
        console.log(`✅ Sending response with status ${status}`)
        res.writeHead(status, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result || { error: 'No response' }))
      } catch (error) {
        console.error('❌ Request handler error:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Internal server error' 
        }))
      }
    })
    return
  }

  // 404 for other routes
  res.writeHead(404)
  res.end(JSON.stringify({ error: 'Not found' }))
})

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!`)
    console.error('Kill the process using that port or use a different port.\n')
    console.error('To find and kill the process on Windows:')
    console.error(`  netstat -ano | findstr :${PORT}`)
    console.error(`  taskkill /PID <PID> /F`)
    process.exit(1)
  } else if (error.code === 'EACCES') {
    console.error(`\n❌ Permission denied to listen on port ${PORT}!`)
    console.error('Try using a port number above 1024.')
    process.exit(1)
  } else {
    console.error('❌ Server error:', error)
    process.exit(1)
  }
})

server.listen(PORT, '127.0.0.1', () => {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  console.log('\n' + '='.repeat(60))
  console.log('✅ API Server Started Successfully')
  console.log('='.repeat(60))
  console.log(`📡 Server running on http://localhost:${PORT}`)
  console.log(`✨ API endpoint: http://localhost:${PORT}/api/chat`)
  console.log(`💊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔑 API key configured: ${apiKey ? '✅ Yes' : '❌ NO - CHECK .env.local'}`)
  console.log('='.repeat(60))
  console.log('')
  
  if (!apiKey) {
    console.error('❌ ERROR: GOOGLE_GEMINI_API_KEY is not set!')
    console.error('Please add it to .env.local:\n  GOOGLE_GEMINI_API_KEY=your_api_key_here\n')
  }
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down server...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('\n\n👋 Shutting down server...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

