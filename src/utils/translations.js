// Translations for the UI elements
const translations = {
  en: {
    // General UI
    app_title: 'zeromac cv',
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
    welcome_message: 'Welcome to my resume! Type "help" for available commands.',
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
    directory_not_found: 'Directory not found:',
    not_a_directory: 'Not a directory:',
    not_a_file: 'Not a file:',
    auth_required_filesystem: 'Authentication required',
    not_connected_filesystem: 'Not connected to any server',
    
    // Achievements
    achievement_unlocked: 'Achievement unlocked',
    no_achievements: 'No achievements yet',
    achievements_locked: 'ACHIEVEMENTS LOCKED',
    achievements_unlocked: 'ACHIEVEMENTS UNLOCKED',
    
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
    
    // Dialog
    confirm_disconnect: 'Are you sure you want to disconnect from the server?',
    yes: 'Yes',
    no: 'No',
    
    // Mobile warning
    mobile_warning_title: 'Desktop Device Required',
    mobile_warning_text: 'This interactive resume is designed for desktop devices. Please visit this site on a desktop computer for the full experience.',
    
    // File Content Translations
    readme_backup: 'note to the future me - if you don\'t know what this server is, amnesia came. check the logins.txt if you\'re still making games. read my old dev notes and make me proud mate!\notherwise, if you aren\'t me but interested in my personal data, use the \'help\' command - there\'s a custom terminal here. gl mate!\n\n- me',
    logins_txt: 'zeromac:naughtshad@31.31.196.2\nzeromac:allsspent@31.31.196.3\nzeromac:whereourdesire@31.31.196.4',
    servers_conf: 'Available servers on network:\n31.31.196.2 - Work Server\n31.31.196.3 - Pet Projects\n31.31.196.4 - Personal Server',
    readme_projects: 'a small compilation of my workplaces. timeline files contain the most important events and achievements. due to a little funny document, i won\'t be storing any sensitive documents here\nbut if you want to know what i did - you\'re welcome',
    readme_renderer: 'note to self - making game content is cool, but you know what is cooler? low-level programming. god i miss my risc-v days...\nanyways, a cool thing i did on my redbull-driven three-night bonanza. code is acceptable by my standards',
    readme_chernograd: 'a small piece of our kgb-simulator indie game. pretty hard to finish rn, but i had finally returned to the developer me, not gamedesigner me\nit is broken, but i will get to chernograd when my happiness is back',
    readme_tabletop: 'got ourselves a publisher. just decided not to. i kinda understand the tabletops, but cannot get to like it\ni guess just not my thing, but it was certainly cool to try',
    readme_web: 'this web-page is free like the wikipedia the free online encyclopedia that anyone from black mesa from edit!\nah no, the free online encyclopedia that no one will ever edit again!\ndid not understand the reference? check out half life vr, funny as hell\n\nanyways, i do not like web-dev, but have you seen a student with no prior experience getting a position without a cool resume? take a look at my first site, i made it in flask and will never share the sources, it was terrible.\n\nalso there is a sluchka.market website - a work in progress marketplace for the pet matching. it is a birthday gift for my best friend, as he wished for this project to come true, but big coporate men usually do not have time for their dreams :(\nso i made it for him. it can be down, cloud servers are expensive',
    readme_gtao: 'i most certainly believe i did a better job than rockstar. i mean, i did not, but i am not the richest gamedev company in the world\nalas, they did not hire me. but they did send my friends a cease and desist letter (we did a lot of gta modding in the past). i guess i was close to them in some way\n\noutdated as hell, will not try that again until i make roleplay games again',
    readme_personal: 'hiya! my name\'s oleg, i am a full-time game designer (mobile f2p and mmorpg), even more full-time student. game design stuff is on the other servers, here\'s more about me. i am a:\n– programming guy at my core\n– cameraman and video editor since middle school\n– home trained half-professional cook with a decade of learning and experimenting\n– true shakespearean (new) english enjoyer - you did get the mcbeth reference from the server passwords, right? or you can accept it as a metal gear solid 2: sons of liberty reference\n– long airsoft enjoyer with my masada acr and lots of custom gear. alas, i gave my hobby away to grow as a professional\n\nactually, i am pretty cool! if you are not hiring, we can at least share the best sandwich in saint-p!',
    favgames_txt: 'reminder to myself if there are no games i wish to play:\n1. drakenier - yoko taro is a genius at creating the perfect story and atmosphere\n2. metal gear - kojima is god! i hear it\'s amazing when the famous purple stuffed worm in flap-jaw space with the tuning fork does a raw blink on hara-kiri Rock. i need scissors! 61!\n3. yakuza - peak meme potential\n4. lisa (both the painful and the joyful) - truly a beautiful story that makes a man cry\n5. persona 5 (sorry i caught the hype wave) - BY THE MYRIAD TRUTHS\n6. call of duty: modern warfare 2 - if you thought of the new 2022 MW2, that\'s the wrong list\n7. stalker - the new one is a masterpiece. probably won\'t replay it, but peak story, cutscene directing, gameplay, atmosphere. truly the best experience of my 2024\n8. undertale - sans undertale. if you know, you know.\n9. max payne - the best third-person shooter in my absolutely objective opinion.\n10. grand theft auto series - i think it doesn\'t need any explanation. long-time fan, long-time modder, long-time taketwo opposition member',
    favmovies_txt: 'movies/tv shows/producers - my top10:\n1. guy ritchie - who doesn\'t like a light-hearted criminal comedy?\n2. vince gilligan - i skipped my exams for the release of el camino. i regret nothing.\n3. hayao miyazaki - every work of his is a masterpiece\n4. the wachowski brothers? sisters? - probably the reason i managed to reinstall windows 18 years ago, when my parents left me home alone. seriously, matrix might be the force that made me a programmer\n5. luke besson - won\'t get political here with the leon inspiration. multipass.\n6. balabanov - every film made to amass budget for his strange true ideas was peak of the russian media. turned out i know the ethiopian guy in person lmao.\n7. quentin jerome tarantino - probably must be higher. also i wish to place miller\'s sin city here.\n8. limitless (i don\'t know other burger\'s movies) - must watch if not feeling alright. makes you believe you can go on\n9. the coen brothers - i even got myself the rug\n10. suits tv show - made me a better person. mike ross is quite relatable (except for the genius part)',
    favbooks_txt: 'that would be a top5, i am not that memorable of the quotes:\n1. moby dick - "ignorance is the parent of fear"\n2. programming: principles and practice using c++ - "a computer is just a piece of hardware until someone — some programmer — writes code for it to do something useful"\n3. "when the power of imparting joy is equal to the will, the human soul requires no other heaven."\n4. alice\'s adventures in wonderland - "imagination is the only weapon in the war with reality"\n5. treasure island - "money can\'t buy happiness, but it can certainly buy a lot of other things"',
    utils_txt: 'writing software:\n1. notion\n2. google docs\n3. coda\n\ncoding preferences:\n1. c/c++ - vs code or notepad++ with gcc\n2. python - idle only\n3. any web stuff (not flask) - vs code\n4. c++ with complex projects - vs2022\n\nbalancing:\n1. google spreadsheets. nothing else.\n\nprototyping:\n1. figma\n2. miro\n3. mspaint\n\ndb preferences:\n1. postgre - covers most of the relational databases\n2. mongodb json - for configs\n3. redis - for cached data',
    nothingimportant_txt: 'root:BYTHEMYRIADTRUTHS\n\nNo idea what these creds are for',
    bruh_txt: 'there\'re no cows here, just a fact - i own a child hospital in vorkuta. for meme purpose only\nor for my longwaited seat of the governor of vorkuta. alas, they found 6kg of drugs on him and gave him a pay raise, so i\'m not going anywhere',
    therearenoeastereggs_txt: 'go away. or watch the memes i hold on this server',
    
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
    app_title: 'zeromac cv',
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
    already_authenticated: 'Уже аутентифицирован на этом сервере',
    welcome_message: 'Добро пожаловать в мое резюме! Введите "help" для просмотра доступных команд.',
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
    cat_usage: 'Использование: cat <имя_файла>',
    lang_usage: 'Использование: lang <en|ru>',
    
    // File system
    empty_directory: 'Пустая директория',
    directory_not_found: 'Директория не найдена:',
    not_a_directory: 'Не директория:',
    not_a_file: 'Не файл:',
    auth_required_filesystem: 'Требуется аутентификация',
    not_connected_filesystem: 'Нет подключения к серверу',
    
    // Achievements
    achievement_unlocked: 'Достижение разблокировано',
    no_achievements: 'Пока нет достижений',
    achievements_locked: 'ДОСТИЖЕНИЯ ЗАБЛОКИРОВАНЫ',
    achievements_unlocked: 'ДОСТИЖЕНИЯ РАЗБЛОКИРОВАНЫ',
    
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
    
    // Dialog
    confirm_disconnect: 'Вы уверены, что хотите отключиться от сервера?',
    yes: 'Да',
    no: 'Нет',
    
    // Mobile warning
    mobile_warning_title: 'Требуется настольное устройство',
    mobile_warning_text: 'Это интерактивное резюме разработано для настольных устройств. Пожалуйста, посетите этот сайт на настольном компьютере для полноценного просмотра.',
    
    // File Content Translations
    readme_backup: 'заметка для будущего меня - если ты не знаешь, что это за сервер, значит пришла амнезия. проверь logins.txt, если ты всё ещё делаешь игры. прочитай мои старые заметки и стань моей гордостю снова!\nв противном случае, если ты не я, но заинтересован в моей жизни или карьере, используй команду \'help\' - здесь есть собственный терминал. успехов, друже!\n\n- я',
    logins_txt: 'zeromac:naughtshad@31.31.196.2\nzeromac:allsspent@31.31.196.3\nzeromac:whereourdesire@31.31.196.4',
    servers_conf: 'Доступные серверы в сети:\n31.31.196.2 - Рабочий сервер\n31.31.196.3 - Персональные проекты\n31.31.196.4 - Личный сервер',
    readme_projects: 'небольшая подборка моих рабочих мест. файлы с таймлайном содержат наиболее важные события и достижения. из-за одного забавного документа (начинается на н, заканчивается на да) я не буду хранить здесь никаких конфиденциальных документов\nно если вы хотите узнать, чем я занимался - добро пожаловать',
    readme_renderer: 'заметка для себя - создавать игровой контент - это круто, но знаешь, что ещё круче? низкоуровневое программирование. как же я скучаю по дням risc-v...\nв любом случае, это крутая штука, которую я сделал за три ночи во время своей редбулльной экстраваганзы. код приемлемый по моим стандартам',
    readme_chernograd: 'небольшая часть нашей инди-игры симулятора кгб. сейчас довольно сложно закончить, но я наконец вернулся к себе как разработчику, а не геймдизайнеру\nона сломана, но я вернусь к чернограду, когда буду к этому готов!',
    readme_tabletop: 'нашли издателя. просто решили не продолжать. я вроде понимаю настольные игры, но не могу их полюбить\nполагаю, просто не моё, но попробовать определённо было интересно',
    readme_web: 'эта веб-страница бесплатна, как википедия, свободная онлайн-энциклопедия, которую любой сотрудник black mesa может редактировать!\nа, нет, свободная онлайн-энциклопедия, которую больше никто никогда не будет редактировать!\nне поняли отсылку? посмотрите half life vr, очень смешно\n\nв любом случае, я не люблю веб-разработку, но видели ли вы студента без опыта, получающего позицию без крутого резюме? взгляните на мой первый сайт, я сделал его на flask и никогда не поделюсь исходниками, это было ужасно.\n\nтакже есть сайт sluchka.market - work in progress площадка для подбора питомцев. это подарок на день рождения моему лучшему другу, так как он хотел, чтобы этот проект осуществился, но у больших корпоративных людей обычно нет времени на свои мечты :(\nпоэтому я сделал это для него. сайт может не работать, облачные серверы дорогие',
    readme_gtao: 'я совершенно уверен, что сделал работу лучше, чем рокстары. ну вообще нет, но я не самая богатая игровая компания в мире\nувы, они меня не наняли. но они отправили моим друзьям cease and desist письмо (сладкие дни гта моддинга). полагаю, я был близок к рокам\n\nужасно устарело, не буду пробовать снова, пока не начну делать ролевые игры',
    readme_personal: 'привет! меня зовут олег, я фуллтайм геймдизайнер (мобильные f2p и mmorpg), и ещё более фуллтайм студент. информация о геймдизайне на других серверах, а вот ещё кое-что обо мне. я:\n– в своем коре программист\n– оператор и видеомонтажёр со средней школы\n– почти-профессиональный повар-самоучка с десятилетним опытом обучения и экспериментов\n– истинный ценитель шекспировского (нового) английского - вы ведь поняли отсылку к макбету в паролях серверов, верно? или можете принять это как отсылку к metal gear solid 2: sons of liberty\n– долгое время увлекался страйкболом с моей masada acr и множеством кастомного снаряжения. увы, я оставил это хобби, чтобы расти как профессионал\n\nна самом деле, я довольно крут! если вы не эйчар, мы можем хотя бы посидеть за лучшим сэндвичем в спб!',
    favgames_txt: 'напоминание самому себе, если нет игр, в которые хочется поиграть:\n1. drakenier - йоко таро - гений в создании идеальной истории и атмосферы\n2. metal gear - kojima is god! i hear it\'s amazing when the famous purple stuffed worm in flap-jaw space with the tuning fork does a raw blink on hara-kiri Rock. i need scissors! 61!\n3. yakuza - пиковый мемный потенциал\n4. lisa (и the painful, и the joyful) - действительно прекрасная история, заставляющая даже взрослого 15летнего мужчину плакать\n5. persona 5 (извините, я попал в волну хайпа) - BY THE MYRIAD TRUTHS\n6. call of duty: modern warfare 2 - если вы подумали о новом mw2 2022, это не список для вас\n7. stalker - новый - шедевр. вероятно, не буду перепроходить, но пик истории, режиссуры кат-сцен (спасибо дядя найшуллер), геймплея, атмосферы. действительно лучший опыт моего 2024\n8. undertale - sans undertale\n9. max payne - лучший шутер от третьего лица по моему абсолютно объективному мнению.\n10. серия grand theft auto - думаю, не требует объяснений. давний фанат, давний моддер, давний член оппозиции taketwo',
    favmovies_txt: 'фильмы/сериалы/режиссёры - мой топ10:\n1. гай ричи - кто не любит легкую криминальную комедию?\n2. винс гиллиган - я пропустил экзамены ради выхода эль камино. ни о чём не жалею.\n3. хаяо миядзаки - каждая его работа - шедевр\n4. братья? сёстры? вачовски - вероятно, причина, по которой я смог переустановить windows 18 лет назад, когда родители оставили меня дома одного. серьёзно, матрица могла быть причиной, почему я программист\n5. люк бессон - опустим источник вдохновения леона. мультипасс.\n6. балабанов - каждый фильм, снятый для накопления бюджета на его странные идеи, был пиком российского медиа. оказалось, я знаю эфиопа (михаила джековича) лично лмао.\n7. квентин джером тарантино - вероятно, должен быть выше. также хочу разместить здесь город грехов миллера.\n8. области тьмы (не знаю других фильмов бургера) - объективно лучший буст мотивации (или потребления непонятных таблеток)\n9. братья коэны - я даже приобрёл себе ковёр\n10. сериал suits - просто достаточно близок мне и решил кусок проблем в жизни',
    favbooks_txt: 'это был бы топ5, я не особо запоминаю цитаты:\n1. моби дик - "невежество - родитель страха"\n2. программирование: принципы и практика с использованием c++ - "компьютер - просто кусок железа, пока кто-то — какой-то программист — не напишет код, чтобы он делал что-то полезное"\n3. "когда сила дарить радость равна воле, человеческая душа не требует другого рая."\n4. алиса в стране чудес - "воображение - единственное оружие в войне с реальностью"\n5. остров сокровищ - "деньги не могут купить счастье, но они определённо могут купить много других вещей"',
    utils_txt: 'для доков:\n1. notion\n2. google docs\n3. coda\n\nдля проги:\n1. c/c++ - vs code или notepad++ с gcc\n2. python - только idle\n3. любой веб (не flask) - vs code\n4. c++ со сложными проектами - vs2022\n\балансные штуки:\n1. google таблицы. ничего больше.\n\прототипы:\n1. figma\n2. miro\n3. mspaint\n\nбдшки:\n1. postgre - покрывает большинство реляционных бд\n2. mongodb json - для конфигов\n3. redis - для кэшированных данных',
    nothingimportant_txt: 'root:BYTHEMYRIADTRUTHS\n\nпонятия не имею что это',
    bruh_txt: 'здесь нет коров, только фанфакт - я владею детской больницей в воркуте. да, для мемов\nили для моего долгожданного места губернатора воркуты. хотя, у него нашли 6кг наркотиков и повысили зарплату, так что я тут надолго',
    therearenoeastereggs_txt: 'go away. а вообще у меня тут мемы есть',
    
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
