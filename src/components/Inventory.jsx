import React, { useRef, useEffect, useState } from 'react';
import commandProcessor from '../utils/commandProcessor';
import translations from '../utils/translations';
import analytics from '../utils/analytics';
import fileSystem from '../utils/fileSystem';

const Inventory = ({ language, onConnect }) => {
  const [knownLogins, setKnownLogins] = useState(() => 
    commandProcessor.getKnownLogins()
  );
  
  const inventoryClicksTracker = useRef({});
  
  useEffect(() => {
    const updateLogins = () => {
      setKnownLogins(commandProcessor.getKnownLogins());
    };
    
    window.addEventListener('storage', updateLogins);
    return () => {
      window.removeEventListener('storage', updateLogins);
    };
  }, []);
  
  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  const handleInventoryClick = (ip, username, password) => {
    const now = Date.now();
    const lastClicked = inventoryClicksTracker.current[ip] || 0;

    if (now - lastClicked > 5000) {
      analytics.trackEvent('Inventory', 'UseCredentials', `${username}@${ip}`);
      inventoryClicksTracker.current[ip] = now;
    }

    const isCurrent = fileSystem.currentServer === ip;
    const isAuthed = !!fileSystem.authenticatedServers[ip];

    const echo = (msg) => {
      if (!msg) return;
      try {
        window.dispatchEvent(new CustomEvent('terminal:echo', { detail: msg }));
      } catch {}
    };

    if (!isCurrent) {
      // 1) Подключение (без авто-логина)
      const res = commandProcessor.processCommand(`connect ${ip}`, { 
        onConnect: () => {} 
      });
      if (res?.success && res.message) echo(res.message);
      return;
    }

    if (isCurrent && !isAuthed) {
      // 2) Авторизация сохранёнными кредами
      const res = commandProcessor.processCommand(`login ${username} ${password}`, { 
        onAuthenticate: () => {} 
      });
      if (res?.success && res.message) echo(res.message);
      return;
    }

    // 3) Уже авторизованы
    echo(`Already authenticated on ${ip}`);
    analytics.trackEvent('Server', 'AlreadyAuthenticated', ip);
  };

  const clearInventory = () => {
    commandProcessor.clearKnownLogins();
    setKnownLogins({});
  };

  return (
    <>
      {Object.keys(knownLogins).length === 0 ? (
        <div className="inventory-empty">
          {translate('inventory_empty')}
        </div>
      ) : (
        <>
          {Object.entries(knownLogins).map(([ip, { username, password, formatted }]) => (
            <div 
              key={ip} 
              className="inventory-item"
              onMouseDown={() => handleInventoryClick(ip, username, password)}
              style={{ cursor: 'pointer' }}
            >
              <div className="inventory-item-header">{formatted}</div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Inventory;