import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import analytics from './utils/analytics';

const YANDEX_METRIKA_ID = '100250172';

const initYandexMetrika = () => {
  window.ym = window.ym || function() {
    (window.ym.a = window.ym.a || []).push(arguments);
  };
  window.ym.l = 1 * new Date();
  
  const script = document.createElement("script");
  script.async = 1;
  script.src = "https://mc.yandex.ru/metrika/tag.js";
  
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode.insertBefore(script, firstScript);
  
  window.ym(YANDEX_METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    ecommerce: "dataLayer",
    defer: true,
    crossDomain: true
  });
};

initYandexMetrika();
analytics.init(YANDEX_METRIKA_ID);
analytics.trackEvent('System', 'PageLoad', window.location.href);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
