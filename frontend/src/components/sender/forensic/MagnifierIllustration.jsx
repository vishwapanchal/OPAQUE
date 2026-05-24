import { useMotionValue, motion } from 'framer-motion'
import { useCallback, useEffect, useState, useMemo } from 'react'

export default function MagnifierIllustration() {
  const x = useMotionValue(100)
  const y = useMotionValue(100)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const handlePointerMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left)
    y.set(e.clientY - rect.top)
  }, [x, y])

  const dots = useMemo(() => Array.from({ length: 12 }).map(() => ({
    cx: 20 + Math.random() * 160,
    cy: 20 + Math.random() * 160,
    delay: Math.random() * 2
  })), [])

  return (
    <div 
      style={{ width: '100%', height: '100%', minHeight: '200px', position: 'relative', overflow: 'hidden' }}
      onPointerMove={handlePointerMove}
    >
      <svg width="100%" height="100%" viewBox="0 0 200 200">
        {/* Base Document */}
        <path d="M40 20 L140 20 L160 40 L160 180 L40 180 Z" fill="var(--bg-paper)" stroke="var(--bg-panel-border)" strokeWidth="2" />
        <path d="M140 20 L140 40 L160 40" fill="none" stroke="var(--bg-panel-border)" strokeWidth="2" />
        
        {/* Invisible Dots */}
        {mounted && dots.map((dot, i) => (
          <motion.circle 
            key={i} cx={dot.cx} cy={dot.cy} r="2" fill="var(--accent-primary)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: dot.delay, repeat: Infinity }}
          />
        ))}

        {/* Magnifier glass area */}
        <clipPath id="magnifier-clip">
          <motion.circle cx={x} cy={y} r="40" />
        </clipPath>

        {/* Magnifier visible layer (glowing dots) */}
        <g clipPath="url(#magnifier-clip)">
          <path d="M40 20 L140 20 L160 40 L160 180 L40 180 Z" fill="rgba(79, 70, 229, 0.05)" />
          {dots.map((dot, i) => (
            <circle key={`glow-${i}`} cx={dot.cx} cy={dot.cy} r="3" fill="var(--accent-primary)" />
          ))}
        </g>

        {/* Magnifier Lens/Ring */}
        <motion.circle cx={x} cy={y} r="40" fill="none" stroke="var(--accent-primary)" strokeWidth="2" style={{ pointerEvents: 'none' }} />
      </svg>
    </div>
  )
}
