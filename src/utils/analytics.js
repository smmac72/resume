/**
 * Инициализация Яндекс Метрики
 * @param {string} counterId ID счетчика Яндекс Метрики
 * @param {boolean} initCounter Whether to initialize the counter (default: true)
 */
init(counterId, initCounter = true) {
  this.counterId = counterId;
  
  // Only initialize if requested
  if (initCounter) {
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
        // Privacy settings
        accurateTopicsInference: false,
        disableTopics: true,
        cookieFlags: 'domain=auto;secure;samesite=none',
        defer: true
      });
    } catch (error) {
      console.error('[Analytics] Initialization error:', error);
      return;
    }
  }
  
  this.initialized = true;
  
  if (this.debugMode) {
    console.log(`[Analytics] Initialized with counter ID: ${counterId}`);
  }
}
