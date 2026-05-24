import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './PathStepper.module.css'

export default function PathStepper({ steps, currentStep }) {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width)
    })
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Generate cubic bezier path
  const generatePath = () => {
    if (width === 0) return ""
    const startX = 40
    const endX = width - 40
    const segWidth = (endX - startX) / (steps.length - 1)
    
    let d = `M ${startX} 40 `
    for (let i = 1; i < steps.length; i++) {
      const prevX = startX + (i - 1) * segWidth
      const nextX = startX + i * segWidth
      const midX = (prevX + nextX) / 2
      const offset = i % 2 === 0 ? 20 : -20
      d += `C ${midX} ${40 + offset}, ${midX} ${40 + offset}, ${nextX} 40 `
    }
    return d
  }

  const pathD = generatePath()
  const progressLength = steps.length > 1 ? currentStep / (steps.length - 1) : 0

  return (
    <div className={styles.container} ref={containerRef}>
      {width > 0 && (
        <svg width="100%" height="100" className={styles.svg}>
          <path d={pathD} fill="none" stroke="var(--text-muted)" strokeWidth="1.5" opacity="0.3" />
          <motion.path 
            d={pathD} fill="none" stroke="var(--accent-primary)" strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progressLength }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          />
          {steps.map((step, i) => {
            const x = 40 + (i * ((width - 80) / (steps.length - 1)))
            const isCompleted = i < currentStep
            const isCurrent = i === currentStep
            
            return (
              <g key={i} transform={`translate(${x}, 40)`}>
                <motion.rect 
                  x="-6" y="-6" width="12" height="12" 
                  fill={isCompleted || isCurrent ? "var(--accent-primary)" : "var(--bg-base)"}
                  stroke={isCompleted || isCurrent ? "var(--accent-primary)" : "var(--text-muted)"}
                  strokeWidth="2"
                  animate={isCurrent ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                  style={{ transformOrigin: 'center', rotate: 45 }}
                />
                {isCompleted && (
                  <motion.path 
                    d="M-2 0 l2 2 l4 -4" fill="none" stroke="#fff" strokeWidth="2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  />
                )}
                <text y="30" textAnchor="middle" className={styles.label} fill={isCurrent ? "var(--accent-primary)" : "var(--text-primary)"}>
                  {step}
                </text>
              </g>
            )
          })}
        </svg>
      )}
    </div>
  )
}
