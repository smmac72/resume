import fileSystem from './fileSystem';

class CommandProcessor {
  constructor() {
    this.commandHistory = [];
    this.historyIndex = -1;
    this.musicPlayer = null;
    this.musicPlaying = false;
    this.knownLogins = {};
    this.achievements = [];
    this.achievementsUnlocked = false;
    this.availableAchievements = [
      'server_connection',
      'first_login',
      'logins_found',
      'secret_server_access',
      'file_executed',
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
    
    this.translations = {
      en: {
        connect: 'Connected to',
        disconnect: 'Disconnected from',
        auth_success: 'Authenticated successfully',
        auth_fail: 'Authentication failed',
        auth_required: 'Authentication required. Use login <username> <password>',
        already_authenticated: 'Already authenticated to this server',
        file_not_found: 'File not found',
        dir_not_found: 'Directory not found',
        command_not_found: 'Command not found',
        invalid_args: 'Invalid arguments',
        playmusic_start: 'Playing music',
        playmusic_stop: 'Music stopped',
        achievement_unlocked: 'Achievement unlocked',
        language_changed: 'Language changed to',
        connect_usage: 'Usage: connect <ip>',
        login_usage: 'Usage: login <username> <password>',
        run_usage: 'Usage: run <filename>',
        cat_usage: 'Usage: cat <filename>',
        lang_usage: 'Usage: lang <en|ru>',
        welcome_message: 'Welcome to Among OS Terminal. Type "help" for available commands.',
        connected_to: 'Connected to server',
      },
      ru: {
        connect: 'Подключено к',
        disconnect: 'Отключено от',
        auth_success: 'Аутентификация успешна',
        auth_fail: 'Ошибка аутентификации',
        auth_required: 'Требуется аутентификация. Используйте login <имя_пользователя> <пароль>',
        already_authenticated: 'Уже аутентифицирован на этом сервере',
        file_not_found: 'Файл не найден',
        dir_not_found: 'Директория не найдена',
        command_not_found: 'Команда не найдена',
        invalid_args: 'Неверные аргументы',
        playmusic_start: 'Воспроизведение музыки',
        playmusic_stop: 'Музыка остановлена',
        achievement_unlocked: 'Достижение разблокировано',
        language_changed: 'Язык изменен на',
        connect_usage: 'Использование: connect <ip>',
        login_usage: 'Использование: login <имя_пользователя> <пароль>',
        run_usage: 'Использование: run <имя_файла>',
        cat_usage: 'Использование: cat <имя_файла>',
        lang_usage: 'Использование: lang <en|ru>',
        welcome_message: 'Добро пожаловать в терминал Among OS. Введите "help" для просмотра доступных команд.',
        connected_to: 'Подключен к серверу',
      },
    };
    this.currentLanguage = 'en';
  }

  // Process a command
  processCommand(command, callbacks) {
    if (!command) return { success: false, message: '' };

    // Add command to history
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;

    // Split command into command name and arguments
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Check if we're connected to a protected server and not authenticated
    const currentServer = fileSystem.currentServer;
    const isProtectedServer = currentServer && 
                             fileSystem.root.servers[currentServer]?.protected;
    const isAuthenticated = currentServer && 
                           fileSystem.authenticatedServers[currentServer];
    
    // List of always available commands
    const alwaysAvailableCommands = ['connect', 'disconnect', 'lang', 'playmusic', 'help', 'login'];
    
    // If we're on a protected server and not authenticated, restrict commands
    if (isProtectedServer && !isAuthenticated && !alwaysAvailableCommands.includes(cmd)) {
      return {
        success: false,
        message: this.translate('auth_required'),
      };
    }

    // Execute the command
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

    // Add hint if applicable
    if (this.commandHints[cmd] && !result.success && !result.hint) {
      result.hint = this.translate(this.commandHints[cmd]);
    }

    return result;
  }

  // Handle connect command
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
      // Check if we already know login and password for this server
      if (this.knownLogins[ip]) {
        const { username, password } = this.knownLogins[ip];
        const authResult = fileSystem.authenticate(username, password);
        
        if (authResult.success && callbacks.onAuthenticate) {
          callbacks.onAuthenticate(authResult.server);
          // Unlock secret server achievement if this isn't the main server
          if (ip !== '192.168.1.1') {
            this.unlockAchievement('secret_server_access', ip);
          }
        }
      }

      if (callbacks.onConnect) {
        callbacks.onConnect(result.server);
      }

      this.unlockAchievement('server_connection', ip);
      
      return {
        success: true,
        message: `${this.translate('connect')} ${ip}`,
      };
    }

    return result;
  }

  // Handle disconnect command
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

  // Handle login command
  handleLogin(args, callbacks) {
    if (args.length < 2) {
      return {
        success: false,
        message: this.translate('invalid_args'),
        hint: this.translate(this.commandHints.login)
      };
    }

    // Check if already authenticated
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
      // Save credentials
      this.knownLogins[fileSystem.currentServer] = { 
        username, 
        password,
        formatted: `${username}:${password}@${fileSystem.currentServer}`
      };
      
      if (callbacks.onAuthenticate) {
        callbacks.onAuthenticate(result.server);
      }
      
      this.unlockAchievement('first_login', fileSystem.currentServer);
      
      // Unlock secret server achievement if this isn't the main server
      if (fileSystem.currentServer !== '192.168.1.1') {
        this.unlockAchievement('secret_server_access', fileSystem.currentServer);
      }
      
      return {
        success: true,
        message: this.translate('auth_success'),
      };
    }
    
    return {
      success: false,
      message: this.translate('auth_fail'),
    };
  }

  // Handle ls command
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
        message: output || 'Empty directory',
        html: true,
      };
    }

    return result;
  }

  // Handle cd command
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
      return {
        success: true,
        message: '',
      };
    }

    return result;
  }

  // Handle cat command
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
        // Process file content
        const content = result.content.replace(/\\n/g, '\r\n');
        
        // Check for login credentials in text
        this.processLoginInfo(content);
        
        return {
          success: true,
          message: content,
        };
      } else {
        return {
          success: false,
          message: `File is not a text file: ${filePath}`,
        };
      }
    }

    return result;
  }

  // Handle run command
  handleRun(args, callbacks) {
    if (args.length < 1) {
      return {
        success: false,
        message: this.translate('invalid_args'),
        hint: this.translate(this.commandHints.run)
      };
    }

    const filePath = args[0];
    const result = fileSystem.getFileContent(filePath);
    console.log("Running file:", filePath);
  console.log("File type:", result.type);
  console.log("Content starts with:", result.content.substring(0, 50));
    if (result.success) {
      // Добавлен новый тип 'url'
      if (result.type === 'url') {
        // Открываем ссылку в новой вкладке браузера
        window.open(result.content.trim(), '_blank');
        
        // Разблокируем достижение за открытие ссылки
        this.unlockAchievement('link_opened', filePath);
        
        // Показываем сообщение в терминале
        return {
          success: true,
          message: `Opening link: ${result.content}`,
        };
      }
      
      // Для обратной совместимости - проверка на текстовые файлы с http
      if (result.type === 'text' && 
          (result.content.trim().startsWith('http://') || 
          result.content.trim().startsWith('https://'))) {
        // Открываем ссылку в новой вкладке браузера
        window.open(result.content.trim(), '_blank');
        
        // Разблокируем достижение за открытие ссылки
        this.unlockAchievement('link_opened', filePath);
        
        // Показываем сообщение в терминале
        return {
          success: true,
          message: `Opening link: ${result.content}`,
        };
      }
      
      // Для всех остальных типов файлов - открываем в ContentBox
      if (callbacks.onRun) {
        callbacks.onRun({
          title: filePath,
          content: result.content,
          type: result.type,
        });
      }

      // Разблокировка достижений в зависимости от типа файла
      if (result.type === 'image') {
        this.unlockAchievement('image_opened', filePath);
      } else if (result.type === 'timeline') {
        this.unlockAchievement('timeline_opened', filePath);
      }
      
      // Для текстовых файлов также показываем содержимое в терминале
      if (result.type === 'text') {
        const content = result.content.replace(/\\n/g, '\r\n');
        
        // Проверяем наличие учетных данных в тексте
        this.processLoginInfo(content);
        
        this.unlockAchievement('file_executed', filePath);
        
        return {
          success: true,
          message: `Running: ${filePath}\n\n${content}`,
        };
      }
      
      this.unlockAchievement('file_executed', filePath);
      
      return {
        success: true,
        message: `Running: ${filePath}`,
      };
    }

    return result;
  }

  // Handle scan command
  handleScan() {
    const discoveredServers = [];
    
    // Default basic servers
    if (fileSystem.currentServer === '31.31.196.1') {
      discoveredServers.push('31.31.196.2', '31.31.196.3', '31.31.196.4');
    }
    // Easter egg path
    else if (fileSystem.currentServer === '31.31.196.4') {
      discoveredServers.push('31.31.196.10');
    }
    else if (fileSystem.currentServer === '31.31.196.10') {
      discoveredServers.push('31.31.196.24');
    }
    else if (fileSystem.currentServer === '31.31.196.24') {
      discoveredServers.push('31.31.196.69');
    }
    
    // Generate server list output
    let output = 'Network scan complete.\n\nAvailable servers:\n';
    
    // Add current server first
    output += `${fileSystem.currentServer} - ${fileSystem.root.servers[fileSystem.currentServer].name} (current)\n`;
    
    // Add discovered servers
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

  // Handle language command
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
        message: 'Invalid language. Available languages: en, ru',
      };
    }
    
    this.currentLanguage = lang;
    
    if (callbacks.onLanguageChange) {
      callbacks.onLanguageChange(lang);
    }
    
    this.unlockAchievement('language_changed', lang);
    
    return {
      success: true,
      message: `${this.translate('language_changed')} ${lang}`,
    };
  }

  // Handle playmusic command
  handlePlayMusic(args) {
    if (!this.musicPlayer) {
      this.musicPlayer = new Audio('/audio/background-music.mp3');
      this.musicPlayer.loop = true;
    }

    // Toggle music state
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

  // Handle help command
  handleHelp() {
    const helpText = `
Available commands:
  connect <ip>           - Connect to a server
  disconnect             - Disconnect from the current server
  login <username> <password> - Authenticate to a server
  ls                     - List files and directories
  cd <directory>         - Change directory
  cat <file>             - Display file content
  run <file>             - Execute file and open in ContentBox
  scan                   - Scan for available servers
  lang <language>        - Change language (en, ru)
  playmusic              - Toggle background music
  help                   - Display this help
    `;
    
    return {
      success: true,
      message: helpText,
    };
  }

  // Get previous command from history
  getPreviousCommand() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      return this.commandHistory[this.historyIndex];
    }
    return null;
  }

  // Get next command from history
  getNextCommand() {
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      return this.commandHistory[this.historyIndex];
    }
    return '';
  }

  // Auto-complete command
  autoComplete(input) {
    const parts = input.trim().split(' ');
    
    // If we only have the command, auto-complete the command itself
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
    
    // If we have a command and an argument, auto-complete the argument
    if (parts.length === 2) {
      const cmd = parts[0].toLowerCase();
      const arg = parts[1];
      
      // Only auto-complete for cd, cat, and run commands
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

  // Process login information from text content
  processLoginInfo(content) {
    // Check for login:password@server format
    const loginPassRegex = /(\w+):(\w+)@([\d\.]+)/g;
    let match;
    
    while ((match = loginPassRegex.exec(content)) !== null) {
      const username = match[1];
      const password = match[2];
      const server = match[3];
      
      if (server) {
        this.knownLogins[server] = { 
          username, 
          password,
          formatted: `${username}:${password}@${server}`
        };
        this.unlockAchievement('logins_found', server);
      }
    }
    
    // Check for "Login: user | Password: pass" format
    const loginPassTextRegex = /Login:\s+(\w+)(?:@([\d\.]+))?\s+\|\s+Password:\s+(\w+)/gi;
    while ((match = loginPassTextRegex.exec(content)) !== null) {
      const username = match[1];
      const server = match[2];
      const password = match[3];
      
      if (server) {
        this.knownLogins[server] = { 
          username, 
          password,
          formatted: `${username}:${password}@${server}` 
        };
        this.unlockAchievement('logins_found', server);
      }
    }
  }

  // Unlock an achievement
  unlockAchievement(type, data) {
    // Check if we already have this achievement of this type
    // For unique achievements like 'file_executed', 'image_opened', etc.
    // We only want one achievement per type, regardless of the data (file name)
    const exists = this.achievements.some(a => a.type === type);
    
    // Only for server-specific achievements (like connecting or logging in),
    // check if we have this specific server already
    const isServerSpecific = ['server_connection', 'first_login', 'secret_server_access'].includes(type);
    const serverExists = isServerSpecific && 
      this.achievements.some(a => a.type === type && a.data === data);
      
    if (isServerSpecific ? !serverExists : !exists) {
      const achievement = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      
      this.achievements.push(achievement);
      console.log(`${this.translate('achievement_unlocked')}: ${type}`);
      
      // Set achievementsUnlocked flag to true if this is our first achievement
      if (this.achievements.length === 1) {
        this.achievementsUnlocked = true;
      }
      
      // Play achievement sound
      this.playAchievementSound();
      
      // Return the achievement for potential display
      return achievement;
    }
    
    return null;
  }

  // Play achievement sound
  playAchievementSound() {
    const sound = new Audio('/audio/achievement.mp3');
    sound.play().catch(e => console.error('Error playing achievement sound:', e));
  }

  // Get all unlocked achievements
  getAchievements() {
    return this.achievements;
  }

  // Get known logins
  getKnownLogins() {
    return this.knownLogins;
  }

  // Translate a key based on the current language
  translate(key) {
    return this.translations[this.currentLanguage][key] || key;
  }

  // Set current language
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
    }
  }
}

export default new CommandProcessor();
