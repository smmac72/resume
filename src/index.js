import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import analytics from './utils/analytics';

const YANDEX_METRIKA_ID = '100250172';

const loadYandexMetrika = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://mc.yandex.ru/metrika/tag.js`;
  
  script.onerror = () => {
    console.error('Failed to load Yandex Metrika script');
  };
  
  script.onload = () => {
    analytics.init(YANDEX_METRIKA_ID);
    analytics.trackEvent('System', 'PageLoad', window.location.href);
  };
  document.head.appendChild(script);
};
loadYandexMetrika();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);