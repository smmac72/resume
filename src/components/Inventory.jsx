import React from 'react';
import commandProcessor from '../utils/commandProcessor';
import translations from '../utils/translations';

const Inventory = ({ language, onConnect }) => {
  const knownLogins = commandProcessor.getKnownLogins();
  
  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  const handleInventoryClick = (ip, username, password) => {
    const connectResult = commandProcessor.processCommand(`connect ${ip}`, { onConnect });
    
    if (connectResult.success) {
      // authenticate with stored credentials
      setTimeout(() => {
        commandProcessor.processCommand(`login ${username} ${password}`, { onConnect });
      }, 100); // small delay to ensure the connect finishes
    }
  };

  return (
    <>
      {Object.keys(knownLogins).length === 0 ? (
        <div className="inventory-empty">
          {translate('inventory_empty')}
        </div>
      ) : (
        Object.entries(knownLogins).map(([ip, { username, password, formatted }]) => (
          <div 
            key={ip} 
            className="inventory-item"
            onClick={() => handleInventoryClick(ip, username, password)}
            style={{ cursor: 'pointer' }}
          >
            <div className="inventory-item-header">{formatted}</div>
          </div>
        ))
      )}
    </>
  );
};

export default Inventory;
