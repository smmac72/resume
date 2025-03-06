import React, { useState, useEffect } from 'react';
import fileSystem from '../utils/fileSystem';
import '../styles/InfoBox.css';

// TimeInfoBox component - shows time, uptime, system type
const TimeInfoBox = ({ language }) => {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setUptime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time
  const formatTime = () => {
    return time.toLocaleTimeString(language === 'ru' ? 'ru-RU' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  
  // Format date
  const formatDate = () => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return time.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', options);
  };
  
  // Format uptime
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
        <div className="info-item-label">DATE</div>
        <div className="info-item-value date-value">{formatDate()}</div>
      </div>
      <div className="info-item">
        <div className="info-item-label">UPTIME</div>
        <div className="info-item-value uptime-value">{formatUptime(uptime)}</div>
      </div>
      <div className="info-item">
        <div className="info-item-label">TYPE</div>
        <div className="info-item-value type-value">AMONG OS</div>
      </div>
    </div>
  );
};

// NetworkInfoBox component - shows network status, server IP, ping and location
const NetworkInfoBox = ({ language, server }) => {
  const [ping, setPing] = useState(Math.floor(Math.random() * 30) + 10);
  
  // Update ping every 2-5 seconds
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
      <div className="info-box-title">NETWORK STATUS</div>
      <div className="status-container">
        <div className="status-item">
          <div className="status-label">STATE</div>
          <div className="status-value online">{language === 'ru' ? 'ОНЛАЙН' : 'ONLINE'}</div>
        </div>
        <div className="status-item">
          <div className="status-label">OWNER</div>
          <div className="status-value">zeromac</div>
        </div>
        <div className="status-item">
          <div className="status-label">PING</div>
          <div className="status-value">{ping} ms</div>
        </div>
      </div>
      <div className="info-item location-item">
        <div className="info-item-label">LATITUDE/LONGITUDE</div>
        <div className="info-item-value">59.9375° N / 30.3086° E</div>
        <div className="info-item-value">SAINT PETERSBURG, RUSSIA</div>
      </div>
      <div className="info-item ipv4-item">
        <div className="info-item-label">IPv4</div>
        <div className="info-item-value">{server ? server.ip : 'N/A'}</div>
      </div>
    </div>
  );
};

// InfoBoxes component - container for both info boxes and planet gif
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
