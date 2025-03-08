import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import analytics from './utils/analytics';

const YANDEX_METRIKA_ID = '100250172';

const initYandexMetrika = () => {
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  
  window.ym(YANDEX_METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    trackHash: true,
    ut: 'noindex',
    defer: true,
    accurateTopicsInference: false,
    disableTopics: true,
    cookieFlags: 'domain=auto;secure;samesite=none'
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initYandexMetrika();
  analytics.init(YANDEX_METRIKA_ID);
  analytics.trackEvent('System', 'PageLoad', window.location.href);
});

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
