import { motion } from 'framer-motion'
import styles from './PullIndicator.module.css'

export default function PullIndicator({ distance, isRefreshing }) {
  // Cap visual distance rotation
  const rotate = Math.min(distance * 3, 180)
  const opacity = Math.min(distance / 40, 1)

  return (
    <motion.div 
      className={styles.indicatorWrap}
      style={{ height: distance }}
      animate={{ height: isRefreshing ? 60 : distance }}
    >
      <motion.div 
        className={styles.iconBox}
        style={{ opacity }}
        animate={isRefreshing ? { opacity: 1 } : { opacity }}
      >
        <svg viewBox="0 0 24 24" className={styles.icon}>
          <motion.path 
            d="M12 4V2M12 4C8 4 4 8 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" 
            stroke="var(--accent-primary)" strokeWidth="2" fill="none" strokeLinecap="round"
            animate={isRefreshing ? { rotate: 360 } : { rotate }}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
            style={{ originX: '50%', originY: '50%' }}
          />
          {!isRefreshing && (
            <path d="M8 8l4-4 4 4" stroke="var(--accent-primary)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </motion.div>
    </motion.div>
  )
}
