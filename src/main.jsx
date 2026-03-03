import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/Store.js'
import "./i18n"
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <HelmetProvider>
    <Provider store={store}>
      <App />

    </Provider>
    </HelmetProvider>
  </StrictMode>
)
