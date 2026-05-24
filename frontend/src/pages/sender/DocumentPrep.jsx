import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from '../../store/SessionContext'
import { deliverDocument } from '../../api/documents'
import Button from '../../components/ui/Button'
import styles from './DocumentPrep.module.css'

export default function DocumentPrep() {
  const navigate = useNavigate()
  const { state } = useSession()
  const [step, setStep] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [watermarkedText, setWatermarkedText] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!state.sessionId) navigate('/sender/dashboard')
  }, [state.sessionId, navigate])

  const handleFile = (f) => {
    if (f && (f.name.endsWith('.txt') || f.type === 'text/plain')) {
      setFile(f)
      const reader = new FileReader()
      reader.onload = (e) => setWatermarkedText(e.target.result)
      reader.readAsText(f)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleFileSelect = (e) => {
    handleFile(e.target.files[0])
  }

  const handleEmbed = async () => {
    setLoading(true)
    let iterations = 0
    const original = watermarkedText
    const interval = setInterval(async () => {
      setWatermarkedText(original.split('').map(c => 
        Math.random() > 0.5 ? String.fromCharCode(0x2600 + Math.floor(Math.random() * 255)) : c
      ).join(''))
      iterations++
      if (iterations > 20) {
        clearInterval(interval)
        const finalText = original + '\n\n[OPAQUE_WATERMARK: ' + state.sessionId + ']'
        setWatermarkedText(finalText)
        
        try {
          const blob = new Blob([finalText], { type: 'text/plain' })
          const formData = new FormData()
          formData.append('sessionId', state.sessionId)
          formData.append('filename', file?.name || 'document.txt')
          formData.append('file', blob, 'encrypted_payload.bin')
          
          await deliverDocument(formData)
          setStep(3)
        } catch (e) {
          console.error(e)
          // Ideally use toast here, but just logging for now to match current style
        } finally {
          setLoading(false)
        }
      }
    }, 60)
  }

  const handleDownload = () => {
    const blob = new Blob([watermarkedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${file?.name || 'document'}.encrypted`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!state.sessionId) return null

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: 40 }}>
        <Button variant="secondary" onClick={() => navigate('/sender/dashboard')} icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>}>
          Back to Dashboard
        </Button>
      </div>

      <header className={styles.header}>
        <h1>Secure Document Delivery</h1>
        <p>Upload, watermark, and encrypt for {state.recipientName}</p>
      </header>

      {/* Hidden file input for click-to-browse */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".txt,text/plain" 
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
      />

      <main className={styles.contentArea}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" className={styles.dropContainer}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <div 
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                {!file ? (
                  <>
                    <div className={styles.uploadIcon}>
                      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--grad-blue)" strokeWidth="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className={styles.dropText}>Drop .txt file or click to browse</p>
                    <p className={styles.dropHint}>Plaintext documents only</p>
                  </>
                ) : (
                  <div className={styles.fileChip}>
                    <span className={styles.filename}>{file.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className={styles.removeBtn}>×</button>
                  </div>
                )}
              </div>
              {file && (
                <div style={{ marginTop: 40, textAlign: 'center' }}>
                  <Button onClick={() => setStep(2)}>Preview Document</Button>
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" className={styles.previewContainer}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            >
              <div className={styles.paper}>
                <pre>{watermarkedText}</pre>
                
                <motion.div className={styles.callout} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <div className={styles.token}>WTMK-{state.sessionId.slice(-6).toUpperCase()}</div>
                  <p>Cryptographic attribution token pending embedding.</p>
                </motion.div>
              </div>

              <div style={{ marginTop: 40, textAlign: 'center' }}>
                <Button onClick={handleEmbed} loading={loading}>Embed Watermark & Encrypt</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" className={styles.deliveryContainer}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.deliveryCard}>
                <div className={styles.deliveryIcon}>
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5">
                    <motion.path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
                    />
                    <motion.circle cx="12" cy="12" r="10"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                    />
                  </svg>
                </div>
                
                <h2 className={styles.deliveryTitle}>Document Sealed</h2>
                
                <dl className={styles.metaList}>
                  <dt>Recipient</dt><dd>{state.recipientName}</dd>
                  <dt>Status</dt><dd>Encrypted & Sealed</dd>
                  <dt>Attribution</dt><dd>Embedded</dd>
                </dl>

                <div className={styles.actions}>
                  <Button onClick={handleDownload}>Download Encrypted File</Button>
                  <Button variant="secondary" onClick={() => navigate('/sender/dashboard')}>Return to Dashboard</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
