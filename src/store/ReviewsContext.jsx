import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { load, save } from './storage.js'

const ReviewsContext = createContext(null)

// Customer product reviews, kept locally (localStorage). Shape: { [productId]: Review[] }.
export function ReviewsProvider({ children }) {
  const [all, setAll] = useState(() => load('reviews', {}))

  useEffect(() => save('reviews', all), [all])

  function addReview(productId, { rating, text, author }) {
    const review = {
      rating,
      text: text.trim(),
      author: author || 'You',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    setAll((prev) => ({ ...prev, [productId]: [review, ...(prev[productId] ?? [])] }))
  }

  const value = useMemo(
    () => ({ getReviews: (id) => all[id] ?? [], addReview }),
    [all],
  )
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
}

export function useReviews() {
  const ctx = useContext(ReviewsContext)
  if (!ctx) throw new Error('useReviews must be used within ReviewsProvider')
  return ctx
}
