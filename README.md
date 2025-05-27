# Book Review Platform

A full-stack book review platform built with React frontend and Node.js/Express backend with SQL database.

## Features

### Frontend (React)
- **Home page** with featured books and statistics
- **Book listing page** with search and filter functionality
- **Individual book pages** with details and reviews
- **User profile page** with editable information
- **Review submission form** with rating system
- **Responsive design** that works on all devices
- **State management** using React Context API
- **React Router** for navigation
- **Error handling** and loading states

### Backend (Node.js/Express)
- **RESTful API** with comprehensive endpoints
- **SQL database** using SQLite for data persistence
- **Data validation** and error handling
- **CORS support** for cross-origin requests

## API Endpoints

- `GET /api/books` - Retrieve all books (with pagination, search, filtering)
- `GET /api/books/:id` - Retrieve a specific book
- `POST /api/books` - Add a new book (admin only)
- `GET /api/reviews` - Retrieve reviews (filterable by book/user)
- `POST /api/reviews` - Submit a new review
- `GET /api/users/:id` - Retrieve user profile
- `PUT /api/users/:id` - Update user profile

## Installation & Setup

### Backend Setup
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the server:
   \`\`\`bash
   npm run dev
   \`\`\`
   The backend will run on http://localhost:5000

### Frontend Setup
1. Navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`
   The frontend will run on http://localhost:3000

## Database Schema

### Books Table
- id (INTEGER PRIMARY KEY)
- title (TEXT)
- author (TEXT)
- description (TEXT)
- cover_image (TEXT)
- genre (TEXT)
- published_date (TEXT)
- isbn (TEXT)
- average_rating (REAL)
- total_reviews (INTEGER)
- featured (BOOLEAN)

### Users Table
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- email (TEXT UNIQUE)
- avatar (TEXT)
- joined_date (TEXT)
- review_count (INTEGER)
- favorite_genres (TEXT - JSON)

### Reviews Table
- id (INTEGER PRIMARY KEY)
- book_id (INTEGER)
- user_id (INTEGER)
- user_name (TEXT)
- rating (INTEGER)
- title (TEXT)
- content (TEXT)
- created_at (TEXT)

## Technologies Used

### Frontend
- React 18
- React Router DOM
- React Context API
- CSS3 with Flexbox/Grid
- Responsive Design

### Backend
- Node.js
- Express.js
- SQLite3
- CORS middleware

## Features Implemented

✅ **Code Quality**: Well-organized, modular code structure
✅ **React Hooks**: Proper use of useState, useEffect, useContext
✅ **RESTful API**: Clean, consistent API design
✅ **Database Design**: Normalized schema with proper relationships
✅ **Error Handling**: Comprehensive error handling throughout
✅ **Documentation**: Clear README and code comments
✅ **UI/UX Design**: Modern, responsive, user-friendly interface

## Future Enhancements

- User authentication and authorization
- Book recommendation system
- Social features (following users, sharing reviews)
- Admin dashboard for content management
- Image upload for book covers and user avatars
- Advanced search with filters
- Email notifications
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
