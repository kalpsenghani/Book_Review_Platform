const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

const dummyBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    genre: "Fiction",
    published_date: "1925-04-10",
    isbn: "9780743273565",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60",
    featured: true,
    average_rating: 4.5,
    total_reviews: 245
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.",
    genre: "Fiction",
    published_date: "1960-07-11",
    isbn: "9780446310789",
    cover_image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60",
    featured: true,
    average_rating: 4.8,
    total_reviews: 312
  },
  {
    title: "1984",
    author: "George Orwell",
    description: "1984 is a dystopian social science fiction novel and cautionary tale. Thematically, it centres on the consequences of totalitarianism, mass surveillance and repressive regimentation of persons and behaviours within society.",
    genre: "Science Fiction",
    published_date: "1949-06-08",
    isbn: "9780451524935",
    cover_image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60",
    featured: true,
    average_rating: 4.6,
    total_reviews: 189
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "Pride and Prejudice is a romantic novel of manners written by Jane Austen in 1813. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    genre: "Romance",
    published_date: "1813-01-28",
    isbn: "9780141439518",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60",
    featured: false,
    average_rating: 4.7,
    total_reviews: 278
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.",
    genre: "Fantasy",
    published_date: "1937-09-21",
    isbn: "9780547928227",
    cover_image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60",
    featured: false,
    average_rating: 4.9,
    total_reviews: 423
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. It was originally intended for adults but is often read by adolescents for its themes of angst and alienation, and as a critique on superficiality in society.",
    genre: "Fiction",
    published_date: "1951-07-16",
    isbn: "9780316769488",
    cover_image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60",
    featured: false,
    average_rating: 4.2,
    total_reviews: 156
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller.",
    genre: "Fiction",
    published_date: "1988-01-01",
    isbn: "9780062315007",
    cover_image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop&q=60",
    featured: true,
    average_rating: 4.4,
    total_reviews: 198
  },
  {
    title: "The Little Prince",
    author: "Antoine de Saint-Exupéry",
    description: "The Little Prince is a novella by French aristocrat, writer, and military aviator Antoine de Saint-Exupéry. It was first published in English and French in the US by Reynal & Hitchcock in April 1943, and posthumously in France following the liberation of France as Saint-Exupéry's works had been banned by the Vichy Regime.",
    genre: "Fiction",
    published_date: "1943-04-06",
    isbn: "9780156013987",
    cover_image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop&q=60",
    featured: false,
    average_rating: 4.8,
    total_reviews: 267
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/book-review-platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing books
    await Book.deleteMany({});
    console.log('Cleared existing books');

    // Insert new books
    const insertedBooks = await Book.insertMany(dummyBooks);
    console.log(`Successfully seeded ${insertedBooks.length} books`);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 