import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import '@fontsource/plus-jakarta-sans/200.css'
import '@fontsource/plus-jakarta-sans/300.css'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'

// We will import both CSS files. They share most vars, but mobile.css has specific tweaks.
// Since global.css is loaded first, mobile.css will overwrite variables where they conflict.
import './global.css'
import './mobile.css'

import { router } from './router'

// Sender Providers
import { ToastProvider } from './components/ui/ToastProvider'
import { SessionProvider } from './store/SessionContext'

// Recipient Providers
// Note: MobileToastProvider might conflict if both try to render at root. 
// We will wrap MobileLayout with it instead, or just provide it. Let's provide VaultProvider at root.
import { ScanProvider } from './store/ScanContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScanProvider>
      <SessionProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </SessionProvider>
    </ScanProvider>
  </React.StrictMode>
)