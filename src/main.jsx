import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { lightTheme } from './config/theme'
import App from './App'
import './locales/i18n'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={lightTheme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
) 