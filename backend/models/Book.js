const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    minlength: [1, 'Author cannot be empty']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  cover_image: {
    type: String,
    default: '/placeholder.svg?height=300&width=200'
  },
  genre: {
    type: String,
    trim: true,
    maxlength: [50, 'Genre cannot be more than 50 characters']
  },
  published_date: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || /^\d{4}-\d{2}-\d{2}$/.test(v.toISOString().split('T')[0]);
      },
      message: 'Published date must be in YYYY-MM-DD format'
    }
  },
  isbn: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        // Remove all hyphens and spaces
        const cleanIsbn = v.replace(/[- ]/g, '');
        // Check if it's a valid ISBN-13 format
        return /^978\d{10}$/.test(cleanIsbn);
      },
      message: 'ISBN must be a valid ISBN-13 format'
    }
  },
  average_rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  total_reviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better search performance
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema); 