import { useCallback } from 'react'

export function useHaptic() {
  const vibrate = useCallback((pattern) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern)
      } catch (e) {
        // Ignored. Not supported on all devices/browsers (like iOS Safari)
      }
    }
  }, [])

  return { vibrate }
}