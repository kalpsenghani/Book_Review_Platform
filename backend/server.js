require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Book = require('./models/Book');
const User = require('./models/User');
const Review = require('./models/Review');

const isDevelopment = process.env.NODE_ENV !== 'production';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: isDevelopment ? 'http://localhost:3000' : process.env.FRONTEND_URL || '*',
    credentials: true,
  })
);
app.use(express.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong'
  });
};

// Routes

// GET /books - Retrieve all books with pagination and filtering
app.get('/api/books', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number.parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const genre = req.query.genre;
    const search = req.query.search;

    const query = {};

    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    if (search) {
      query.$text = { $search: search };
    }

    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(query)
    ]);

    res.json({
      data: books,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /books/:id - Retrieve a specific book
app.get('/api/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ data: book });
  } catch (error) {
    next(error);
  }
});

// POST /books - Create a new book
app.post('/api/books', async (req, res, next) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ data: book });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ errors: Object.values(error.errors).map(err => err.message) });
    }
    next(error);
  }
});

// GET /reviews - Retrieve reviews for a book or user
app.get('/api/reviews', async (req, res, next) => {
  try {
    const query = {};
    
    if (req.query.bookId) {
      query.book = req.query.bookId;
    }
    
    if (req.query.userId) {
      query.user = req.query.userId;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate('book', 'title author')
      .populate('user', 'name avatar');

    res.json({ data: reviews });
  } catch (error) {
    next(error);
  }
});

// POST /reviews - Create a new review
app.post('/api/reviews', async (req, res, next) => {
  try {
    const review = new Review(req.body);
    await review.save();
    
    const populatedReview = await Review.findById(review._id)
      .populate('book', 'title author')
      .populate('user', 'name avatar');

    res.status(201).json({ data: populatedReview });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ errors: Object.values(error.errors).map(err => err.message) });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this book' });
    }
    next(error);
  }
});

// GET /users/:id - Retrieve user profile
app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});

// PUT /users/:id - Update user profile
app.put('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ errors: Object.values(error.errors).map(err => err.message) });
    }
    next(error);
  }
});

// POST /users - Create a new user
app.post('/api/users', async (req, res, next) => {
  try {
    // For anonymous users, generate a unique name if not provided
    if (!req.body.email) {
      req.body.role = 'anonymous';
      if (!req.body.name) {
        req.body.name = `Anonymous Reviewer ${Date.now()}`;
      }
    } else {
      req.body.role = 'registered';
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json({ data: user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ errors: Object.values(error.errors).map(err => err.message) });
    }
    next(error);
  }
});

// Apply error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});

module.exports = app;
