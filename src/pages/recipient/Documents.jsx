import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePullRefresh } from '../../hooks/usePullRefresh'
import { fetchInbox } from '../../api/documents'
import { useToast } from '../../components/ui/ToastProvider'
import PullIndicator from '../../components/recipient/documents/PullIndicator'
import DocumentCard from '../../components/recipient/documents/DocumentCard'
import EmptyInbox from '../../components/recipient/documents/EmptyInbox'
import styles from './Documents.module.css'

export default function Documents() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const loadDocs = useCallback(async () => {
    try {
      const sessionId = sessionStorage.getItem('recipientSessionId') || 'test-session-123'
      const data = await fetchInbox(sessionId)
      const validDocs = Array.isArray(data) ? data : []
      setDocs(validDocs)
      return validDocs
    } catch (e) {
      addToast({ title: 'Inbox Error', message: e.message, type: 'error' })
      setDocs([])
      return []
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    loadDocs()
  }, [loadDocs])

  const handleRefresh = async () => {
    await loadDocs()
  }

  const { containerRef, pullDistance, isRefreshing } = usePullRefresh(handleRefresh, 70)

  const handleDelete = (id) => {
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  return (
    <div className={styles.page} ref={containerRef}>
      <div style={{ padding: '20px 20px 0', position: 'relative', zIndex: 10 }}>
        <button onClick={() => navigate('/recipient/scan')} style={{ background: 'var(--text-main)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700, boxShadow: 'var(--shadow-float)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          BACK TO SCAN
        </button>
      </div>

      <PullIndicator distance={pullDistance} isRefreshing={isRefreshing} />

      <header className={styles.header}>
        <h1>My Documents</h1>
        {!loading && (
          <motion.div layout className={styles.countPill}>
            {docs.length}
          </motion.div>
        )}
      </header>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : docs.length === 0 ? (
        <EmptyInbox />
      ) : (
        <motion.ul 
          className={styles.list}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <AnimatePresence>
            {docs.map(doc => (
              <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  )
}
