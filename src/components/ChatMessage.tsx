import type { Message } from '../App'
import './ChatMessage.css'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`message-container ${isUser ? 'user' : 'assistant'}`}>
      <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
        <div className="message-avatar">
          {isUser ? '👤' : '🤖'}
        </div>
        <div className="message-content">
          <p>{message.content}</p>
          <span className="message-time">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    </div>
  )
}
