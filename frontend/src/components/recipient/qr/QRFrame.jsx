import { useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import styles from './QRFrame.module.css'

export default function QRFrame({ data, size = 200 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
    }
  }, [data, size])

  return (
    <div className={styles.wrapper} style={{ width: size + 60, height: size + 60 }}>
      <svg className={styles.svgFrame} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <clipPath id="hex-clip">
            <polygon points="50 0, 100 25, 100 75, 50 100, 0 75, 0 25" />
          </clipPath>
        </defs>
        
        {/* Animated outline */}
        <motion.polygon 
          points="50 2, 98 26, 98 74, 50 98, 2 74, 2 26" 
          fill="none" 
          stroke="var(--accent-primary)" 
          strokeWidth="1.5"
          initial={{ strokeDashoffset: 300, strokeDasharray: 300 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Animated Corners */}
        {[
          { x: 50, y: 2, r: 0 }, { x: 98, y: 26, r: 60 }, { x: 98, y: 74, r: 120 },
          { x: 50, y: 98, r: 180 }, { x: 2, y: 74, r: 240 }, { x: 2, y: 26, r: 300 }
        ].map((pt, i) => (
          <motion.path
            key={i}
            d={`M ${pt.x - 4} ${pt.y} L ${pt.x} ${pt.y} L ${pt.x} ${pt.y + 4}`}
            fill="none" stroke="var(--accent-primary)" strokeWidth="2"
            transform={`rotate(${pt.r} ${pt.x} ${pt.y})`}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
      
      <div className={styles.canvasWrapper} style={{ clipPath: 'url(#hex-clip)' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
