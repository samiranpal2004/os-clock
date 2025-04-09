import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Clock from './components/Clock'
import './index.css'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <Clock />
  </StrictMode>,
)
