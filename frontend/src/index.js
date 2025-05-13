import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Toaster position="top-right" toastOptions={{
      duration: 3000,
      style: {
        background: '#1e1e2e',
        color: '#fff',
        border: '1px solid #6c6c9c',
      },
      success: {
        iconTheme: {
          primary: '#a3e635',
          secondary: '#1e1e2e',
        },
      },
      error: {
        iconTheme: {
          primary: '#f43f5e',
          secondary: '#1e1e2e',
        },
      },
    }} />
  </React.StrictMode>
); 