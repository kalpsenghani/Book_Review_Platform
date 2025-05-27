"use client"

import { useEffect, useState } from "react"
import { useApp } from "../contexts/AppContext"
import BookCard from "../components/BookCard"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import "./BooksPage.css"

const API_BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api"

function BooksPage() {
  const { state, dispatch } = useApp()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const genres = [
    "All Genres",
    "Classic Literature",
    "Science Fiction",
    "Romance",
    "Mystery",
    "Fantasy",
    "Dystopian Fiction",
    "Historical Fiction",
  ]

  useEffect(() => {
    const fetchBooks = async () => {
      dispatch({ type: "SET_LOADING", payload: true })
      dispatch({ type: "SET_ERROR", payload: null })

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "12",
        })

        if (state.searchQuery) {
          params.append("search", state.searchQuery)
        }

        if (state.selectedGenre && state.selectedGenre !== "All Genres") {
          params.append("genre", state.selectedGenre)
        }

        const response = await fetch(`${API_BASE_URL}/books?${params}`)
        if (!response.ok) throw new Error("Failed to fetch books")

        const data = await response.json()
        dispatch({ type: "SET_BOOKS", payload: data.data })
        setTotalPages(data.pagination.totalPages)
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load books" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    fetchBooks()
  }, [dispatch, currentPage, state.searchQuery, state.selectedGenre])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleGenreChange = (e) => {
    dispatch({ type: "SET_SELECTED_GENRE", payload: e.target.value })
    setCurrentPage(1)
  }

  const clearFilters = () => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: "" })
    dispatch({ type: "SET_SELECTED_GENRE", payload: "All Genres" })
    setCurrentPage(1)
  }

  return (
    <div className="books-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Browse Books</h1>

          {/* Search and Filter */}
          <div className="filters">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="search"
                placeholder="Search by title, author, or ISBN..."
                className="search-input"
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>

            <div className="filter-controls">
              <select value={state.selectedGenre} onChange={handleGenreChange} className="genre-select">
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(state.searchQuery || (state.selectedGenre && state.selectedGenre !== "All Genres")) && (
            <div className="active-filters">
              <span className="filter-label">Active filters:</span>
              {state.searchQuery && <span className="filter-tag">Search: "{state.searchQuery}"</span>}
              {state.selectedGenre && state.selectedGenre !== "All Genres" && (
                <span className="filter-tag">Genre: {state.selectedGenre}</span>
              )}
              <button onClick={clearFilters} className="clear-filters">
                Clear all
              </button>
            </div>
          )}
        </div>

        {state.error && (
          <div className="error-container">
            <ErrorMessage message={state.error} />
          </div>
        )}

        {state.loading ? (
          <div className="loading-container">
            <LoadingSpinner size="lg" text="Loading books..." />
          </div>
        ) : state.books.length > 0 ? (
          <>
            <div className="books-grid">
              {state.books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No books found matching your criteria.</p>
            <button onClick={clearFilters} className="btn btn-outline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default BooksPage
