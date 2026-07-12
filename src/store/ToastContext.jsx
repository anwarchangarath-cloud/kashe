import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Check } from 'lucide-react'

const ToastContext = createContext(null)

// Minimal transient toast, bottom-inline-end. Used for add-to-cart / wishlist feedback.
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const show = useCallback((message) => {
    setToast({ message, id: Date.now() })
    window.clearTimeout(show._t)
    show._t = window.setTimeout(() => setToast(null), 2200)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 end-6 z-50 flex items-center gap-2 rounded-lg bg-brand-dark px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-success text-white">
            <Check size={13} />
          </span>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
