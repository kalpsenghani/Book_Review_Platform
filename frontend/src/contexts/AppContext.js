"use client"

import { createContext, useContext, useReducer } from "react"

const AppContext = createContext()

const initialState = {
  books: [],
  reviews: [],
  currentUser: null,
  loading: false,
  error: null,
  searchQuery: "",
  selectedGenre: "All Genres",
}

function appReducer(state, action) {
  switch (action.type) {
    case "SET_BOOKS":
      return { ...state, books: action.payload }
    case "SET_REVIEWS":
      return { ...state, reviews: action.payload }
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_SELECTED_GENRE":
      return { ...state, selectedGenre: action.payload }
    case "ADD_REVIEW":
      return { ...state, reviews: [...state.reviews, action.payload] }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
