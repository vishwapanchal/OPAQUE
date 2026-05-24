const BASE = import.meta.env.VITE_API_BASE ?? '/api'

export class APIError extends Error {
  constructor(message, status) { 
    super(message)
    this.status = status 
  }
}

export async function apiFetch(path, options = {}) {
  console.log(`[MOCK API] ${options.method || 'GET'} ${path}`, options.body ? JSON.parse(options.body) : '')
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500))

  if (path.includes('/session/init')) {
    const body = JSON.parse(options.body)
    const mockSessionId = 'sq_' + Math.random().toString(36).substr(2, 6)
    return {
      sessionId: mockSessionId,
      recipientName: body.recipientName,
      qrData: `opaque-exchange://${mockSessionId}/mock_sender_pub_key_base64`
    }
  }

  if (path.includes('/sync')) {
    return { success: true, status: 'synchronized' }
  }

  if (path.includes('/status')) {
    // For testing, auto-sync after a few seconds? No, we will let the recipient sync it manually.
    // We just return 'pending' by default. If the user hits "Simulate Sync" or scans with phone, it triggers /sync.
    // For now, check if sessionStorage has a mocked sync flag.
    const isSynced = sessionStorage.getItem(`mock_sync_${path.split('/')[2]}`)
    if (isSynced) {
      return { status: 'synchronized', recipientPublicKey: 'mock_recipient_key' }
    }
    return { status: 'pending' }
  }

  if (path.includes('/dashboard/summary')) {
    return {
      activeChannels: 1,
      payloadsDelivered: 0,
      recentSessions: [],
      systemAlerts: []
    }
  }

  throw new APIError('Not Found in Mock', 404)
}