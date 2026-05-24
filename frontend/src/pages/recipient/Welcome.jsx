import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './Welcome.module.css'

export default function Welcome() {
  const navigate = useNavigate()

  return (
    <motion.div 
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.hero}>
        <div className={styles.heroIcon}>
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <motion.rect 
              x="20" y="25" width="60" height="50" rx="8" 
              fill="none" stroke="var(--grad-blue)" strokeWidth="3"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <motion.path 
              d="M35 50 L65 50 M45 40 L65 40 M45 60 L65 60" 
              stroke="var(--grad-cyan)" strokeWidth="3" strokeLinecap="round"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, staggerChildren: 0.2 }}
            />
          </svg>
        </div>
        
        <h1 className={styles.title}>RECIPIENT VAULT</h1>
        <p className={styles.subtitle}>SECURE VAULT STATUS: STANDBY</p>
      </div>

      <div className={styles.actions}>
        <motion.button 
          className={`${styles.surfaceBtn} ${styles.primary}`} 
          onClick={() => navigate('/recipient/scan')}
          whileTap={{ scale: 0.96 }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18 M9 21V9" /></svg>
          <div className={styles.btnContent}>
            <span className={styles.btnTitle}>SCAN EXCHANGE QR</span>
            <span className={styles.btnSub}>INITIATE HANDSHAKE</span>
          </div>
        </motion.button>
        
        <motion.button 
          className={styles.surfaceBtn} 
          onClick={() => navigate('/recipient/documents')}
          whileTap={{ scale: 0.96 }}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v16z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div className={styles.btnContent}>
            <span className={styles.btnTitle}>LOCAL VAULT</span>
            <span className={styles.btnSub}>VIEW STORED PAYLOADS</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
}
