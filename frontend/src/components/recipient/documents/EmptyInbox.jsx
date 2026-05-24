import { motion } from 'framer-motion'
import styles from './EmptyInbox.module.css'

export default function EmptyInbox() {
  return (
    <div className={styles.container}>
      <div className={styles.animationWrap}>
        <svg viewBox="0 0 100 100" width="80" height="80">
          {/* Document 1 */}
          <motion.path 
            d="M30 20 L60 20 L70 30 L70 80 L30 80 Z" 
            fill="none" stroke="var(--text-muted)" strokeWidth="3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -20, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Document 2 (staggered) */}
          <motion.path 
            d="M30 20 L60 20 L70 30 L70 80 L30 80 Z" 
            fill="none" stroke="var(--accent-primary)" strokeWidth="3" opacity="0.4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: -20, opacity: [0, 1, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.25 }}
          />
        </svg>
      </div>
      <h3 className={styles.title}>No documents yet</h3>
      <p className={styles.desc}>Complete a key exchange first</p>
    </div>
  )
}
