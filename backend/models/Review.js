const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make user optional for anonymous reviews
  },
  user_name: {
    type: String,
    required: [true, 'Reviewer name is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    minlength: [10, 'Review content must be at least 10 characters long']
  }
}, {
  timestamps: true
});

// Index for better query performance - only enforce uniqueness when user is present
reviewSchema.index({ book: 1, user: 1 }, { 
  unique: true,
  partialFilterExpression: { user: { $exists: true } }
});

// Middleware to update book rating
reviewSchema.post('save', async function() {
  const Book = mongoose.model('Book');

  try {
    // Update book rating
    const bookStats = await this.constructor.aggregate([
      { $match: { book: this.book } },
      { 
        $group: {
          _id: '$book',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (bookStats.length > 0) {
      await Book.findByIdAndUpdate(this.book, {
        average_rating: bookStats[0].averageRating,
        total_reviews: bookStats[0].totalReviews
      });
    }

    // Only update user review count if user exists
    if (this.user) {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(this.user, {
        $inc: { review_count: 1 }
      });
    }
  } catch (error) {
    console.error('Error updating related documents:', error);
  }
});

// Middleware to update book rating on delete
reviewSchema.post('remove', async function() {
  const Book = mongoose.model('Book');

  try {
    // Update book rating
    const bookStats = await this.constructor.aggregate([
      { $match: { book: this.book } },
      { 
        $group: {
          _id: '$book',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (bookStats.length > 0) {
      await Book.findByIdAndUpdate(this.book, {
        average_rating: bookStats[0].averageRating,
        total_reviews: bookStats[0].totalReviews
      });
    } else {
      await Book.findByIdAndUpdate(this.book, {
        average_rating: 0,
        total_reviews: 0
      });
    }

    // Only update user review count if user exists
    if (this.user) {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(this.user, {
        $inc: { review_count: -1 }
      });
    }
  } catch (error) {
    console.error('Error updating related documents:', error);
  }
});

module.exports = mongoose.model('Review', reviewSchema); 