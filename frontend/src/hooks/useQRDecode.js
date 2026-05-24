import { useEffect, useRef, useCallback } from 'react'
import jsQR from 'jsqr'

export function useQRDecode(videoRef, onDecode) {
  const canvasRef = useRef(document.createElement('canvas'))
  const requestRef = useRef(null)
  const lastFrameTime = useRef(0)
  const isRunning = useRef(false)

  const scanFrame = useCallback(() => {
    if (!isRunning.current) return
    
    // Throttle to ~30fps to save mobile battery
    const now = Date.now()
    if (now - lastFrameTime.current < 33) {
      requestRef.current = requestAnimationFrame(scanFrame)
      return
    }
    lastFrameTime.current = now

    const video = videoRef.current
    if (video && video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
      try {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d', { willReadFrequently: true })
        
        // Scale down huge 1080p frames so jsQR doesn't freeze the mobile browser
        const maxDim = 600
        let w = video.videoWidth
        let h = video.videoHeight
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h)
          w = Math.floor(w * ratio)
          h = Math.floor(h * ratio)
        }

        canvas.width = w
        canvas.height = h
        
        context.drawImage(video, 0, 0, w, h)
        
        const imageData = context.getImageData(0, 0, w, h)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        })

        if (code && code.data) {
          onDecode(code.data)
        }
      } catch (err) {
        console.warn('QR Decode frame error (ignoring):', err)
      }
    }
    requestRef.current = requestAnimationFrame(scanFrame)
  }, [videoRef, onDecode])

  const startDecoding = useCallback(() => {
    if (!isRunning.current) {
      isRunning.current = true
      requestRef.current = requestAnimationFrame(scanFrame)
    }
  }, [scanFrame])

  const stopDecoding = useCallback(() => {
    isRunning.current = false
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }
  }, [])

  useEffect(() => {
    // Visibility API: pause scanning when app is backgrounded
    const handleVisibilityChange = () => {
      if (document.hidden) stopDecoding()
      else startDecoding()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stopDecoding()
    }
  }, [startDecoding, stopDecoding])

  return { startDecoding, stopDecoding }
}