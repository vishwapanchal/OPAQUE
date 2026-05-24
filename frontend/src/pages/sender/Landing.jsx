import { useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import styles from './Landing.module.css'

const UnfamiliarHeader = () => (
  <header className={styles.unfamiliarHeader}>
    <div className={styles.headerClusterLeft}>
      <div className={styles.dataBlock}>
        <span className={styles.dataLabel}>STATUS</span>
        <span className={styles.dataVal}>SECURE</span>
      </div>
      <div className={styles.dataBlock}>
        <span className={styles.dataLabel}>NODE</span>
        <span className={styles.dataVal}>SENDER</span>
      </div>
    </div>
    <div className={styles.headerClusterRight}>
      <motion.div 
        className={styles.pulsingDot}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className={styles.headerTitle}>OPAQUE</span>
    </div>
  </header>
)

const GradientButton = ({ children, onClick }) => (
  <motion.button 
    className={styles.gradientBtn}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className={styles.btnInner}>{children}</div>
    <div className={styles.btnGlow} />
  </motion.button>
)

const letterAnimations = [
  { initial: { scale: 0.1, rotateX: 180, filter: "blur(20px)" }, animate: { scale: 1, rotateX: 0, filter: "blur(0px)" } },
  { initial: { y: -200, skewX: 80 }, animate: { y: 0, skewX: 0 } },
  { initial: { rotateX: 360, rotateY: 360, scale: 3, opacity: 0 }, animate: { rotateX: 0, rotateY: 0, scale: 1, opacity: 1 } },
  { initial: { rotateZ: -1080, scale: 0 }, animate: { rotateZ: 0, scale: 1 } },
  { initial: { scaleY: 5, scaleX: 0.1, transformOrigin: "bottom" }, animate: { scaleY: 1, scaleX: 1 } },
  { initial: { clipPath: "circle(0% at 50% 50%)", rotate: 45 }, animate: { clipPath: "circle(150% at 50% 50%)", rotate: 0 } }
]

/* Cryptographic node network — professional key exchange visualization */
function KeyExchangeVisual() {
  const nodes = useMemo(() => [
    { cx: 100, cy: 80, label: 'A' },
    { cx: 400, cy: 80, label: 'B' },
    { cx: 250, cy: 250, label: 'K' },
    { cx: 60, cy: 350, label: 'S' },
    { cx: 440, cy: 350, label: 'R' },
    { cx: 250, cy: 430, label: 'V' },
  ], [])

  const edges = useMemo(() => [
    [0, 2], [1, 2], [0, 3], [1, 4], [2, 5], [3, 5], [4, 5], [2, 3], [2, 4]
  ], [])

  return (
    <svg viewBox="0 0 500 500" className={styles.heroSvg}>
      <defs>
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--grad-cyan)" />
          <stop offset="100%" stopColor="var(--grad-purple)" />
        </linearGradient>
        <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--grad-coral)" />
          <stop offset="100%" stopColor="var(--grad-blue)" />
        </linearGradient>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Edges with animated data flow */}
      {edges.map(([from, to], i) => (
        <g key={`edge-${i}`}>
          <line
            x1={nodes[from].cx} y1={nodes[from].cy}
            x2={nodes[to].cx} y2={nodes[to].cy}
            stroke="url(#edgeGrad)" strokeWidth="1" opacity="0.2"
          />
          <motion.circle
            r="3" fill="var(--grad-cyan)" opacity="0.6"
            animate={{
              cx: [nodes[from].cx, nodes[to].cx],
              cy: [nodes[from].cy, nodes[to].cy],
            }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
          />
        </g>
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          <motion.circle
            cx={node.cx} cy={node.cy} r="18"
            fill="none" stroke="url(#nodeGrad)" strokeWidth="1.5"
            filter="url(#nodeGlow)"
            animate={{ r: [18, 20, 18] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
          <circle cx={node.cx} cy={node.cy} r="4" fill="url(#nodeGrad)" opacity="0.8" />
          <text x={node.cx} y={node.cy + 36} textAnchor="middle"
            fill="var(--text-muted)" fontSize="11" fontWeight="700" fontFamily="monospace"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Central key icon */}
      <motion.g
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="250" cy="250" r="30" fill="rgba(79, 70, 229, 0.06)" />
      </motion.g>
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  
  const smoothY = useSpring(scrollY, { damping: 20, stiffness: 80 })
  const textY = useTransform(smoothY, [0, 1000], [0, 200])

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { damping: 30 })

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  return (
    <div className={styles.page}>
      <UnfamiliarHeader />
      <div className="globalMesh" />

      {/* Hero Section */}
      <section className={styles.hero} onMouseMove={onMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }}>
        <div className={styles.heroLayout}>
          
          <motion.div className={styles.textContent} style={{ y: textY }}>
            <div className={styles.titleWrapper}>
              {['O', 'P', 'A', 'Q', 'U', 'E'].map((letter, i) => (
                <motion.span 
                  key={i} 
                  className={styles.animatedLetter}
                  initial={letterAnimations[i].initial}
                  animate={letterAnimations[i].animate}
                  transition={{ duration: 2, ease: "circOut" }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              Air-gapped optical key exchange with forensic attribution. 
              Deliver classified documents through zero-network cryptographic channels.
            </motion.p>

            <motion.div 
              className={styles.actions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
            >
              <GradientButton onClick={() => navigate('/sender/dashboard')}>Enter Dashboard</GradientButton>
            </motion.div>
          </motion.div>

          {/* 3D Key Exchange Visualization */}
          <motion.div 
            className={styles.visualContent}
            style={{ rotateX, rotateY, perspective: 1000 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ease: "easeOut", duration: 1.5 }}
          >
            <KeyExchangeVisual />
          </motion.div>

        </div>
      </section>

      {/* Feature Section */}
      <section className={styles.contentSection}>
        <div className={styles.glassZone}>
          <div className={styles.zoneText}>
            <h2>Optical Air-Gap</h2>
            <p>Exchange cryptographic keys through dynamically regenerating QR codes — completely isolated from network infrastructure.</p>
          </div>
          <div className={styles.zoneText}>
            <h2>Forensic Attribution</h2>
            <p>Every document is embedded with an invisible, mathematically unique watermark via spectral domain encoding. Leaks are traceable.</p>
          </div>
          <div className={styles.zoneText}>
            <h2>Zero-Knowledge Delivery</h2>
            <p>Payloads are encrypted with AES-256-GCM using keys that never touch a server. The backend routes only opaque binary blobs.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
