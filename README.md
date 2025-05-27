# Book Review Platform

A modern web application for book enthusiasts to discover, review, and discuss books. Built with React, Node.js, and MongoDB.

## Features

- 📚 Browse and search books
- ⭐ Write and read book reviews
- 👤 User profiles with review history
- 🏷️ Genre-based filtering
- 📱 Responsive design for all devices
- 🔍 Advanced search functionality
- ⭐ Rating system
- 💬 Review comments and likes

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS3 with modern features
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- RESTful API architecture
- JWT authentication (coming soon)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-review-platform.git
   cd book-review-platform
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Environment Setup:
   Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from frontend directory)
   npm start
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
book-review-platform/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── App.js
│   └── package.json
└── README.md
```

## API Endpoints

### Books
- `GET /api/books` - Get all books (with pagination and filtering)
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### Reviews
- `GET /api/reviews` - Get all reviews (with filtering)
- `GET /api/reviews/:id` - Get a specific review
- `POST /api/reviews` - Create a new review
- `PUT /api/reviews/:id` - Update a review
- `DELETE /api/reviews/:id` - Delete a review

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users` - Create a new user
