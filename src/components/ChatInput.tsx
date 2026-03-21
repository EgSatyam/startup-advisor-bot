import { useState } from 'react'
import './ChatInput.css'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <textarea
          className="chat-input"
          placeholder="Ask about your startup idea, fundraising, growth strategies..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          rows={1}
        />
        <button 
          type="submit" 
          className="send-button" 
          disabled={disabled || !input.trim()}
          title="Send message (Shift+Enter for new line)"
        >
          <span>Send</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M8.59 16.34l7.07-7.07m0 0L21 3m-9.46 9.46l-7.07-7.07m0 0L3 21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p className="input-hint">💡 Tip: Shift + Enter for a new line</p>
    </form>
  )
}
