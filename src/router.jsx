import { createBrowserRouter } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection'

// Sender Imports
import RootLayout from './components/sender/layout/RootLayout'
import Dashboard from './pages/sender/Dashboard'
import NewSession from './pages/sender/NewSession'
import DocumentPrep from './pages/sender/DocumentPrep'
import ForensicLab from './pages/sender/ForensicLab'
import SenderLanding from './pages/sender/Landing'

// Recipient Imports
import MobileLayout from './components/recipient/layout/MobileLayout'
import Welcome from './pages/recipient/Welcome'
import Scan from './pages/recipient/Scan'
import Documents from './pages/recipient/Documents'
import DocumentView from './pages/recipient/DocumentView'
import RecipientLanding from './pages/recipient/Landing'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RoleSelection />
  },
  {
    path: '/sender',
    children: [
      { index: true, element: <SenderLanding /> },
      {
        element: <RootLayout />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'session', element: <NewSession /> },
          { path: 'document', element: <DocumentPrep /> },
          { path: 'forensic', element: <ForensicLab /> },
        ]
      }
    ]
  },
  {
    path: '/recipient',
    children: [
      { index: true, element: <RecipientLanding /> },
      {
        element: <MobileLayout />,
        children: [
          { path: 'welcome', element: <Welcome /> },
          { path: 'scan', element: <Scan /> },
          { path: 'documents', element: <Documents /> },
          { path: 'documents/:id', element: <DocumentView /> }
        ]
      }
    ]
  }
], { basename: '/' })