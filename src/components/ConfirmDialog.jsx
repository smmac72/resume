import React from 'react';
import '../styles/ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel, language }) => {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-icon">⚠️</div>
        <h3 className="confirm-title">
          {language === 'ru' ? 'ПРЕДУПРЕЖДЕНИЕ' : 'WARNING'}
        </h3>
        <p className="confirm-message">
          {message || (language === 'ru' 
            ? "Отсоединение от терминала повлечет за собой потерю всех данных. Продолжить?" 
            : "Terminal disconnection will result in loss of all data. Continue?")}
        </p>
        <div className="confirm-buttons">
          <button className="confirm-btn" onClick={onConfirm}>
            {language === 'ru' ? 'Подтвердить' : 'Confirm'}
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            {language === 'ru' ? 'Отмена' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
