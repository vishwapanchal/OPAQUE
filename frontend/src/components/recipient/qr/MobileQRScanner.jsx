import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCamera } from '../../../hooks/useCamera'
import { useQRDecode } from '../../../hooks/useQRDecode'
import { useScanState } from '../../../store/ScanContext'
import styles from './MobileQRScanner.module.css'

export default function MobileQRScanner({ onDetected }) {
  const { videoRef, startCamera, stopCamera, error } = useCamera()
  const { setIsScanning } = useScanState()
  const [hasDetected, setHasDetected] = useState(false)

  const handleDecode = (data) => {
    if (!hasDetected) {
      setHasDetected(true)
      onDetected(data)
    }
  }

  const { startDecoding, stopDecoding } = useQRDecode(videoRef, handleDecode)

  const [isCameraActive, setIsCameraActive] = useState(false)
  const [startError, setStartError] = useState(null)

  const handleStart = async () => {
    try {
      setStartError(null)
      await startCamera()
      setIsCameraActive(true)
      setIsScanning(true)
      startDecoding()
    } catch (e) {
      console.error('handleStart failed:', e)
      setStartError(e.message || 'Failed to start camera')
    }
  }

  useEffect(() => {
    return () => {
      stopDecoding()
      stopCamera()
      setIsScanning(false)
    }
  }, [stopCamera, stopDecoding, setIsScanning])

  return (
    <div className={styles.scannerWrapper}>
      {/* playsInline is mandatory for iOS Safari */}
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        playsInline
        muted
      />

      <div className={styles.vignetteTop} />
      <div className={styles.vignetteBottom} />

      {!isCameraActive && !error && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, background: 'rgba(0,0,0,0.8)' }}>
           <button onClick={handleStart} style={{ padding: '20px 40px', fontSize: '1.2rem', fontWeight: 'bold', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '100px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(79,70,229,0.4)' }}>
             TAP TO START CAMERA
           </button>
           <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.85rem' }}>Required by mobile browsers for security</p>
           <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.75rem', opacity: 0.6 }}>
             Protocol: {window.location.protocol} | Host: {window.location.host}
           </p>
           {startError && (
             <div style={{ marginTop: 20, padding: '16px 24px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, maxWidth: '80vw', textAlign: 'center' }}>
               <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 6, fontSize: '0.95rem' }}>Camera Error</p>
               <p style={{ color: '#fca5a5', fontSize: '0.8rem', wordBreak: 'break-word' }}>{startError}</p>
             </div>
           )}
        </div>
      )}

      {error ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 40, textAlign: 'center' }}>
          <svg viewBox="0 0 24 24" width="64" height="64" stroke="var(--accent-warm)" strokeWidth="2" fill="none" style={{ marginBottom: 20 }}>
             <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 style={{ color: 'white', marginBottom: 10, fontSize: '1.2rem' }}>Camera Access Denied</h3>
          <p style={{ color: 'var(--text-muted)' }}>{error}</p>
          <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.9rem' }}>You must allow camera permissions or test on localhost/HTTPS to use optical ingestion.</p>
        </div>
      ) : (
        <>
          <div className={styles.statusArea}>
            <AnimatePresence mode="wait">
              {!hasDetected ? (
                <motion.div key="scanning" className={styles.statusText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Point at sender's QR code
                  <span className={styles.dots}>
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                  </span>
                </motion.div>
              ) : (
                <motion.div key="detected" className={styles.statusSuccess} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  QR Detected
                  <svg viewBox="0 0 24 24" className={styles.checkIcon}>
                    <motion.path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={styles.reticleContainer}>
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              {/* Outer Ring */}
              <motion.circle 
                cx="100" cy="100" r="80" 
                stroke="rgba(79,70,229,0.85)" strokeWidth="1.5" fill="none"
                strokeDasharray={hasDetected ? "1 0" : "12 6"}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                style={{ originX: '50%', originY: '50%' }}
              />
              
              {/* Inner Ring */}
              <motion.circle 
                cx="100" cy="100" r="65" 
                stroke="rgba(79,70,229,0.4)" strokeWidth="1" fill="none"
                animate={{ rotate: -360 }}
                transition={{ duration: 12, ease: "linear", repeat: Infinity }}
                style={{ originX: '50%', originY: '50%' }}
              />

              {/* Crosshairs */}
              <motion.g animate={hasDetected ? { x: 0, y: -20, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}>
                <line x1="100" y1="20" x2="100" y2="32" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              </motion.g>
              <motion.g animate={hasDetected ? { x: 0, y: 20, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}>
                <line x1="100" y1="180" x2="100" y2="168" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              </motion.g>
              <motion.g animate={hasDetected ? { x: -20, y: 0, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}>
                <line x1="20" y1="100" x2="32" y2="100" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              </motion.g>
              <motion.g animate={hasDetected ? { x: 20, y: 0, opacity: 0 } : { x: 0, y: 0, opacity: 1 }}>
                <line x1="180" y1="100" x2="168" y2="100" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
              </motion.g>

              {/* Center Dot */}
              <motion.circle 
                cx="100" cy="100" r="3" 
                fill="var(--accent-primary)"
                animate={{ scale: hasDetected ? 0 : [1, 1.8, 1], opacity: hasDetected ? 0 : [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
