import './ErrorMessage.css'

interface ErrorMessageProps {
  error: string
  onDismiss: () => void
}

export default function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
  return (
    <div className="error-toast">
      <div className="error-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{error}</span>
      </div>
      <button className="error-dismiss" onClick={onDismiss}>✕</button>
    </div>
  )
}
