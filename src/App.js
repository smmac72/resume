import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainInterface from './components/MainInterface';
import MobileWarning from './components/MobileWarning';
import ConfirmDialog from './components/ConfirmDialog';
import fileSystem from './utils/fileSystem';
import analytics from './utils/analytics';
import './styles/global.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isConnected, setIsConnected] = useState(false);
  const [currentServer, setCurrentServer] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [interfaceKey, setInterfaceKey] = useState(0);


  useEffect(() => {
    analytics.trackEvent('System', 'AppReady');
  }, []);

  // if mobile -> block access
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;
      setIsMobile(isMobileDevice);
      
      analytics.trackEvent('System', 'DeviceType', isMobileDevice ? 'Mobile' : 'Desktop');
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    const connectToDefaultServer = async () => {
      await new Promise(resolve => setTimeout(resolve, 5000));
      analytics.trackEvent('System', 'LoadingComplete');
      
      const defaultIp = '87.251.78.216';
      const result = fileSystem.connectToServer(defaultIp);
      
      if (result.success) {
        setCurrentServer(result.server);
        setIsConnected(true);
        
        analytics.trackServerConnection(defaultIp, result.server.name);
      }
      
      setIsLoading(false);
    };
    
    connectToDefaultServer();
  }, []);


  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
  };

  const handleConnect = (server) => {
    setCurrentServer(server);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setShowConfirmDialog(true);
    setConfirmAction(() => () => {
      setCurrentServer(null);
      setIsConnected(false);
    });
  };
  
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }

    localStorage.removeItem('knownLogins');
    localStorage.removeItem('achievements');
    window.dispatchEvent(new Event('knownLogins:changed'));

    setInterfaceKey((k) => k + 1);

    setCurrentServer(null);
    setIsConnected(false);

    const defaultIp = '87.251.78.216';
    const result = fileSystem.connectToServer(defaultIp);
    if (result.success) {
      setCurrentServer(result.server);
      setIsConnected(true);
      analytics.trackServerConnection(defaultIp, result.server.name);
    }

    setShowConfirmDialog(false);
    setConfirmAction(null);
  };
  
  const handleCancel = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

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
            key={`mi-${interfaceKey}`}
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