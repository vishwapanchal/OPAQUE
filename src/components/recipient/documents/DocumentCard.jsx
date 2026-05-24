import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styles from './DocumentCard.module.css'

export default function DocumentCard({ doc, onDelete }) {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const isEncrypted = doc.status === 'encrypted'

  // Collapse drawer if tapped outside
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (!e.target.closest(`[data-doc-id="${doc.id}"]`)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isOpen, doc.id])

  const handleAction = (e) => {
    e.stopPropagation()
    navigate(`/documents/${doc.id}`)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete(doc.id)
  }

  return (
    <motion.li 
      data-doc-id={doc.id}
      className={styles.card}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ x: '100%', opacity: 0 }}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`${styles.accentStripe} ${isEncrypted ? styles.encrypted : styles.decrypted}`} />
      
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{doc.name}</span>
          <span className={styles.time}>{doc.timestamp}</span>
        </div>
        
        <div className={styles.metaRow}>
          <span className={styles.sessionLabel}>{doc.sessionLabel}</span>
          <div className={styles.glyphBox}>
            {isEncrypted ? (
              <motion.div 
                className={styles.pulseNode}
                animate={{ boxShadow: ['0 0 0 0 rgba(245,158,11,0.4)', '0 0 0 8px rgba(245,158,11,0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg viewBox="0 0 24 24" className={styles.iconEncrypted}>
                  <path d="M16 11V7a4 4 0 00-8 0v4 M5 11h14v10H5z" stroke="currentColor" fill="none" strokeWidth="2" />
                </svg>
              </motion.div>
            ) : (
              <svg viewBox="0 0 24 24" className={styles.iconDecrypted}>
                <path d="M16 11V7a4 4 0 00-8 0 M5 11h14v10H5z" stroke="currentColor" fill="none" strokeWidth="2" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.drawer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 48, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <button className={styles.actionBtn} onClick={handleAction}>
              {isEncrypted ? 'Decrypt & Open' : 'Open Document'}
            </button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  )
}
