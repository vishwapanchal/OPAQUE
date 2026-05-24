import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import MagnifierIllustration from '../../components/sender/forensic/MagnifierIllustration'
import { analyzeDocument } from '../../api/forensic'
import { useToast } from '../../components/ui/ToastProvider'
import styles from './ForensicLab.module.css'

export default function ForensicLab() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [state, setState] = useState('idle')
  const [logs, setLogs] = useState([])
  const [file, setFile] = useState(null)
  const [resultData, setResultData] = useState(null)
  const fileInputRef = useRef(null)

  const scanSequence = [
    "INITIATING FORENSIC DECODER...",
    "ISOLATING DOCUMENT NOISE PROFILE...",
    "APPLYING FAST FOURIER TRANSFORM (FFT)...",
    "EXTRACTING SPATIAL FREQUENCIES...",
    "DETECTING HIDDEN STEGANOGRAPHIC MARKERS...",
    "WATERMARK FOUND. DECODING PAYLOAD...",
    "MATCHING SESSION DATABASE...",
    "ATTRIBUTION IDENTIFIED."
  ]

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleFileSelect = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0])
  }

  const runAnalysis = async () => {
    if (!file) return
    setState('scanning')
    setLogs([])
    setResultData(null)
    
    // Start backend request in parallel with animation
    const formData = new FormData()
    formData.append('file', file)
    let backendResult = null
    let backendError = null
    
    analyzeDocument(formData).then(res => {
      backendResult = res
    }).catch(err => {
      backendError = err
    })
    
    let i = 0
    const interval = setInterval(() => {
      setLogs(prev => [...prev, scanSequence[i]])
      i++
      if (i >= scanSequence.length) {
        clearInterval(interval)
        setTimeout(() => {
          if (backendError) {
            addToast({ title: 'Analysis Failed', message: backendError.message, type: 'error' })
            setState('idle')
          } else if (backendResult && backendResult.watermarkFound) {
            setResultData(backendResult)
            setState('result')
          } else {
            addToast({ title: 'No Watermark', message: 'No steganographic payload detected.', type: 'warning' })
            setState('idle')
          }
        }, 1000)
      }
    }, 600)
  }

  return (
    <div className={styles.page}>
      <div style={{ marginBottom: 40 }}>
        <button onClick={() => navigate('/sender/dashboard')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '1rem', fontWeight: 800 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          BACK TO DASHBOARD
        </button>
      </div>
      
      <div className={styles.headerArea}>
        <div style={{ width: 160, height: 160, flexShrink: 0 }}>
          <MagnifierIllustration />
        </div>
        <div className={styles.headerText}>
          <h1>Forensic Laboratory</h1>
          <p>Attribution Engine v2.1.0 — Authorized Personnel Only</p>
        </div>
      </div>

      {/* Hidden file input for click-to-browse */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".txt,.pdf,.doc,.docx"
        onChange={handleFileSelect} 
        style={{ display: 'none' }} 
      />

      <div className={styles.workspace}>
        {/* Left Panel: Controls */}
        <div className={styles.controlPanel}>
          <div 
            className={styles.uploadZone}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{file ? file.name : "Drop leaked file here"}</span>
            {!file && <span className={styles.uploadHint}>or click to browse</span>}
          </div>

          <button 
            className={styles.runBtn} 
            onClick={runAnalysis}
            disabled={!file || state === 'scanning'}
            style={{ opacity: !file ? 0.5 : 1 }}
          >
            Execute Analysis
          </button>
        </div>

        {/* Right Panel: Terminal Output */}
        <div className={styles.analysisTerminal}>
          <div className={styles.terminalHeader}>
            <div className={styles.dot} style={{background: 'var(--grad-coral)'}}></div>
            <div className={styles.dot} style={{background: 'var(--grad-orange)'}}></div>
            <div className={styles.dot} style={{background: 'var(--accent-secondary)'}}></div>
            <div className={styles.termTitle}>fft_decoder.exe</div>
          </div>
          
          <div className={styles.terminalBody}>
            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.div key="idle" className={styles.emptyState} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                  NO TARGET LOADED
                </motion.div>
              )}

              {state === 'scanning' && (
                <motion.div key="scan" className={styles.scanContainer} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                  <div className={styles.logWindow}>
                    {logs.map((log, idx) => (
                      <motion.div key={idx} initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}}>
                        {'>'} {log}
                      </motion.div>
                    ))}
                    <motion.div animate={{opacity: [1, 0]}} transition={{repeat: Infinity, duration: 0.5}}>{'_'}</motion.div>
                  </div>
                  <div className={styles.visualizer}>
                    <motion.div 
                      className={styles.scanLine}
                      animate={{ y: [0, 300, 0] }}
                      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    />
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                       {Array.from({length: 50}).map((_, i) => (
                         <motion.rect 
                           key={i} x={i * 2 + "%"} y="50%" width="1%" 
                           fill="rgba(6, 182, 212, 0.4)"
                           animate={{ 
                             height: [10, Math.random() * 80 + 20, 10], 
                             y: [`50%`, `calc(50% - ${Math.random() * 40 + 10}px)`, `50%`] 
                           }}
                           transition={{ duration: 0.2 + Math.random(), repeat: Infinity }}
                         />
                       ))}
                    </svg>
                  </div>
                </motion.div>
              )}

              {state === 'result' && resultData && (
                <motion.div key="result" className={styles.resultContainer} initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}}>
                  <div className={styles.resultData}>
                    <div className={styles.matchLabel}>[ Exact Match Found ]</div>
                    <div className={styles.suspectName}>{resultData?.attribution?.suspectName || 'Unknown'}</div>
                    
                    <dl className={styles.metaGrid}>
                      <div className={styles.metaItem}>
                        <dt>Session ID</dt>
                        <dd>{resultData?.attribution?.sessionId || 'N/A'}</dd>
                      </div>
                      <div className={styles.metaItem}>
                        <dt>Key Exchange Time</dt>
                        <dd>{resultData?.attribution?.timestampExchanged || 'N/A'}</dd>
                      </div>
                      <div className={styles.metaItem}>
                        <dt>Watermark Hash</dt>
                        <dd>{resultData?.attribution?.extractedHash || 'N/A'}</dd>
                      </div>
                      <div className={styles.metaItem}>
                        <dt>Confidence</dt>
                        <dd style={{color: 'var(--accent-secondary)'}}>
                          {resultData?.confidenceScore ? (resultData.confidenceScore * 100).toFixed(3) : 0}%
                        </dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
