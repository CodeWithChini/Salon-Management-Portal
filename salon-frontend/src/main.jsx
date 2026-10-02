import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3200,
            style: {
              background: '#1A1611',
              color: '#F5F3F0',
              fontSize: '0.875rem',
              borderRadius: '4px',
              padding: '10px 14px',
            },
            success: { iconTheme: { primary: '#AD8A4E', secondary: '#1A1611' } },
            error: { iconTheme: { primary: '#AC5240', secondary: '#1A1611' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
