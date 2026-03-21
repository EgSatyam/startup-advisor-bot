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
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('OPENAI_API_KEY not configured')
    res.statusCode = 500
    res.end(JSON.stringify({ 
      error: 'API configuration error. Please ensure OPENAI_API_KEY is set.' 
    }))
    return
  }

  try {
    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ]

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.json() as any
      console.error('OpenAI API error:', errorData)
      
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
    const assistantMessage = data.choices[0]?.message?.content

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
