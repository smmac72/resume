// Translations for the UI elements
const translations = {
  en: {
    // General UI
    app_title: 'Interactive Resume',
    loading: 'Loading...',
    not_connected: 'Not connected to any server',
    use_connect: 'Use the \'connect\' command to connect to a server',
    
    // Terminal
    terminal_title: 'Terminal',
    enter_username: 'Enter username:',
    enter_password: 'Enter password:',
    auth_success: 'Authentication successful',
    auth_fail: 'Authentication failed',
    auth_required: 'Authentication required. Use login <username> <password>',
    already_authenticated: 'Already authenticated to this server',
    welcome_message: 'Welcome to Among OS Terminal. Type "help" for available commands.',
    connected_to: 'Connected to server',
    
    // Commands
    command_not_found: 'Command not found:',
    connect: 'Connected to',
    disconnect: 'Disconnected from',
    invalid_args: 'Invalid arguments',
    file_not_found: 'File not found',
    dir_not_found: 'Directory not found',
    connect_usage: 'Usage: connect <ip>',
    login_usage: 'Usage: login <username> <password>',
    run_usage: 'Usage: run <filename>',
    cat_usage: 'Usage: cat <filename>',
    lang_usage: 'Usage: lang <en|ru>',
    
    // File system
    empty_directory: 'Empty directory',
    
    // Achievements
    achievement_unlocked: 'Achievement unlocked',
    no_achievements: 'No achievements yet',
    
    // Achievement titles
    server_connection: 'Connected to server',
    first_login: 'Authenticated to server',
    logins_found: 'Found login credentials',
    secret_server_access: 'Accessed secret server',
    file_executed: 'Executed file',
    timeline_opened: 'Opened timeline',
    image_opened: 'Opened image',
    link_opened: 'Opened link',
    language_changed: 'Changed language',
    music_played: 'Played background music',
    
    // Inventory
    inventory: 'Inventory',
    inventory_empty: 'Empty',
    login: 'Login:',
    password: 'Password:',
    
    // InfoBox
    status: 'Status:',
    online: 'online',
    offline: 'offline',
    uptime: 'Uptime:',
    
    // Help command
    help_text: `
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
    `,
  },
  
  ru: {
    // General UI
    app_title: 'Интерактивное Резюме',
    loading: 'Загрузка...',
    not_connected: 'Нет подключения к серверу',
    use_connect: 'Используйте команду \'connect\' для подключения к серверу',
    
    // Terminal
    terminal_title: 'Терминал',
    enter_username: 'Введите имя пользователя:',
    enter_password: 'Введите пароль:',
    auth_success: 'Аутентификация успешна',
    auth_fail: 'Ошибка аутентификации',
    auth_required: 'Требуется аутентификация. Используйте login <имя_пользователя> <пароль>',
    welcome_message: 'Добро пожаловать в терминал Among OS. Введите "help" для просмотра доступных команд.',
    connected_to: 'Подключен к серверу',
    
    // Commands
    command_not_found: 'Команда не найдена:',
    connect: 'Подключено к',
    disconnect: 'Отключено от',
    invalid_args: 'Неверные аргументы',
    file_not_found: 'Файл не найден',
    dir_not_found: 'Директория не найдена',
    connect_usage: 'Использование: connect <ip>',
    login_usage: 'Использование: login <имя_пользователя> <пароль>',
    run_usage: 'Использование: run <имя_файла>',
    lang_usage: 'Использование: lang <en|ru>',
    
    // File system
    empty_directory: 'Пустая директория',
    
    // Achievements
    achievement_unlocked: 'Достижение разблокировано',
    no_achievements: 'Пока нет достижений',
    
    // Achievement titles
    server_connection: 'Подключение к серверу',
    first_login: 'Аутентификация на сервере',
    logins_found: 'Найдены учетные данные',
    secret_server_access: 'Доступ к секретному серверу',
    file_executed: 'Выполнен файл',
    timeline_opened: 'Открыт таймлайн',
    image_opened: 'Открыто изображение',
    link_opened: 'Открыта ссылка',
    language_changed: 'Изменен язык',
    music_played: 'Воспроизведена фоновая музыка',
    
    // Inventory
    inventory: 'Инвентарь',
    inventory_empty: 'Пусто',
    login: 'Логин:',
    password: 'Пароль:',
    
    // InfoBox
    status: 'Статус:',
    online: 'онлайн',
    offline: 'оффлайн',
    uptime: 'Аптайм:',
    
    // Help command
    help_text: `
Доступные команды:
  connect <ip>           - Подключиться к серверу
  disconnect             - Отключиться от текущего сервера
  login <username> <password> - Аутентификация на сервере
  ls                     - Список файлов и директорий
  cd <directory>         - Сменить директорию
  cat <file>             - Показать содержимое файла
  run <file>             - Запустить файл и открыть в ContentBox
  scan                   - Поиск доступных серверов
  lang <language>        - Изменить язык (en, ru)
  playmusic              - Включить/выключить фоновую музыку
  help                   - Показать эту справку
    `,
  },
};

export default translations;
