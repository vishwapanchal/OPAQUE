import { motion } from 'framer-motion'
import styles from './Button.module.css'

export default function Button({ variant = 'primary', children, onClick, loading, disabled, icon, className = '' }) {
  const isPrimary = variant === 'primary'

  return (
    <motion.button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={!disabled && !loading ? { scale: 0.96 } : {}}
      whileHover={!disabled && !loading ? "hover" : ""}
    >
      <div 
        className={styles.fill} 
      />
      
      <motion.div 
        className={styles.hoverFill} 
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        style={{ transformOrigin: 'bottom left' }}
      />
      
      <span className={styles.content}>
        {loading ? (
          <SpinnerIcon />
        ) : (
          <>
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
          </>
        )}
      </span>
    </motion.button>
  )
}

function SpinnerIcon() {
  const triangle = "M 12 2 L 22 20 L 2 20 Z"
  const circle = "M 12 2 A 10 10 0 1 1 11.9 2"
  const hexagon = "M 12 2 L 20 6 L 20 18 L 12 22 L 4 18 L 4 6 Z"

  return (
    <svg viewBox="0 0 24 24" className={styles.spinnerIcon}>
      <motion.path
        animate={{
          d: [triangle, circle, hexagon, triangle],
          rotate: [0, 120, 240, 360]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}