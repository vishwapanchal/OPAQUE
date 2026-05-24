import { createContext, useContext, useReducer, useEffect } from 'react'

const SessionContext = createContext()

const initialState = {
  sessionId: null,
  recipientName: '',
  step: 1
}

function sessionReducer(state, action) {
  switch (action.type) {
    case 'INIT_SESSION':
      return { ...state, ...action.payload, step: 2 }
    case 'SET_STEP':
      return { ...state, step: action.payload }
    case 'CLEAR_SESSION':
      return initialState
    default:
      return state
  }
}

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState, (initial) => {
    const persisted = sessionStorage.getItem('opaque_session')
    return persisted ? JSON.parse(persisted) : initial
  })

  useEffect(() => {
    sessionStorage.setItem('opaque_session', JSON.stringify(state))
  }, [state])

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)