import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../components/ui/Button'
import { useSession } from '../../store/SessionContext'
import { getDashboardSummary } from '../../api/session'
import { useToast } from '../../components/ui/ToastProvider'
import MagnifierIllustration from '../../components/sender/forensic/MagnifierIllustration'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { state, dispatch } = useSession()
  const { addToast } = useToast()
  const [sessions, setSessions] = useState([])
  
  useEffect(() => {
    let mounted = true
    getDashboardSummary()
      .then(data => {
        if (mounted && data.recentSessions) {
          setSessions(data.recentSessions)
        }
      })
      .catch(err => {
        if (mounted) addToast({ title: 'Error', message: err.message, type: 'error' })
      })
    return () => { mounted = false }
  }, [addToast])

  return (
    <div className={styles.dashboard}>
      <div style={{ padding: '40px 40px 0 40px', position: 'relative', zIndex: 10 }}>
        <button onClick={() => navigate('/')} style={{ background: 'var(--text-main)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700, boxShadow: 'var(--shadow-float)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          CHANGE ROLE
        </button>
      </div>
      <div className={styles.content}>
        {/* Active Session Ribbon */}
        <motion.div layoutId="sessionRibbon" className={styles.ribbon}>
          {!state.sessionId ? (
            <div className={styles.ribbonEmpty}>
              <span className={styles.ribbonText}>No active session</span>
              <Button 
                onClick={() => navigate('/sender/session')} 
                icon={<LockIcon />}
              >
                Initiate Key Exchange
              </Button>
            </div>
          ) : (
            <div className={styles.ribbonActive}>
              <div className={styles.ribbonDetails}>
                <span className={styles.recipient}>{state.recipientName}</span>
                <span className={styles.sessionId}>{state.sessionId}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button onClick={() => dispatch({ type: 'RESET_SESSION' })} variant="secondary">
                  End Session
                </Button>
                <Button onClick={() => navigate('/sender/document')}>
                  Open Document Uploader
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Layout Grid */}
        <div className={styles.grid}>
          {/* Recent Sessions Stack */}
          <section className={styles.stackSection}>
            <h2 className={styles.sectionTitle}>Recent Deliveries</h2>
            <div className={styles.stackContainer}>
              <AnimatePresence>
                {sessions.map((sess, i) => (
                  <StackedCard key={sess.id} session={sess} index={i} />
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Forensic Lab Shortcut */}
          <section className={styles.forensicSection}>
            <div className={styles.forensicSplit}>
              <div className={styles.forensicText}>
                <h2>Forensic Laboratory</h2>
                <p>Analyze optical watermarks to attribute leaked documents with mathematical certainty.</p>
                <div style={{ marginTop: 'auto', paddingTop: 16 }}>
                  <Button 
                    variant="warm" 
                    onClick={() => navigate('/sender/forensic')}
                    icon={<FingerprintIcon />}
                    className={styles.fullWidthBtn}
                  >
                    Open Forensic Lab
                  </Button>
                </div>
              </div>
              <div className={styles.forensicVisual}>
                <MagnifierIllustration />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function StackedCard({ session, index }) {
  return (
    <motion.div
      className={styles.stackCard}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 20 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardRecipient}>{session.recipient}</span>
        <StatusGlyph status={session.status} />
      </div>
      <div className={styles.cardMeta}>
        <span className={styles.cardId}>{session.id}</span>
        <span className={styles.cardTime}>{session.timestamp}</span>
      </div>
    </motion.div>
  )
}

function StatusGlyph({ status }) {
  if (status === 'complete') {
    return (
      <svg viewBox="0 0 24 24" className={styles.glyphComplete}>
        <motion.path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
      </svg>
    )
  }
  if (status === 'failed') {
    return (
      <motion.svg viewBox="0 0 24 24" className={styles.glyphFailed}
        animate={{ x: [0, -4, 4, -4, 4, 0] }} transition={{ duration: 0.4 }}
      >
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    )
  }
  return (
    <motion.svg viewBox="0 0 24 24" className={styles.glyphPending}
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }}
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </motion.svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M16 11V7a4 4 0 00-8 0v4" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" fill="none" strokeWidth="2" />
    </svg>
  )
}

function FingerprintIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2C8 2 4 5 4 10v4" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M8 8c2-2 6-2 8 0v8" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M12 6v12" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
