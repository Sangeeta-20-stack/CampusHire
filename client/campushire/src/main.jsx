import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css';  // or './index.css'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>   {/* ✅ MUST */}
      <App />
    </AuthProvider>
  </React.StrictMode>
)