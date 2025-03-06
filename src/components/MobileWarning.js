import React from 'react';
import '../styles/MobileWarning.css';

const MobileWarning = ({ language }) => {
  return (
    <div className="mobile-warning">
      <div className="mobile-warning-content">
        <div className="warning-icon">⚠️</div>
        <h2>{language === 'ru' ? 'Устройство не поддерживается' : 'Device Not Supported'}</h2>
        <p>
          {language === 'ru' 
            ? 'Работа с терминалом доступна только с персонального компьютера.'
            : 'Terminal access is only available from a personal computer.'}
        </p>
        <p className="suggestion">
          {language === 'ru' 
            ? 'Пожалуйста, используйте ноутбук или настольный компьютер для доступа к интерактивному резюме.'
            : 'Please use a laptop or desktop computer to access the interactive resume.'}
        </p>
      </div>
    </div>
  );
};

export default MobileWarning;
