import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import analytics from './utils/analytics';

const YANDEX_METRIKA_ID = '100250172'; // should i be afraid
analytics.init(YANDEX_METRIKA_ID);
analytics.trackEvent('System', 'PageLoad', window.location.href);

const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);