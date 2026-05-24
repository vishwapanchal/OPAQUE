import { useState } from 'react'
import { motion } from 'framer-motion'
import styles from './FloatingInput.module.css'

export default function FloatingInput({ label, value, onChange, type = "text" }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0

  return (
    <div className={styles.wrapper}>
      <motion.label
        className={styles.label}
        initial={false}
        animate={{
          y: active ? -24 : 0,
          scale: active ? 0.8 : 1,
          color: active ? "var(--accent-primary)" : "var(--text-secondary)"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ originX: 0 }}
      >
        {label}
      </motion.label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={styles.input}
      />
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      {value.length > 0 && !focused && (
        <svg viewBox="0 0 24 24" className={styles.checkIcon}>
          <motion.path 
            d="M5 13l4 4L19 7" stroke="var(--accent-secondary)" strokeWidth="2" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          />
        </svg>
      )}
    </div>
  )
}