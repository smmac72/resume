// for Google Analytics
class Analytics {
  constructor() {
    this.initialized = false;
    this.measurementId = null;
    this.debugMode = process.env.NODE_ENV === 'development';
  }
  
  init(measurementId) {
    this.measurementId = measurementId;
    this.initialized = true;
    
    if (this.debugMode) {
      console.log(`[Analytics] Initialized with GA4 Measurement ID: ${measurementId}`);
    }
  }

  trackEvent(category, action, label = null, value = null) {
    if (!this.initialized) {
      if (this.debugMode) {
        console.warn('[Analytics] Not initialized. Call init() first.');
      }
      return;
    }

    try {
      if (!window.gtag) {
        if (this.debugMode) {
          console.warn('[Analytics] Google Analytics not available');
        }
        return;
      }
      
      const eventParams = {
        event_category: category,
        event_action: action
      };

      if (label !== null) {
        eventParams.event_label = label;
      }

      if (value !== null && !isNaN(value)) {
        eventParams.value = value;
      }

      window.gtag('event', action, eventParams);

      if (this.debugMode) {
        console.log(`[Analytics] Event tracked: ${category} / ${action} / ${label} / ${value}`);
      }
    } catch (error) {
      if (this.debugMode) {
        console.error('[Analytics] Error tracking event:', error);
      }
    }
  }

  trackCommand(command, success, args = '') {
    this.trackEvent(
      'Command', 
      command, 
      `${success ? 'Success' : 'Failed'}${args ? ': ' + args : ''}`
    );
  }

  trackServerConnection(serverIp, serverName) {
    this.trackEvent('Server', 'Connect', `${serverIp} (${serverName})`);
  }

  trackAuthentication(serverIp, success) {
    this.trackEvent('Authentication', success ? 'Success' : 'Failed', serverIp);
  }

  trackFileOpen(fileName, fileType, serverIp) {
    this.trackEvent('File', 'Open', `${fileName} (${fileType}) on ${serverIp}`);
  }

  trackAchievement(achievementType, data) {
    this.trackEvent('Achievement', 'Unlock', `${achievementType}: ${data}`);
  }

  trackLanguageChange(language) {
    this.trackEvent('Settings', 'LanguageChange', language);
  }

  trackDirectoryChange(path) {
    this.trackEvent('Navigation', 'DirectoryChange', path);
  }
}

const analytics = new Analytics();
export default analytics;
