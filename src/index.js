import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import analytics from './utils/analytics';

const YANDEX_METRIKA_ID = '100250172';

// Initialize Yandex Metrika script and counter
const initYandexMetrika = () => {
  // Define the ym function if it doesn't exist
  window.ym = window.ym || function() {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = 1 * new Date();
  
  // Create and append the script
  const script = document.createElement("script");
  script.async = 1;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  
  // Initialize with Topics API disabled
  window.ym(YANDEX_METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    trackHash: true,
    ut: 'noindex',
    defer: true,
    // Privacy settings to fix Topics API issues
    accurateTopicsInference: false,
    disableTopics: true,
    cookieFlags: 'domain=auto;secure;samesite=none'
  });
  
  // Initialize our analytics wrapper - just passing the ID without re-initializing Yandex
  analytics.init(YANDEX_METRIKA_ID, false);
  
  // Track initial page load
  analytics.trackEvent('System', 'PageLoad', window.location.href);
};

// Initialize everything once DOM is loaded
document.addEventListener('DOMContentLoaded', initYandexMetrika);

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
