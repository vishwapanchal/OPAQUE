import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSession } from '../../../store/SessionContext'
import styles from './SideRail.module.css'

const navNodes = [
  { path: '/sender/dashboard', label: 'Dash' },
  { path: '/sender/session', label: 'Sync' },
  { path: '/sender/document', label: 'Docs' },
  { path: '/sender/forensic', label: 'Lab' }
]

export default function SideRail() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useSession()
  const isActive = state.sessionId !== null

  return (
    <motion.nav 
      className={styles.floatingNav}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
    >
      <div className={styles.navContainer}>
        {/* Brand Orb */}
        <motion.div 
          className={styles.brandOrb}
          animate={{ background: `linear-gradient(135deg, var(--grad-coral), var(--grad-purple))` }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
        />

        {/* Nav Links */}
        <div className={styles.links}>
          {navNodes.map(node => {
            const isCurrentPath = location.pathname === node.path || (node.path !== '/sender/dashboard' && location.pathname.startsWith(node.path));
            return (
              <button 
                key={node.path} 
                className={`${styles.navItem} ${isCurrentPath ? styles.active : ''}`}
                onClick={() => navigate(node.path)}
              >
                {isCurrentPath && <motion.div layoutId="navIndicator" className={styles.activeDot} />}
                <span>{node.label}</span>
              </button>
            )
          })}
        </div>

        {/* Status Bubble */}
        <div className={styles.statusBubble}>
           <motion.div 
             className={styles.statusCore}
             animate={{ scale: isActive ? [1, 1.2, 1] : 1 }}
             transition={{ duration: 2, repeat: Infinity }}
             style={{ background: isActive ? 'var(--grad-cyan)' : 'var(--text-muted)' }}
           />
        </div>
      </div>
    </motion.nav>
  )
}
