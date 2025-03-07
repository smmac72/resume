import React, { useState, useEffect } from 'react';
import Terminal from './Terminal';
import ContentBox from './ContentBox';
import InfoBoxes from './InfoBox';
import KeyboardComponent from './KeyboardComponent';
import Inventory from './Inventory';
import Achievements from './Achievements';
import translations from '../utils/translations';
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
  
  // maximum tabs enabled at once
  const MAX_TABS = 6;
  
  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setUpdateCounter(prev => prev + 1);
    }, 500);
    
    return () => clearInterval(updateInterval);
  }, []);
  
  const handleRun = (file) => {
    // if tab exists
    const existingIndex = openTabs.findIndex(tab => tab.title === file.title);
    
    if (existingIndex >= 0) {
      setActiveTab(existingIndex + 1);
    } else {
      // otherwise create
      let newTabs = [...openTabs, file];
      
      // delete if tab amount exceeds max
      if (newTabs.length > MAX_TABS) {
        newTabs = newTabs.slice(1);
        setActiveTab(MAX_TABS);
      } else {
        setActiveTab(openTabs.length + 1);
      }
      
      setOpenTabs(newTabs);
    } 
    setUpdateCounter(prev => prev + 1);
  };
  
  const handleTabClose = (index) => {
    const realIndex = index - 1;
    
    const newTabs = [...openTabs];
    newTabs.splice(realIndex, 1);
    setOpenTabs(newTabs);
    
    // activate previous tab
    if (activeTab === index) {
      setActiveTab(Math.max(0, index - 1));
    } else if (activeTab > index) {
      setActiveTab(activeTab - 1);
    }
  };
  
  const handleConnect = (newServer) => {
    setAuthenticatedServer(newServer);
    if (onConnect) {
      onConnect(newServer);
    }
    setCurrentPath('/');
    setActiveTab(0);
    
    setUpdateCounter(prev => prev + 1);
  };
  
  const handleAuthenticate = (authServer) => {
    setAuthenticatedServer(authServer);
    setUpdateCounter(prev => prev + 1);
  };

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
                {translate('inventory')}
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
                {translate('achievements')}
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
