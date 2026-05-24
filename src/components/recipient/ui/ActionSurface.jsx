import { motion } from 'framer-motion'
import styles from './ActionSurface.module.css'

export default function ActionSurface({ variant = 'primary', children, onClick, icon, className = '' }) {
  return (
    <motion.button
      className={`${styles.surface} ${styles[variant]} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.08 }}
    >
      {/* Primary variant texture overlay */}
      {variant === 'primary' && (
        <div className={styles.texture} />
      )}
      <div className={styles.content}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {children}
      </div>
    </motion.button>
  )
}
