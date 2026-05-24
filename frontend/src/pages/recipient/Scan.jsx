import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MobileQRScanner from '../../components/recipient/qr/MobileQRScanner'
import QRFrame from '../../components/recipient/qr/QRFrame'
import ActionSurface from '../../components/recipient/ui/ActionSurface'
import { useHaptic } from '../../hooks/useHaptic'
import styles from './Scan.module.css'

import { syncSession } from '../../api/session'
import { useToast } from '../../components/ui/ToastProvider'

export default function Scan() {
  const navigate = useNavigate()
  const { vibrate } = useHaptic()
  const { addToast } = useToast()
  const [step, setStep] = useState('scan')
  const [qrData, setQrData] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  const handleDetected = (data) => {
    vibrate(150)
    setTimeout(() => {
      setQrData(data)
      setStep('show')
    }, 600)
  }

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      let sessionId = qrData.includes('://') ? qrData.split('://')[1].split('/')[0] : qrData
      if (!sessionId || sessionId === 'manual-entry') sessionId = 'test-session-123'
      
      await syncSession(sessionId, { recipientPublicKey: 'rec_mock_pub_key_123', deviceInfo: 'Mobile Node' })
      sessionStorage.setItem('recipientSessionId', sessionId)
      vibrate([100, 50, 100])
      navigate('/recipient/documents')
    } catch (e) {
      addToast({ title: 'Sync Failed', message: e.message, type: 'error' })
      setIsConfirming(false)
    }
  }

  return createPortal(
    <div className={styles.page}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600, padding: '8px 16px', borderRadius: 8 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          BACK
        </button>
      </div>
      <AnimatePresence mode="wait">
        {step === 'scan' && (
          <motion.div key="scan" className={styles.fullScreen} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MobileQRScanner onDetected={handleDetected} />
            
            <button className={styles.manualBtn} onClick={() => handleDetected('manual-entry')}>MANUAL OVERRIDE</button>
          </motion.div>
        )}

        {step === 'show' && (
          <motion.div key="show" className={styles.showContainer} initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h2 className={styles.heading}>TRANSMITTING KEY</h2>
            
            <motion.div className={styles.qrWrap} initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <QRFrame data={qrData || 'recipient-pubkey'} size={240} />
            </motion.div>
            
            <p style={{fontFamily: 'monospace', color: 'var(--text-main)', marginBottom: 40}}>ALIGN VIEWPORT WITH SENDER LENS</p>

            <div className={styles.actionWrap}>
              <ActionSurface variant="primary" onClick={handleConfirm}>
                {isConfirming ? "SYNCING..." : "AUTHORIZE SYNC"}
              </ActionSurface>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  )
}
