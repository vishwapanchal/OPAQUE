import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import QRCode from 'qrcode'
import { useSession } from '../../store/SessionContext'
import { initSession, checkSessionStatus } from '../../api/session'
import { useToast } from '../../components/ui/ToastProvider'
import PathStepper from '../../components/sender/stepper/PathStepper'
import FloatingInput from '../../components/ui/FloatingInput'
import Button from '../../components/ui/Button'
import styles from './NewSession.module.css'

export default function NewSession() {
  const navigate = useNavigate()
  const { state, dispatch } = useSession()
  const { addToast } = useToast()
  const [localName, setLocalName] = useState('')
  const [loading, setLoading] = useState(false)

  const steps = ['Identify Recipient', 'Share Public Key', 'Awaiting Sync', 'Key Established']
  const currentStep = state.step - 1

  const handleInit = async () => {
    if (!localName) return
    setLoading(true)
    try {
      const data = await initSession({ recipientName: localName })
      dispatch({ type: 'INIT_SESSION', payload: data })
      dispatch({ type: 'SET_STEP', payload: 2 })
    } catch (e) {
      addToast({ title: 'Initialization Error', message: e.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let interval
    if (state.step === 2 && state.sessionId) {
      interval = setInterval(async () => {
        try {
          const res = await checkSessionStatus(state.sessionId)
          if (res.status === 'synchronized') {
            dispatch({ type: 'SET_STEP', payload: 4 })
            clearInterval(interval)
          }
        } catch (e) {
          console.error(e)
        }
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [state.step, state.sessionId, dispatch])

  const handleAdvance = () => {
    dispatch({ type: 'SET_STEP', payload: state.step + 1 })
  }

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: 40 }}>
        <Button variant="secondary" onClick={() => navigate('/sender/dashboard')} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>}>
          Back to Dashboard
        </Button>
      </div>
      
      <header className={styles.header}>
        <h1>Key Exchange Protocol</h1>
        <p>Diffie-Hellman handshake via out-of-band optical channel</p>
      </header>

      <PathStepper steps={steps} currentStep={currentStep} />

      <main className={styles.contentArea}>
        <AnimatePresence mode="wait">
          {/* STEP 1: INITIALIZE */}
          {state.step === 1 && (
            <motion.div key="step1" className={styles.stepContainer} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className={styles.card}>
                <FloatingInput label="Recipient Reference ID" value={localName} onChange={setLocalName} />
                <div style={{ marginTop: 40 }}>
                  <Button onClick={handleInit} loading={loading} disabled={!localName}>Initiate Secure Channel</Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SHARE QR — render real QR code */}
          {state.step === 2 && (
            <motion.div key="step2" className={styles.stepContainer} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <div className={styles.card}>
                 <h3>Displaying Public Key</h3>
                 <p className={styles.stepDesc}>Present this QR code to the recipient device for optical key ingestion.</p>
                 
                 <div className={styles.qrContainer}>
                   <QRDisplay data={state.qrData || `opaque-pub-${state.sessionId}`} />
                 </div>

                 <div style={{ marginTop: 40 }}>
                   <Button onClick={handleAdvance}>Key Scanned by Recipient</Button>
                 </div>
               </div>
            </motion.div>
          )}

          {/* STEP 3: SCAN RESPONSE */}
          {state.step === 3 && (
            <motion.div key="step3" className={styles.stepContainer} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
               <div className={styles.card}>
                 <h3>Awaiting Recipient Key</h3>
                 <p className={styles.stepDesc}>Position the sender camera to capture the recipient's response QR code.</p>
                 
                 <div className={styles.scannerUI}>
                    <motion.div className={styles.laser} animate={{y: [0, 300, 0]}} transition={{duration: 2, repeat: Infinity, ease: 'linear'}} />
                    <div className={styles.scannerLabel}>OPTICAL SENSOR ACTIVE</div>
                 </div>

                 <div style={{ marginTop: 20 }}>
                   <Button onClick={handleAdvance} variant="secondary">Simulate Optical Ingestion</Button>
                 </div>
               </div>
            </motion.div>
          )}

          {/* STEP 4: SUCCESS */}
          {state.step === 4 && (
            <motion.div key="step4" className={styles.stepContainer} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
               <div className={styles.successCard}>
                 <div className={styles.successIcon}>
                   <svg viewBox="0 0 24 24" width="64" height="64">
                     <motion.path d="M5 13l4 4L19 7" stroke="var(--accent-secondary)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                       initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
                     />
                     <motion.circle cx="12" cy="12" r="10" stroke="var(--accent-secondary)" strokeWidth="1.5" fill="none"
                       initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                     />
                   </svg>
                 </div>
                 <h2 className={styles.successTitle}>Secure Tunnel Active</h2>
                 <p className={styles.successMeta}>Recipient: {state.recipientName}</p>
                 <div className={styles.sessionTag}>{state.sessionId}</div>
                 
                 <div style={{ marginTop: 40 }}>
                   <Button onClick={() => navigate('/sender/document')}>Proceed to Document Encryption</Button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

/* Real QR code renderer using installed qrcode library */
function QRDisplay({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (canvasRef.current && data) {
      QRCode.toCanvas(canvasRef.current, data, {
        width: 320,
        margin: 3,
        errorCorrectionLevel: 'H',
        color: { dark: '#000000', light: '#FFFFFF' }
      })
    }
  }, [data])

  return (
    <div className={styles.qrFrame}>
      <canvas ref={canvasRef} />
    </div>
  )
}
