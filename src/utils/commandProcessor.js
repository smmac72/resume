import fileSystem from './fileSystem';
import translations from './translations';
import analytics from './analytics';

class CommandProcessor {
  constructor() {
    this.commandHistory = [];
    this.historyIndex = -1;
    this.musicPlayer = null;
    this.musicPlaying = false;
    this.knownLogins = this.getKnownLogins();
    this.achievements = [];
    this.achievementsUnlocked = false;
    this.availableAchievements = [
      'any_file',
      'logins_found',
      'secret_server_access',
      'timeline_opened',
      'image_opened',
      'link_opened',
      'language_changed',
      'music_played'
    ];
    
    this.commandHints = {
      connect: 'connect_usage',
      login: 'login_usage',
      run: 'run_usage',
      cat: 'cat_usage',
      lang: 'lang_usage'
    };
    
    this.currentLanguage = 'en';
  }

  processCommand(command, callbacks) {
    if (!command) return { success: false, message: '' };

    // add command to history
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;

    // split command - name, args
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // analytics track
    analytics.trackCommand(cmd, true, args.join(' '));

    // if connected to non-authenticated server
    const currentServer = fileSystem.currentServer;
    const isProtectedServer = currentServer && 
                             fileSystem.root.servers[currentServer]?.protected;
    const isAuthenticated = currentServer && 
                           fileSystem.authenticatedServers[currentServer];
    
    const alwaysAvailableCommands = ['connect', 'disconnect', 'lang', 'playmusic', 'help', 'login'];
    
    // restrict commands for non-authenticated servers
    if (isProtectedServer && !isAuthenticated && !alwaysAvailableCommands.includes(cmd)) {
      return {
        success: false,
        message: this.translate('auth_required'),
      };
    }

    let result;
    switch (cmd) {
      case 'connect':
        result = this.handleConnect(args, callbacks);
        break;
      case 'disconnect':
        result = this.handleDisconnect(callbacks);
        break;
      case 'login':
        result = this.handleLogin(args, callbacks);
        break;
      case 'ls':
        result = this.handleLs();
        break;
      case 'cd':
        result = this.handleCd(args);
        break;
      case 'cat':
        result = this.handleCat(args, callbacks);
        break;
      case 'run':
        result = this.handleRun(args, callbacks);
        break;
      case 'scan':
        result = this.handleScan();
        break;
      case 'lang':
        result = this.handleLang(args, callbacks);
        break;
      case 'playmusic':
        result = this.handlePlayMusic(args);
        break;
      case 'help':
        result = this.handleHelp();
        break;
      default:
        result = {
          success: false,
          message: this.translate('command_not_found') + ': ' + cmd,
        };
    }

    if (this.commandHints[cmd] && !result.success && !result.hint) {
      result.hint = this.translate(this.commandHints[cmd]);
    }

    return result;
  }

  handleConnect(args, callbacks) {
    if (args.length < 1) {
      return {
        success: false,
        message: this.translate('invalid_args'),
        hint: this.translate(this.commandHints.connect)
      };
    }

    const ip = args[0];
    const result = fileSystem.connectToServer(ip);

    if (result.success) {
      const alreadyAuthed = !!fileSystem.authenticatedServers[ip];
      const meta = fileSystem.root.servers?.[ip];

      if (callbacks.onConnect) {
        callbacks.onConnect(result.server);
      }

      let msg = `${this.translate('connect')} ${ip}`;

      if (meta?.protected && !alreadyAuthed) {
        msg += `\n${this.translate('auth_required')}`;
      }

      if (alreadyAuthed) {
        analytics.trackEvent('Server', 'AlreadyAuthenticated', ip);
      } else {
        analytics.trackServerConnection(ip, result.server?.name || 'Unknown');
      }

      return {
        success: true,
        message: msg
      };
    }

    analytics.trackServerConnection(ip, 'Failed');
    return result;
  }


  handleDisconnect(callbacks) {
    const result = fileSystem.disconnect();
    
    if (result.success && callbacks.onDisconnect) {
      callbacks.onDisconnect();
    }

    return {
      success: true,
      message: this.translate('disconnect'),
    };
  }

  handleLogin(args, callbacks) {
    if (args.length < 2) {
      return {
        success: false,
        message: this.translate('invalid_args'),
        hint: this.translate(this.commandHints.login)
      };
    }

    // check if already authenticated
    if (fileSystem.authenticatedServers[fileSystem.currentServer]) {
      return {
        success: false,
        message: this.translate('already_authenticated'),
      };
    }

    const username = args[0];
    const password = args[1];
    
    const result = fileSystem.authenticate(username, password);
    
    if (result.success) {
      this.knownLogins[fileSystem.currentServer] = { 
        username, 
        password,
        formatted: `${username}:${password}@${fileSystem.currentServer}`
      };
      
      if (callbacks.onAuthenticate) {
        callbacks.onAuthenticate(result.server);
      }
      
      // analytics track
      analytics.trackAuthentication(fileSystem.currentServer, true);
      
      if (fileSystem.currentServer === '31.31.201.69') {
        this.unlockAchievement('secret_server_access', fileSystem.currentServer);
      }
      return {
        success: true,
        message: this.translate('auth_success'),
      };
    }
    
    // analytics track
    analytics.trackAuthentication(fileSystem.currentServer, false);
    
    return {
      success: false,
      message: this.translate('auth_fail'),
    };
  }

  handleLs() {
    const result = fileSystem.getCurrentDirectoryContent();
    
    if (result.success) {
      const { directories, files } = result.content;
      
      let output = '';
      
      if (directories.length > 0) {
        output += directories.map(dir => `<span class="directory">${dir}/</span>`).join('  ') + '\n';
      }
      
      if (files.length > 0) {
        output += files.map(file => `<span class="file">${file}</span>`).join('  ');
      }
      
      return {
        success: true,
        message: output || this.translate('empty_directory'),
        html: true,
      };
    }

    return result;
  }

  handleCd(args) {
    if (args.length < 1) {
      return {
        success: false,
        message: this.translate('invalid_args'),
      };
    }

    const path = args[0];
    const result = fileSystem.changeDirectory(path);
    
    if (result.success) {
      // analytics track
      analytics.trackDirectoryChange(fileSystem.currentPath);
      
      return {
        success: true,
        message: '',
      };
    }

    return result;
  }

  handleCat(args, callbacks) {
    if (args.length < 1) {
      return {
        success: false,
        message: this.translate('invalid_args'),
        hint: this.translate(this.commandHints.cat)
      };
    }

    const filePath = args[0];
    const result = fileSystem.getFileContent(filePath);
    
    if (result.success) {
      if (result.type === 'text') {
        // analytics track
        analytics.trackFileOpen(filePath, 'text', fileSystem.currentServer);
        
        const content = result.content.replace(/\\n/g, '\r\n');
        this.processLoginInfo(content);
        
        return {
          success: true,
          message: content,
        };
      } else {
        return {
          success: false,
          message: `${this.translate('not_a_file')}: ${filePath}`,
        };
      }
    }

    return result;
  }

  handleRun(args, callbacks) {
    if (args.length < 1) {
      return {
        success: false,
        message: this.translate('invalid_args'),
        hint: this.translate(this.commandHints.run)
      };
    }

    const openSafe = (url) => {
      try {
        if (!/^https?:\/\//i.test(url)) return;
        const w = window.open(url, '_blank', 'noopener,noreferrer');
        if (w) w.opener = null;
      } catch {}
    };

    const filePath = args[0];
    const result = fileSystem.getFileContent(filePath);

    if (!result.success) return result;

    this.unlockAchievement('any_file', filePath);
    analytics.trackFileOpen(filePath, result.type, fileSystem.currentServer);

    if (result.type === 'url') {
      openSafe(result.content.trim());
      this.unlockAchievement('link_opened', filePath);
      return { success: true, message: `Opening link: ${result.content}` };
    }

    if (result.type === 'text') {
      const trimmed = result.content.trim();
      if (/^https?:\/\//i.test(trimmed)) {
        openSafe(trimmed);
        this.unlockAchievement('link_opened', filePath);
        return { success: true, message: `Opening link: ${trimmed}` };
      }
    }

    if (callbacks.onRun) {
      callbacks.onRun({
        title: filePath,
        content: result.content,
        type: result.type,
      });
    }

    if (result.type === 'image') this.unlockAchievement('image_opened', filePath);
    else if (result.type === 'timeline') this.unlockAchievement('timeline_opened', filePath);

    if (result.type === 'text') {
      const content = result.content.replace(/\\n/g, '\r\n');
      this.processLoginInfo(content);
      return {
        success: true,
        message: `${this.translate('running')}: ${filePath}\n\n${content}`,
      };
    }

    return { success: true, message: `${this.translate('running')}: ${filePath}` };
  }

  handleScan() {
    const discoveredServers = [];
    
    if (fileSystem.currentServer === '31.31.201.1') {
      discoveredServers.push('31.31.201.2', '31.31.201.3', '31.31.201.4');
    }
    else if (fileSystem.currentServer === '31.31.201.4') {
      discoveredServers.push('31.31.201.10');
    }
    else if (fileSystem.currentServer === '31.31.201.10') {
      discoveredServers.push('31.31.201.24');
    }
    else if (fileSystem.currentServer === '31.31.201.24') {
      discoveredServers.push('31.31.201.69');
    }
    
    let output = this.translate('network_scan_complete') + '\n\n' + this.translate('available_servers') + ':\n';
    output += `${fileSystem.currentServer} - ${fileSystem.root.servers[fileSystem.currentServer].name} (${this.translate('current')})\n`;
    
    discoveredServers.forEach(ip => {
      if (fileSystem.root.servers[ip]) {
        output += `${ip} - ${fileSystem.root.servers[ip].name}\n`;
      }
    });
    
    return {
      success: true,
      message: output,
    };
  }

  handleLang(args, callbacks) {
    if (args.length < 1) {
      return {
        success: false,
        message: this.translate('invalid_args'),
        hint: this.translate(this.commandHints.lang)
      };
    }

    const lang = args[0].toLowerCase();
    
    if (lang !== 'en' && lang !== 'ru') {
      return {
        success: false,
        message: this.translate('invalid_language'),
      };
    }
    
    this.currentLanguage = lang;
    fileSystem.setLanguage(lang);
    
    if (callbacks.onLanguageChange) {
      callbacks.onLanguageChange(lang);
    }
    
    // analytics track
    analytics.trackLanguageChange(lang);
    
    this.unlockAchievement('language_changed', lang);
    
    return {
      success: true,
      message: `${this.translate('language_changed')} ${lang}`,
    };
  }

  handlePlayMusic(args) {
    if (!this.musicPlayer) {
      this.musicPlayer = new Audio('/audio/background-music.mp3');
      this.musicPlayer.loop = true;
    }

    if (this.musicPlaying) {
      this.musicPlayer.pause();
      this.musicPlaying = false;
      return {
        success: true,
        message: this.translate('playmusic_stop'),
      };
    } else {
      this.musicPlayer.play().catch(e => console.error('Error playing music:', e));
      this.musicPlaying = true;
      this.unlockAchievement('music_played');
      return {
        success: true,
        message: this.translate('playmusic_start'),
      };
    }
  }

  handleHelp() {
    return {
      success: true,
      message: this.translate('help_text'),
    };
  }

  getPreviousCommand() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.historyIndex];
    }
    return null;
  }

  getNextCommand() {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.historyIndex];
    }
    return '';
  }

  autoComplete(input) {
    const parts = input.trim().split(' ');
    
    // auto-complete the command
    if (parts.length === 1) {
      const cmd = parts[0].toLowerCase();
      const commands = ['connect', 'disconnect', 'login', 'ls', 'cd', 'cat', 'run', 'scan', 'lang', 'playmusic', 'help'];
      
      const matchingCommands = commands.filter(command => command.startsWith(cmd));
      
      if (matchingCommands.length === 1) {
        return matchingCommands[0] + ' ';
      } else if (matchingCommands.length > 1) {
        console.log('Matching commands:', matchingCommands.join(', '));
        return cmd;
      }
    }
    
    //  auto-complete the argument
    if (parts.length === 2) {
      const cmd = parts[0].toLowerCase();
      const arg = parts[1];
      
      if (['cd', 'cat', 'run'].includes(cmd)) {
        const result = fileSystem.autoComplete(cmd, arg);
        
        if (result.success && result.matches.length > 0) {
          if (result.matches.length === 1) {
            return `${cmd} ${result.matches[0]}`;
          } else {
            console.log('Matching items:', result.matches.join(', '));
            return input;
          }
        }
      }
    }
    
    return input;
  }

  // login:password@server format
  processLoginInfo(content) {
    const loginPassRegex = /(\w+):(\w+)@([\d.]+)/g;
    let match;
    
    while ((match = loginPassRegex.exec(content)) !== null) {
      const username = match[1];
      const password = match[2];
      const server = match[3];
      
      if (server) {
        const loginEntry = { 
          username, 
          password,
          formatted: `${username}:${password}@${server}`
        };
        this.knownLogins[server] = loginEntry;
        localStorage.setItem('knownLogins', JSON.stringify(this.knownLogins));
        
        this.unlockAchievement('logins_found', server);
      }
    }
    
    // "Login: user | Password: pass" format
    const loginPassTextRegex = /Login:\s+(\w+)(?:@([\d.]+))?\s+\|\s+Password:\s+(\w+)/gi;
    while ((match = loginPassTextRegex.exec(content)) !== null) {
      const username = match[1];
      const server = match[2];
      const password = match[3];
      
      if (server) {
        const loginEntry = { 
          username, 
          password,
          formatted: `${username}:${password}@${server}` 
        };
        this.knownLogins[server] = loginEntry;
        localStorage.setItem('knownLogins', JSON.stringify(this.knownLogins));
        
        this.unlockAchievement('logins_found', server);
      }
    }
  }

  clearKnownLogins() {
    this.knownLogins = {};
    localStorage.removeItem('knownLogins');
  }

  unlockAchievement(type, data) {
    const savedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');

    const exists = savedAchievements.some(a => a.type === type);
    const isServerSpecific = ['secret_server_access'].includes(type);
    const serverExists = isServerSpecific &&
      savedAchievements.some(a => a.type === type && a.data === data);

    if (isServerSpecific ? !serverExists : !exists) {
      const achievement = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };

      const updatedAchievements = [...savedAchievements, achievement];

      localStorage.setItem('achievements', JSON.stringify(updatedAchievements));

      console.log(`${this.translate('achievement_unlocked')}: ${type}`);
      analytics.trackAchievement(type, data);

      this.achievementsUnlocked = true;
      this.playAchievementSound();

      try {
        window.dispatchEvent(new CustomEvent('achievements:updated', {
          detail: { type, data, total: updatedAchievements.length }
        }));
      } catch {}

      return achievement;
    }

    return null;
  }

  playAchievementSound() {
    const sound = new Audio('/audio/achievement.mp3');
    sound.play().catch(e => console.error('Error playing achievement sound:', e));
  }

  getAchievements() {
    return JSON.parse(localStorage.getItem('achievements') || '[]');
    //return this.achievements;
  }

  getKnownLogins() {
    const savedLogins = localStorage.getItem('knownLogins');
    return savedLogins ? JSON.parse(savedLogins) : {};
    //return this.knownLogins;
  }

  translate(key) {
    return translations[this.currentLanguage]?.[key] || translations.en[key] || key;
  }

  setLanguage(lang) {
    if (lang === 'en' || lang === 'ru') {
      this.currentLanguage = lang;
      fileSystem.setLanguage(lang);
    }
  }
}

const commandProcessor = new CommandProcessor();
export default commandProcessor;