import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './routers/AppRouter.jsx'

import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { Toaster } from 'sonner'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
          <AppRouter />
          <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
