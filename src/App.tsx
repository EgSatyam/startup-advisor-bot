import { useState, useRef, useEffect } from 'react'
import './App.css'
import ChatMessage from './components/ChatMessage.tsx'
import ChatInput from './components/ChatInput.tsx'
import LoadingSpinner from './components/LoadingSpinner.tsx'
import ErrorMessage from './components/ErrorMessage.tsx'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response from advisor')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📈 Startup Advisor</h1>
          <p className="tagline">Get expert guidance on your startup journey</p>
        </div>
      </header>

      <main className="chat-container">
        {messages.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">💡</div>
            <h2>Welcome to Startup Advisor</h2>
            <p>Ask me anything about launching, scaling, or managing your startup.</p>
            <div className="suggestion-chips">
              <button 
                className="chip"
                onClick={() => handleSendMessage("What are the key metrics I should track as a startup?")}
              >
                Key Metrics
              </button>
              <button 
                className="chip"
                onClick={() => handleSendMessage("How do I prepare for a seed round?")}
              >
                Seed Round
              </button>
              <button 
                className="chip"
                onClick={() => handleSendMessage("What's the best way to find product-market fit?")}
              >
                Product-Market Fit
              </button>
              {/* <button  */}
                {/* className="chip"
                onClick={() => handleSendMessage("How should I structure my founding team?")}
              >
                Team Structure */}
              {/* </button> */}
            </div>
          </div>
        )}

        <div className="messages">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="chat-footer">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={loading}
        />
      </footer>
    </div>
  )
}

export default App
