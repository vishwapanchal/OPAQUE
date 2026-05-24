import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScanState } from '../../../store/ScanContext'
import styles from './NavIsland.module.css'

export default function NavIsland() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isScanning } = useScanState()

  const currentTab = location.pathname.includes('/recipient/documents') ? 'documents' : 'scan'

  return (
    <motion.nav 
      className={styles.island}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
    >
      <div className={styles.navContainer}>
        
        <button 
          className={`${styles.tab} ${currentTab === 'scan' ? styles.active : ''}`} 
          onClick={() => navigate('/recipient/scan')}
        >
          {currentTab === 'scan' && <motion.div layoutId="mobileNavInd" className={styles.activePill} />}
          <span className={styles.tabText}>Optical Sync</span>
        </button>

        <button 
          className={`${styles.tab} ${currentTab === 'documents' ? styles.active : ''}`} 
          onClick={() => navigate('/recipient/documents')}
        >
          {currentTab === 'documents' && <motion.div layoutId="mobileNavInd" className={styles.activePill} />}
          <span className={styles.tabText}>Local Vault</span>
        </button>

      </div>
    </motion.nav>
  )
}
