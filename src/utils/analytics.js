// for yandex metrika
class Analytics {
  constructor() {
    this.initialized = false;
    this.counterId = null;
    this.debugMode = process.env.NODE_ENV === 'development';
  }
  
  init(counterId) {
  this.counterId = counterId;
  
  try {
    window.ym(counterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
      trackHash: true,
      ut: 'noindex',
      params: {
        UserAgent: navigator.userAgent
      },
      accurateTopicsInference: false, // disable topics api
      disableTopics: true, // a failsafe
      cookieFlags: 'domain=auto;secure;samesite=none',
      defer: true
    });
    
    this.initialized = true;
    
    if (this.debugMode) {
      console.log(`[Analytics] Initialized with counter ID: ${counterId}`);
    }
  } catch (error) {
    console.error('[Analytics] Initialization error:', error);
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
      const eventParams = {
        category,
        action
      };

      if (label !== null) {
        eventParams.label = label;
      }

      if (value !== null) {
        eventParams.value = value;
      }

      window.ym(this.counterId, 'reachGoal', action, eventParams);

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
