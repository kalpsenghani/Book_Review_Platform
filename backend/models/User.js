const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address'
    }
  },
  role: {
    type: String,
    enum: ['anonymous', 'registered'],
    default: 'anonymous'
  },
  avatar: {
    type: String,
    default: '/placeholder.svg?height=100&width=100'
  },
  review_count: {
    type: Number,
    default: 0
  },
  favorite_genres: [{
    type: String,
    trim: true,
    maxlength: [50, 'Genre cannot be more than 50 characters']
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema); 