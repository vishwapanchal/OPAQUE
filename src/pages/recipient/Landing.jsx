import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import styles from './Landing.module.css'

const UnfamiliarHeader = () => (
  <header className={styles.unfamiliarHeader}>
    <div className={styles.headerClusterLeft}>
      <span className={styles.headerTitle}>OPAQUE</span>
      <div className={styles.dataBlock}>
        <span className={styles.dataLabel}>NODE</span>
        <span className={styles.dataVal}>RECIPIENT</span>
      </div>
    </div>
    <div className={styles.headerClusterRight}>
      <motion.div 
        className={styles.pulsingDot}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
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

function MobileKeyVisual() {
  return (
    <svg viewBox="0 0 200 200" className={styles.heroSvg}>
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--grad-cyan)" />
          <stop offset="100%" stopColor="var(--grad-blue)" />
        </linearGradient>
      </defs>
      {/* Outer rotating scanner ring */}
      <motion.circle 
        cx="100" cy="100" r="70" 
        fill="none" stroke="rgba(0,198,255,0.2)" strokeWidth="2" strokeDasharray="10 15"
        animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: 'center' }}
      />
      {/* Inner pulsing scanner ring */}
      <motion.circle 
        cx="100" cy="100" r="50" 
        fill="none" stroke="var(--grad-cyan)" strokeWidth="1"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center' }}
      />
      {/* Center Shield/Keyhole */}
      <motion.path 
        d="M100 60 L130 75 L130 110 C130 135 100 155 100 155 C100 155 70 135 70 110 L70 75 Z"
        fill="none" stroke="url(#shieldGrad)" strokeWidth="4" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      <motion.circle cx="100" cy="95" r="8" fill="var(--grad-cyan)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} />
      <motion.path d="M96 100 L96 115 L104 115 L104 100" fill="var(--grad-cyan)" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1 }} style={{ transformOrigin: 'top' }} />
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  
  const smoothY = useSpring(scrollY, { damping: 20, stiffness: 80 })
  const textY = useTransform(smoothY, [0, 1000], [0, 200])

  return (
    <div className={styles.page}>
      <UnfamiliarHeader />
      <div className="globalMesh" />

      {/* Hero Section */}
      <section className={styles.hero}>
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
              Scan. Decode. Access. Establish a local air-gapped cryptosystem to retrieve encrypted payloads directly on your device.
            </motion.p>

            <motion.div 
              className={styles.actions}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
            >
              <GradientButton onClick={() => navigate('/recipient/welcome')}>Initialize Sensor</GradientButton>
            </motion.div>
          </motion.div>

          {/* Mobile Professional Key Graphic */}
          <motion.div 
            className={styles.visualContent}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ease: "easeOut", duration: 1.5 }}
          >
            <MobileKeyVisual />
          </motion.div>

        </div>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <div className={styles.glassZone}>
          <div className={styles.zoneText}>
            <h2>Optical Ingestion</h2>
            <p>Capture high-density data streams via your device camera without enabling WiFi or Cellular radios.</p>
          </div>
          <div className={styles.zoneText}>
            <h2>Local Decryption</h2>
            <p>AES-256 decryption occurs entirely within device memory. Temporary keys are purged upon document closure.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
