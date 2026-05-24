import { useRef, useEffect, useCallback, useState } from 'react'

export function useCamera() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [error, setError] = useState(null)

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) return // Already running

      // Guard: check if mediaDevices API exists at all
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          'Camera API not available. This page must be served over HTTPS or localhost. ' +
          'Current protocol: ' + window.location.protocol + ' | Host: ' + window.location.host
        )
      }

      let stream = null

      // Attempt 1: Try rear camera with ideal facingMode (not exact, so it can fallback)
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        })
      } catch (e1) {
        console.warn('Rear camera failed, trying any camera:', e1.message)
        // Attempt 2: Try any available camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          })
        } catch (e2) {
          console.error('All camera attempts failed:', e2)
          throw e2
        }
      }

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        // Wait for metadata to load before playing (Android Chrome needs this)
        await new Promise((resolve, reject) => {
          const v = videoRef.current
          if (!v) return reject(new Error('Video element lost'))
          v.onloadedmetadata = () => {
            v.play().then(resolve).catch(reject)
          }
          // Timeout safety net
          setTimeout(() => resolve(), 3000)
        })
      }
    } catch (err) {
      console.error('Camera error:', err)
      let msg = err.message || 'Unknown camera error'
      if (err.name === 'NotAllowedError') {
        msg = 'Camera permission denied. Please allow camera access in your browser settings and reload.'
      } else if (err.name === 'NotFoundError') {
        msg = 'No camera found on this device.'
      } else if (err.name === 'NotReadableError') {
        msg = 'Camera is in use by another app. Close other apps using the camera and try again.'
      } else if (err.name === 'OverconstrainedError') {
        msg = 'Camera constraints not supported by this device.'
      }
      setError(msg)
      throw err // Re-throw so the caller knows it failed
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return { videoRef, startCamera, stopCamera, error }
}