"use client"

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from "../components/BookCard"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import "./HomePage.css"

const API_BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api"

function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/books?featured=true&limit=3`);
        if (!response.ok) throw new Error('Failed to fetch featured books');
        const data = await response.json();
        setFeaturedBooks(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBooks();
  }, []);

  if (loading) {
    return (
      <div className="home-page">
        <div className="container">
          <LoadingSpinner size="lg" text="Loading featured books..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="container">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Discover Your Next Great Read</h1>
          <p className="hero-subtitle">
            Explore our collection of books and share your thoughts with the community
          </p>
          <Link to="/books" className="btn btn-primary btn-lg">
            Browse Books
          </Link>
        </div>
      </div>

      <div className="container">
        <section className="featured-books">
          <div className="section-header">
            <h2 className="section-title">Featured Books</h2>
            <Link to="/books" className="view-all-link">
              View All Books
            </Link>
          </div>

          <div className="books-grid">
            {featuredBooks.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
