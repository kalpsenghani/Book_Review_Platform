"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import "./NewReviewPage.css"

const API_BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api"

function NewReviewPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    book_id: searchParams.get("bookId") || "",
    rating: 0,
    title: "",
    content: "",
  })

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${API_BASE_URL}/books`)
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to fetch books: ${response.status}`)
        }
        const data = await response.json()
        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid response format from server')
        }
        setBooks(data.data)

        // If bookId is provided in URL, find and set the selected book
        if (formData.book_id) {
          const book = data.data.find((b) => b._id === formData.book_id)
          if (book) setSelectedBook(book)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
        setError(error.message || 'Failed to load books. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [formData.book_id])

  const handleBookSelect = (e) => {
    const bookId = e.target.value
    const book = books.find((b) => b._id === bookId)
    setSelectedBook(book || null)
    setFormData({ ...formData, book_id: bookId })
  }

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.book_id || !formData.rating || !formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Create the review directly without user creation
      const reviewResponse = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book: formData.book_id,
          user_name: "Anonymous Reviewer",
          rating: formData.rating,
          title: formData.title.trim(),
          content: formData.content.trim()
        }),
      })

      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to submit review: ${reviewResponse.status}`)
      }

      // Redirect to the book page
      navigate(`/books/${formData.book_id}`)
    } catch (error) {
      console.error('Error submitting review:', error)
      setError(error.message || "Failed to submit review. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => handleRatingClick(i + 1)}
        className={`star-button ${i < formData.rating ? "filled" : ""}`}
        aria-label={`${i + 1} stars`}
      >
        ⭐
      </button>
    ))
  }

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading books..." />
      </div>
    )
  }

  return (
    <div className="new-review-page">
      <div className="container">
        <div className="review-form-container">
          <div className="review-form-card">
            <div className="form-header">
              <button 
                onClick={() => navigate(-1)} 
                className="back-button"
                aria-label="Go back"
              >
                ← Back
              </button>
              <h1>Write a Review</h1>
            </div>
            <div className="form-content">
              {error && (
                <div className="error-container">
                  <ErrorMessage message={error} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="review-form">
                {/* Book Selection */}
                <div className="form-group">
                  <label htmlFor="book">Select Book</label>
                  <select
                    id="book"
                    value={formData.book_id}
                    onChange={handleBookSelect}
                    className="form-select"
                    required
                  >
                    <option value="">Choose a book to review</option>
                    {books.map((book) => (
                      <option key={book._id} value={book._id}>
                        {book.title} by {book.author}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Book Info */}
                {selectedBook && (
                  <div className="selected-book">
                    <h3>{selectedBook.title}</h3>
                    <p className="book-author">by {selectedBook.author}</p>
                    <p className="book-genre">{selectedBook.genre}</p>
                  </div>
                )}

                {/* Rating */}
                <div className="form-group">
                  <label>Rating</label>
                  <div className="rating-input">
                    {renderStars()}
                    {formData.rating > 0 && <span className="rating-text">{formData.rating} out of 5 stars</span>}
                  </div>
                </div>

                {/* Review Title */}
                <div className="form-group">
                  <label htmlFor="title">Review Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Give your review a title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                {/* Review Content */}
                <div className="form-group">
                  <label htmlFor="content">Review</label>
                  <textarea
                    id="content"
                    placeholder="Share your thoughts about this book..."
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="form-textarea"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="form-actions">
                  <button type="submit" disabled={submitting} className="btn btn-primary">
                    {submitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewReviewPage
