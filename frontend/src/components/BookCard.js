import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

// Dummy book covers
const bookCovers = {
  default: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60',
  fiction: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60',
  mystery: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60',
  scifi: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60',
  romance: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60'
};

function BookCard({ book }) {
  const {
    _id,
    title,
    author,
    description,
    average_rating,
    total_reviews,
    genre,
    cover_image,
    featured
  } = book;

  const getBookCover = () => {
    if (cover_image) return cover_image;
    return bookCovers[genre?.toLowerCase()] || bookCovers.default;
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="book-card">
      {featured && <span className="book-badge">Featured</span>}
      <img
        src={getBookCover()}
        alt={`Cover of ${title}`}
        className="book-image"
        loading="lazy"
      />
      <div className="book-content">
        <h3 className="book-title">{title}</h3>
        <p className="book-author">by {author}</p>
        <p className="book-description">{truncateDescription(description)}</p>
        <div className="book-meta">
          <div className="book-rating">
            <span>★</span>
            <span>{formatRating(average_rating)}</span>
            <span>({total_reviews} reviews)</span>
          </div>
          <div className="book-actions">
            <Link to={`/books/${_id}`} className="book-button secondary-button">
              Details
            </Link>
            <Link to={`/reviews/new?bookId=${_id}`} className="book-button primary-button">
              Review
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
