import { Link } from "react-router-dom"
import "./ReviewCard.css"

function ReviewCard({ review }) {
  const {
    title,
    content,
    rating,
    user_name,
    created_at,
    book
  } = review;

  const {
    _id,
    updated_at,
    likes = 0,
    helpful_votes = 0
  } = review

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatRating = (rating) => {
    if (!rating) return '0.0';
    return rating.toFixed(1);
  }

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-meta">
          <Link to={`/books/${book._id}`} className="book-title">
            {book.title}
          </Link>
          <div className="review-rating">
            <span className="star">⭐</span>
            <span className="rating-value">{formatRating(rating)}</span>
          </div>
        </div>
        <div className="review-date">
          {updated_at && updated_at !== created_at ? (
            <span>Updated on {formatDate(updated_at)}</span>
          ) : (
            <span>Posted on {formatDate(created_at)}</span>
          )}
        </div>
      </div>

      <div className="review-content">
        <h3 className="review-title">{title}</h3>
        <p>{content}</p>
      </div>

      <div className="review-footer">
        <div className="review-stats">
          <span className="stat">
            <span className="stat-icon">👍</span>
            {likes} likes
          </span>
          <span className="stat">
            <span className="stat-icon">💬</span>
            {helpful_votes} helpful votes
          </span>
        </div>
        <div className="review-actions">
          <button className="btn btn-outline btn-sm">Like</button>
          <button className="btn btn-outline btn-sm">Mark as Helpful</button>
          <Link to={`/reviews/${_id}/edit`} className="btn btn-outline btn-sm">
            Edit
          </Link>
        </div>
      </div>
      <div className="review-author">
        <span>By {user_name}</span>
      </div>
    </div>
  )
}

export default ReviewCard

