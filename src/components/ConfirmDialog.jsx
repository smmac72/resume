import React, { useState } from 'react';
import '../styles/ConfirmDialog.css';

const ConfirmDialog = ({ message, onConfirm, onCancel, language }) => {
  const [agree, setAgree] = useState(false);

  const title = language === 'ru' ? 'ПРЕДУПРЕЖДЕНИЕ' : 'WARNING';
  const defaultMsg =
    language === 'ru'
      ? 'Отсоединение от терминала повлечет за собой потерю всех данных. Продолжить?'
      : 'Terminal disconnection will result in loss of all data. Continue?';

  const checkboxLabel =
    language === 'ru'
      ? 'Да, я понимаю и хочу отключиться'
      : 'Yes, I understand and want to disconnect';

  const confirmText = language === 'ru' ? 'Подтвердить' : 'Confirm';
  const cancelText = language === 'ru' ? 'Отмена' : 'Cancel';

  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <div className="confirm-icon">⚠️</div>
        <h3 className="confirm-title">{title}</h3>

        <p className="confirm-message">{message || defaultMsg}</p>

        <label className="confirm-checkbox-row">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>{checkboxLabel}</span>
        </label>

        <div className="confirm-buttons">
          <button
            className="confirm-btn"
            onClick={onConfirm}
            disabled={!agree}
            aria-disabled={!agree}
            title={!agree ? (language === 'ru' ? 'Отметьте чекбокс' : 'Check the box first') : undefined}
          >
            {confirmText}
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
