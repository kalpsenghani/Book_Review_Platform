"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import ReviewCard from "../components/ReviewCard"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import "./BookDetailPage.css"

const API_BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api"

function BookDetailPage() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch book details
        const bookResponse = await fetch(`${API_BASE_URL}/books/${id}`)
        if (!bookResponse.ok) {
          if (bookResponse.status === 404) {
            throw new Error("Book not found")
          }
          throw new Error("Failed to fetch book details")
        }
        const bookData = await bookResponse.json()
        setBook(bookData.data)

        // Fetch reviews for this book
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews?bookId=${id}`)
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews")
        }
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchBookAndReviews()
    }
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading book details..." />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <ErrorMessage message={error || "Book not found"} />
          <div className="back-button-container">
            <Link to="/books" className="btn btn-outline">
              Back to Books
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        <div className="book-detail-grid">
          {/* Book Cover and Basic Info */}
          <div className="book-sidebar">
            <div className="book-cover-card">
              <img
                src={book.cover_image || "/placeholder.svg?height=450&width=300"}
                alt={book.title}
                className="book-cover"
              />
              <div className="book-rating">
                <div className="rating-display">
                  <span className="star">⭐</span>
                  <span className="rating-value">{book.average_rating?.toFixed(1) || '0.0'}</span>
                </div>
                <span className="review-count">{book.total_reviews || 0} reviews</span>
              </div>

              <Link to={`/reviews/new?bookId=${book._id}`} className="btn btn-primary full-width">
                Write a Review
              </Link>

              <div className="book-meta">
                <div className="meta-item">
                  <span className="meta-icon">📅</span>
                  <span>Published: {formatDate(book.published_date)}</span>
                </div>
                {book.isbn && (
                  <div className="meta-item">
                    <span className="meta-icon">📖</span>
                    <span>ISBN: {book.isbn}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Details and Reviews */}
          <div className="book-content">
            {/* Book Information */}
            <div className="book-info-card">
              <div className="book-header">
                <h1 className="book-title">{book.title}</h1>
                <p className="book-author">by {book.author}</p>
                {book.genre && <span className="book-genre">{book.genre}</span>}
              </div>
              <div className="book-description">
                <p>{book.description || 'No description available.'}</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <h2 className="reviews-title">👤 Reviews ({reviews.length})</h2>
              </div>
              <div className="reviews-content">
                {reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <ReviewCard key={review._id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="no-reviews">
                    <p>No reviews yet. Be the first to review this book!</p>
                    <Link to={`/reviews/new?bookId=${book._id}`} className="btn btn-primary">
                      Write the First Review
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage
