import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppProvider } from "./contexts/AppContext"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import BooksPage from "./pages/BooksPage"
import BookDetailPage from "./pages/BookDetailPage"
import ProfilePage from "./pages/ProfilePage"
import NewReviewPage from "./pages/NewReviewPage"
import "./App.css"

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BooksPage />} />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reviews/new" element={<NewReviewPage />} />
              <Route path="/users/:id" element={<ProfilePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
