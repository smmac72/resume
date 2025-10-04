// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import analytics from './utils/analytics';

const YM_COUNTER_ID = Number(100250172 || 0);

const YM_OPTIONS = {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
  defer: true,
  triggerEvent: true
};

const initMetrica = () => {
  analytics.init(YM_COUNTER_ID, YM_OPTIONS);

  analytics.trackEvent('System', 'PageLoad', window.location.href);
};

document.addEventListener('DOMContentLoaded', initMetrica);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
