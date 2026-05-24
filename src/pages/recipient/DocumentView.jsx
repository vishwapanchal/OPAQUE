import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useHaptic } from '../../hooks/useHaptic'
import { downloadDocument, deleteDocument } from '../../api/documents'
import { useToast } from '../../components/ui/ToastProvider'
import styles from './DocumentView.module.css'

export default function DocumentView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { vibrate } = useHaptic()
  const { addToast } = useToast()
  
  const [docState, setDocState] = useState('locked')
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [text, setText] = useState('')
  
  const handleDecrypt = async () => {
    setIsDecrypting(true)
    vibrate(50)
    
    try {
      const blob = await downloadDocument(id)
      const content = await blob.text()
      
      // Matrix style decoding effect
      let iterations = 0
      const interval = setInterval(() => {
        setText(content.split('').map(c => 
          c === '\n' ? '\n' : (Math.random() > 0.5 ? String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)) : c)
        ).join(''))
        iterations++
        if (iterations > 30) {
          clearInterval(interval)
          setText(content)
          setDocState('unlocked')
          setIsDecrypting(false)
          vibrate([100, 50, 100])
        }
      }, 50)
    } catch (e) {
      addToast({ title: 'Decryption Error', message: e.message, type: 'error' })
      setIsDecrypting(false)
    }
  }

  const handleClose = async () => {
    try {
      await deleteDocument(id)
    } catch (e) {
      console.error('Failed to purge document', e)
    } finally {
      navigate('/recipient/documents')
    }
  }

  return (
    <div className={styles.page}>
      {docState === 'locked' && (
        <div className={styles.lockedContainer}>
           <div className={styles.lockIcon}>
             <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5">
               <rect x="3" y="11" width="18" height="11" rx="2" />
               <path d="M7 11V7a5 5 0 0 1 10 0v4" />
             </svg>
           </div>
           <h2 style={{color: 'var(--text-main)', fontFamily: 'monospace'}}>ENCRYPTED_PAYLOAD.TXT</h2>
           <p style={{color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 8}}>AES-256-GCM</p>
           
           <button className={styles.decryptBtn} onClick={handleDecrypt} disabled={isDecrypting}>
             {isDecrypting ? 'DECRYPTING...' : 'DECRYPT LOCALLY'}
           </button>
        </div>
      )}

      {(docState === 'unlocked' || isDecrypting) && (
        <div className={styles.unlockedContainer}>
          <div className={styles.watermarkWarning}>
            ATTRIBUTION WATERMARK ACTIVE
          </div>
          <div className={styles.documentPaper}>
             <pre className={styles.docText}>{text}</pre>
          </div>
          <button className={styles.backBtn} onClick={handleClose}>
            CLOSE & PURGE KEY
          </button>
        </div>
      )}
    </div>
  )
}
