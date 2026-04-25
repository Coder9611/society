import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { PolisProvider } from './store/PolisState.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PolisProvider>
      <App />
    </PolisProvider>
  </React.StrictMode>,
);
