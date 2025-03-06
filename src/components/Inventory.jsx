import React from 'react';
import commandProcessor from '../utils/commandProcessor';

const Inventory = ({ language, onConnect }) => {
  const knownLogins = commandProcessor.getKnownLogins();
  
  // Function to handle clicking on an inventory item
  const handleInventoryClick = (ip, username, password) => {
    // First connect to the server
    const connectResult = commandProcessor.processCommand(`connect ${ip}`, { onConnect });
    
    if (connectResult.success) {
      // Then authenticate with stored credentials
      setTimeout(() => {
        commandProcessor.processCommand(`login ${username} ${password}`, { onConnect });
      }, 100); // Small delay to ensure connect finishes
    }
  };

  return (
    <>
      {Object.keys(knownLogins).length === 0 ? (
        <div className="inventory-empty">
          {language === 'ru' ? 'Пусто' : 'Empty'}
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