import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth.jsx' // <--- Import this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* <--- Wrap App with this */}
      <App />
    </AuthProvider>
  </StrictMode>,
)