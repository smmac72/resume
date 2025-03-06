import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainInterface from './components/MainInterface';
import MobileWarning from './components/MobileWarning';
import ConfirmDialog from './components/ConfirmDialog';
import fileSystem from './utils/fileSystem';
import './styles/global.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isConnected, setIsConnected] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Подключение к серверу по умолчанию
  useEffect(() => {
    const connectToDefaultServer = async () => {
      // Ожидание завершения анимации загрузки
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Подключение к серверу по умолчанию
      const defaultIp = '31.31.196.1';
      const result = fileSystem.connectToServer(defaultIp);
      
      if (result.success) {
        setCurrentServer(result.server);
        setIsConnected(true);
      }
      
      setIsLoading(false);
    };
    
    connectToDefaultServer();
  }, []);

  // Обработка предупреждения при закрытии окна
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Обработка смены языка
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
  };

  // Обработка подключения к серверу
  const handleConnect = (server) => {
    setCurrentServer(server);
    setIsConnected(true);
  };

  // Обработка отключения от сервера
  const handleDisconnect = () => {
    setShowConfirmDialog(true);
    setConfirmAction(() => () => {
      setCurrentServer(null);
      setIsConnected(false);
    });
  };
  
  // Обработка подтверждения действия
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };
  
  // Обработка отмены действия
  const handleCancel = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  // Если устройство мобильное, показываем предупреждение
  if (isMobile) {
    return <MobileWarning language={language} />;
  }

  return (
    <div className="app">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <MainInterface 
            language={language}
            server={currentServer}
            onLanguageChange={handleLanguageChange}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
          />
          {showConfirmDialog && (
            <ConfirmDialog 
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              language={language}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
