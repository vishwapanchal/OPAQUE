import { useEffect, useRef, useState } from 'react'

export function usePullRefresh(onRefresh, threshold = 60) {
  const containerRef = useRef(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleTouchStart = (e) => {
      // Only initiate pull if we are at the very top of the scroll container
      if (el.scrollTop <= 0) {
        startY.current = e.touches[0].clientY
      } else {
        startY.current = 0 // Ignore
      }
    }

    const handleTouchMove = (e) => {
      if (startY.current === 0 || isRefreshing) return
      currentY.current = e.touches[0].clientY
      const delta = currentY.current - startY.current
      
      // If pulling down
      if (delta > 0) {
        // Prevent default browser refresh on iOS/Chrome Android
        e.preventDefault()
        // Add friction/resistance to the pull
        setPullDistance(delta * 0.4)
      }
    }

    const handleTouchEnd = async () => {
      if (startY.current === 0 || isRefreshing) return
      
      if (pullDistance > threshold) {
        setIsRefreshing(true)
        setPullDistance(threshold) // lock at threshold while refreshing
        
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          setPullDistance(0)
        }
      } else {
        // Snap back if threshold not met
        setPullDistance(0)
      }
      
      startY.current = 0
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd)

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onRefresh, threshold, isRefreshing, pullDistance])

  return { containerRef, pullDistance, isRefreshing }
}