import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import analytics from './utils/analytics';

const YANDEX_METRIKA_ID = '100250172'; // should i be afraid

const loadYandexMetrika = () => {
  const script = document.createElement('script');
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.setAttribute('data-cookies-policy', 'crosssite');
  document.head.appendChild(script);
};
window.ym(YANDEX_METRIKA_ID, "init", {
  clickmap: true,
  trackLinks: true,
  accurateTrackBounce: true,
  webvisor: true,
  ecommerce: "dataLayer",
  defer: true,
  cookieFlags: "crossDomain" 
});

loadYandexMetrika();
analytics.init(YANDEX_METRIKA_ID);
analytics.trackEvent('System', 'PageLoad', window.location.href);

const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);