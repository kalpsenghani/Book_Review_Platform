import "./LoadingSpinner.css"

function LoadingSpinner({ size = "md", text }) {
  return (
    <div className="loading-spinner">
      <div className={`spinner ${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
