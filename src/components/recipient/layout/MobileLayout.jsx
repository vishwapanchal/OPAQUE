import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import NavIsland from './NavIsland'
import { MobileToastProvider } from '../ui/MobileToastProvider'
import styles from './MobileLayout.module.css'

export default function MobileLayout() {
  const location = useLocation()

  return (
    <MobileToastProvider>
      <div className={styles.layout}>
        <div className="globalMesh" />
        
        <main className={styles.main}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className={styles.pageWrapper}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <NavIsland />
      </div>
    </MobileToastProvider>
  )
}
