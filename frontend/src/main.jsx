import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { store } from './store'
import AuthBootstrap from './components/auth/AuthBootstrap'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthBootstrap>
          <App />
        </AuthBootstrap>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
