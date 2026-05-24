import { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Toast.module.css'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((payload) => {
    // support string or object payload
    const title = typeof payload === 'string' ? '' : payload.title
    const message = typeof payload === 'string' ? payload : payload.message
    const type = typeof payload === 'string' ? 'info' : (payload.type || 'info')
    
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, title, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const toast = {
    success: (msg) => addToast({ message: msg, type: 'success' }),
    error: (msg) => addToast({ message: msg, type: 'error' }),
    info: (msg) => addToast({ message: msg, type: 'info' })
  }

  return (
    <ToastContext.Provider value={{ toast, addToast }}>
      {children}
      {createPortal(
        <div className={styles.toastContainer}>
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ x: 120, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 120, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`${styles.toast} ${styles[t.type]}`}
              >
                <div className={styles.toastContent}>
                  {t.type === 'success' && (
                    <svg viewBox="0 0 24 24" className={styles.icon}>
                      <motion.path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }}
                      />
                    </svg>
                  )}
                  {t.type === 'error' && (
                    <svg viewBox="0 0 24 24" className={styles.icon}>
                      <path d="M4 12H10L12 6L14 18L16 12H20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
                    </svg>
                  )}
                  {t.type === 'info' && (
                    <svg viewBox="0 0 24 24" className={styles.icon}>
                      <motion.path d="M12 2V22 M12 12L22 2" stroke="currentColor" strokeWidth="2" fill="none"
                        animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>
                  )}
                  <span className={styles.message}>{t.message}</span>
                </div>
                <svg className={styles.progress} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path d="M50 0 A50 50 0 1 1 49.9 0" 
                    stroke="currentColor" strokeWidth="4" fill="none" 
                    initial={{ pathLength: 1 }} animate={{ pathLength: 0 }} transition={{ duration: 4, ease: 'linear' }} 
                  />
                </svg>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)