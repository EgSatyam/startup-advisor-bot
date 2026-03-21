import './LoadingSpinner.css'

export default function LoadingSpinner() {
  return (
    <div className="message-container assistant">
      <div className="message assistant-message loading">
        <div className="message-avatar">🤖</div>
        <div className="message-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Thinking...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
