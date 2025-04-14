import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Clock from './components/Clock'
import './index.css'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Clock />
    </div>
  </StrictMode>,
)
