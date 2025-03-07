import React, { useState, useEffect } from 'react';
import translations from '../utils/translations';
import '../styles/InfoBox.css';

// shows time, uptime, system type
const TimeInfoBox = ({ language }) => {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  
  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = () => {
    return time.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  const formatDate = () => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return time.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', options);
  };
  
  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="info-box time-info-box">
      <div className="info-box-time">{formatTime()}</div>
      <div className="info-item">
        <div className="info-item-label">{translate('date').toUpperCase()}</div>
        <div className="info-item-value date-value">{formatDate()}</div>
      </div>
      <div className="info-item">
        <div className="info-item-label">{translate('uptime').toUpperCase()}</div>
        <div className="info-item-value uptime-value">{formatUptime(uptime)}</div>
      </div>
      <div className="info-item">
        <div className="info-item-label">{translate('system').toUpperCase()}</div>
        <div className="info-item-value type-value">AMONG OS</div>
      </div>
    </div>
  );
};

// shows network status, server IP, ping and location
const NetworkInfoBox = ({ language, server }) => {
  const [ping, setPing] = useState(Math.floor(Math.random() * 30) + 10);
  
  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  // update ping every 2-5 seconds
  useEffect(() => {
    const updatePing = () => {
      setPing(Math.floor(Math.random() * 30) + 10);
      setTimeout(updatePing, Math.random() * 3000 + 2000);
    };
    
    const timer = setTimeout(updatePing, Math.random() * 3000 + 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="info-box network-info-box">
      <div className="info-box-title">{translate('netstatus').toUpperCase()}</div>
      <div className="status-container">
        <div className="status-item">
          <div className="status-label">{translate('state').toUpperCase()}</div>
          <div className="status-value online">{translate('online').toUpperCase()}</div>
        </div>
        <div className="status-item">
          <div className="status-label">{translate('owner').toUpperCase()}</div>
          <div className="status-value">zeromac</div>
        </div>
        <div className="status-item">
          <div className="status-label">{translate('ping').toUpperCase()}</div>
          <div className="status-value">{ping} ms</div>
        </div>
      </div>
      <div className="info-item location-item">
        <div className="info-item-label">{translate('coord').toUpperCase()}</div>
        <div className="info-item-value">59.9375° N / 30.3086° E</div>
        <div className="info-item-value">{translate('location').toUpperCase()}</div>
      </div>
      <div className="info-item ipv4-item">
        <div className="info-item-label">IPv4</div>
        <div className="info-item-value">{server ? server.ip : 'N/A'}</div>
      </div>
    </div>
  );
};

// Icontainer for both info boxes and planet gif
const InfoBoxes = ({ language, server }) => {
  return (
    <div className="info-boxes">
      <TimeInfoBox language={language} />
      <NetworkInfoBox language={language} server={server} />
      <div className="planet-gif">
        <img src="/images/planet.gif" alt="Planet" />
      </div>
    </div>
  );
};

export default InfoBoxes;
