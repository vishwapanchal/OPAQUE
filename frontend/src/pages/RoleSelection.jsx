import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './RoleSelection.module.css'

export default function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <div className="globalMesh" />
      
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <header className={styles.header}>
          <h1>OPAQUE</h1>
          <p>SELECT OPERATIONAL NODE</p>
        </header>

        <div className={styles.cards}>
          <motion.div 
            className={styles.card}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/sender/dashboard')}
          >
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h2>SENDER NODE</h2>
            <p>Initialize secure sessions, watermark payloads, and deliver encrypted documents from a secure terminal.</p>
            <div className={styles.badge}>DESKTOP ONLY</div>
          </motion.div>

          <motion.div 
            className={styles.card}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/recipient')}
          >
            <div className={styles.icon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <h2>INITIALIZE OPTICAL SYNC</h2>
            <p>Scan optical key exchanges and decrypt air-gapped payloads locally on your mobile device.</p>
            <div className={styles.badge}>MOBILE OPTIMIZED</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
