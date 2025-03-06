import React, { useState, useEffect } from 'react';
import Terminal from './Terminal';
import ContentBox from './ContentBox';
import InfoBoxes from './InfoBox';
import KeyboardComponent from './KeyboardComponent';
import Inventory from './Inventory';
import Achievements from './Achievements';
import '../styles/MainInterface.css';

const MainInterface = ({ 
  language, 
  server,
  isConnected,
  onConnect,
  onLanguageChange,
  onDisconnect 
}) => {
  const [authenticatedServer, setAuthenticatedServer] = useState(server);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [currentPath, setCurrentPath] = useState('/');
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Эффект обновления интерфейса после каждого действия
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setUpdateCounter(prev => prev + 1);
    }, 500);
    
    return () => clearInterval(updateInterval);
  }, []);
  
  // Обработка выполнения файла (команда run)
  const handleRun = (file) => {
    // Проверка существования вкладки с таким же заголовком
    const existingIndex = openTabs.findIndex(tab => tab.title === file.title);
    
    if (existingIndex >= 0) {
      // Если существует, просто активируем её
      setActiveTab(existingIndex + 1); // +1 потому что home - 0
    } else {
      // Иначе добавляем новую вкладку
      setOpenTabs([...openTabs, file]);
      setActiveTab(openTabs.length + 1); // +1 потому что home - 0
    }
    
    // Обновление интерфейса
    setUpdateCounter(prev => prev + 1);
  };
  
  // Обработка закрытия вкладки
  const handleTabClose = (index) => {
    // Вычисление реального индекса
    const realIndex = index - 1; // -1 потому что home - 0
    
    // Обновление массива вкладок
    const newTabs = [...openTabs];
    newTabs.splice(realIndex, 1);
    setOpenTabs(newTabs);
    
    // Если мы закрыли активную вкладку, активируем предыдущую
    if (activeTab === index) {
      setActiveTab(Math.max(0, index - 1));
    } else if (activeTab > index) {
      // Если мы закрыли вкладку перед активной, корректируем индекс активной вкладки
      setActiveTab(activeTab - 1);
    }
  };
  
  // Обработка подключения к серверу
  const handleConnect = (newServer) => {
    setAuthenticatedServer(newServer);
    if (onConnect) {
      onConnect(newServer);
    }
    setCurrentPath('/');
    setActiveTab(0);
    
    setUpdateCounter(prev => prev + 1);
  };
  
  // Обработка аутентификации сервера
  const handleAuthenticate = (authServer) => {
    setAuthenticatedServer(authServer);
    setUpdateCounter(prev => prev + 1);
  };

  // Обработка изменения пути из терминала
  const handlePathChange = (newPath) => {
    setCurrentPath(newPath);
  };

  return (
    <div className="main-interface">
      <div className="upper-section">
        <div className="content-section">
          <ContentBox 
            language={language}
            server={authenticatedServer}
            tabs={openTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onTabClose={handleTabClose}
            onExecute={handleRun}
            currentPath={currentPath}
            onPathChange={handlePathChange}
          />
        </div>
        <div className="sidebar-section">
          <div className="sidebar-top">
            <div className="inventory">
              <div className="inventory-header">
                {language === 'ru' ? 'Инвентарь' : 'Inventory'}
              </div>
              <div className="inventory-items">
                <Inventory 
                  language={language} 
                  key={`inv-${updateCounter}`} 
                  onConnect={handleConnect} 
                />
              </div>
            </div>
            <div className="achievements">
              <div className="achievements-header">
                {language === 'ru' ? 'Достижения' : 'Achievements'}
              </div>
              <div className="achievements-items">
                <Achievements language={language} key={`ach-${updateCounter}`} />
              </div>
            </div>
          </div>
          <div className="sidebar-bottom">
            <Terminal 
              onConnect={handleConnect}
              onDisconnect={onDisconnect}
              onAuthenticate={handleAuthenticate}
              onRun={handleRun}
              onLanguageChange={onLanguageChange}
              language={language}
              server={authenticatedServer}
              currentPath={currentPath}
              onPathChange={handlePathChange}
            />
          </div>
        </div>
      </div>
      <div className="lower-section">
        <div className="info-panels">
          <InfoBoxes language={language} server={authenticatedServer} />
        </div>
        <div className="keyboard-section">
          <KeyboardComponent />
        </div>
      </div>
    </div>
  );
};

export default MainInterface;