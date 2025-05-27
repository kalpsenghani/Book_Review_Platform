"use client"
import { Link, useLocation } from "react-router-dom"
import { useApp } from "../contexts/AppContext"
import "./Header.css"

function Header() {
  const location = useLocation()
  const { state, dispatch } = useApp()

  const handleSearch = (e) => {
    e.preventDefault()
    // Search functionality would redirect to books page with query
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">BookReview</span>
          </Link>

          <nav className="nav">
            <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
              Home
            </Link>
            <Link to="/books" className={`nav-link ${location.pathname === "/books" ? "active" : ""}`}>
              Books
            </Link>
            <Link to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
              Profile
            </Link>
          </nav>

          <div className="header-actions">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="search"
                placeholder="Search books..."
                className="search-input"
                value={state.searchQuery}
                onChange={(e) => dispatch({ type: "SET_SEARCH_QUERY", payload: e.target.value })}
              />
              <button type="submit" className="search-button">
                🔍
              </button>
            </form>

            <Link to="/profile" className="profile-button">
              👤
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
