import type { IncomingMessage, ServerResponse } from 'http'

type VercelRequest = IncomingMessage & { body?: any; method?: string; url?: string }
type VercelResponse = ServerResponse & { status?: (code: number) => any; json?: (data: any) => void }

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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Set default response headers
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  const { message, conversationHistory = [] } = req.body || {}

  if (!message || typeof message !== 'string') {
    res.statusCode = 400
    res.end(JSON.stringify({ error: 'Message is required' }))
    return
  }

  // Check for API key
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    console.error('GOOGLE_GEMINI_API_KEY not configured')
    res.statusCode = 500
    res.end(JSON.stringify({ 
      error: 'API configuration error. Please ensure GOOGLE_GEMINI_API_KEY is set.' 
    }))
    return
  }

  try {
    // Build conversation contents - include history plus new message
    // Embed system prompt in first user message
    const contents = [
      {
        role: 'user',
        parts: [{ text: `${SYSTEM_PROMPT}\n\nUser query: ${message}` }]
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    ]

    // Call Google Gemini API v1
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

    if (!response.ok) {
      const errorData = await response.json() as any
      console.error('Gemini API error:', errorData)
      
      if (response.status === 401) {
        res.statusCode = 401
        res.end(JSON.stringify({ error: 'Invalid API key' }))
        return
      }
      
      res.statusCode = response.status
      res.end(JSON.stringify({ 
        error: errorData.error?.message || 'Failed to generate response'
      }))
      return
    }

    const data = await response.json() as any
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!assistantMessage) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: 'Empty response from AI' }))
      return
    }

    res.statusCode = 200
    res.end(JSON.stringify({ 
      message: assistantMessage,
      response: assistantMessage
    }))
  } catch (error) {
    console.error('Chat API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    res.statusCode = 500
    res.end(JSON.stringify({ 
      error: `Failed to process request: ${errorMessage}`
    }))
  }
}
