"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReviewCard from "../components/ReviewCard"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import "./ProfilePage.css"

const API_BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api"

function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch user profile
        const userResponse = await fetch(`${API_BASE_URL}/users/${id}`)
        if (!userResponse.ok) throw new Error("Failed to fetch user profile")
        const userData = await userResponse.json()
        setUser(userData.data)

        // Fetch user's reviews
        const reviewsResponse = await fetch(`${API_BASE_URL}/reviews?userId=${id}`)
        if (!reviewsResponse.ok) throw new Error("Failed to fetch user reviews")
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id])

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <ErrorMessage message={error} />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-container">
        <ErrorMessage message="User not found" />
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <button 
            onClick={() => navigate(-1)} 
            className="back-button"
            aria-label="Go back"
          >
            ← Back
          </button>
          <div className="profile-info">
            <div className="profile-avatar">
              <img 
                src={user.avatar || '/placeholder.svg?height=100&width=100'} 
                alt={`${user.name}'s avatar`}
              />
            </div>
            <div className="profile-details">
              <h1>{user.name}</h1>
              {user.email && <p className="email">{user.email}</p>}
              <div className="stats">
                <div className="stat">
                  <span className="stat-value">{user.review_count}</span>
                  <span className="stat-label">Reviews</span>
                </div>
                {user.favorite_genres && user.favorite_genres.length > 0 && (
                  <div className="genres">
                    <h3>Favorite Genres</h3>
                    <div className="genre-tags">
                      {user.favorite_genres.map((genre, index) => (
                        <span key={index} className="genre-tag">{genre}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews by {user.name}</h2>
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet</p>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
