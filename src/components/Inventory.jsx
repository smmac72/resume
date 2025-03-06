import React from 'react';
import commandProcessor from '../utils/commandProcessor';

const Inventory = ({ language }) => {
  const knownLogins = commandProcessor.getKnownLogins();
  
  return (
    <>
      {Object.keys(knownLogins).length === 0 ? (
        <div className="inventory-empty">
          {language === 'ru' ? 'Пусто' : 'Empty'}
        </div>
      ) : (
        Object.entries(knownLogins).map(([ip, { formatted }]) => (
          <div key={ip} className="inventory-item">
            <div className="inventory-item-header">{formatted}</div>
          </div>
        ))
      )}
    </>
  );
};

export default Inventory;
