class Analytics {
  constructor() {
    this.initialized = false;
    this.counterId = null;
    this.debugMode = process.env.NODE_ENV === 'development';
    this.queue = [];
  }

  log(...args) {
    if (this.debugMode) console.log('[Analytics]', ...args);
  }

  warn(...args) {
    if (this.debugMode) console.warn('[Analytics]', ...args);
  }

  _ym(method, ...args) {
    if (typeof window !== 'undefined' && typeof window.ym === 'function' && this.initialized) {
      try {
        window.ym(this.counterId, method, ...args);
      } catch (e) {
        this.warn('ym call failed', method, args, e);
      }
    } else {
      this.queue.push([method, ...args]);
      this.warn('ym not ready, queued:', method, args);
    }
  }

  init(counterId) {
    this.counterId = counterId;
    this.initialized = true;
    this.log('Yandex Metrica ready with counter', counterId);
  }

  _hit(url, referrer) {
    const params = { referer: referrer || document.referrer || '' };
    this._ym('hit', url, params);
    this.log('hit', url, params);
  }

  trackEvent(category, action, label = null, value = null, extra = {}) {
    if (!this.counterId) return;

    const goal = this._sanitize(`${category}_${action}`)
    const params = {
      label: label ?? undefined,
      value: typeof value === 'number' ? value : undefined,
      ...extra
    };

    this._ym('reachGoal', goal, params);
    this.log('reachGoal', goal, params);
  }

  trackCommand(command, success, args = '') {
    this.trackEvent('Command', command, `${success ? 'Success' : 'Failed'}${args ? ': ' + args : ''}`);
  }

  trackServerConnection(serverIp, serverNameOrState) {
    this.trackEvent('Server', 'Connect', `${serverIp} (${serverNameOrState})`);
  }

  trackAuthentication(serverIp, success) {
    this.trackEvent('Authentication', success ? 'Success' : 'Failed', serverIp);
  }

  trackFileOpen(fileName, fileType, serverIp) {
    this.trackEvent('File', 'Open', `${fileName} (${fileType}) on ${serverIp}`);
  }

  trackAchievement(achievementType, data) {
    this.trackEvent('Achievement', 'Unlock', `${achievementType}: ${data ?? ''}`);
  }

  trackLanguageChange(language) {
    this.trackEvent('Settings', 'LanguageChange', language);
  }

  trackDirectoryChange(path) {
    this.trackEvent('Navigation', 'DirectoryChange', path);
  }

  _sanitize(name) {
    return String(name).replace(/[^\w]+/g, '_').replace(/^_+|_+$/g, '');
  }
}

const analytics = new Analytics();
export default analytics;
