import React, { useEffect, useState, useRef } from 'react';
import fileSystem from '../utils/fileSystem';
import translations from '../utils/translations';
import analytics from '../utils/analytics';
import '../styles/ContentBox.css';

const ContentBox = ({ language, server, tabs, activeTab, onTabChange, onTabClose, onExecute, currentPath, onPathChange }) => {
  const [localPath, setLocalPath] = useState(currentPath);
  const tabTrackedRef = useRef({});
  
  // sync local path with overall path, include server changing
  useEffect(() => {
    setLocalPath(currentPath);
  }, [currentPath]);
  useEffect(() => {
    setLocalPath('/');
    // Сбрасываем отслеживание табов при смене сервера
    tabTrackedRef.current = {};
  }, [server?.ip]);
  
  return (
    <div className="content-box">
      <div className="run-tabs">
        <div 
          className={`run-tab ${activeTab === 0 ? 'active' : ''}`}
          onClick={() => onTabChange(0)}
        >
          <span className="tab-title">🏠</span>
        </div>
        
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`run-tab ${activeTab === index + 1 ? 'active' : ''}`}
            onClick={() => onTabChange(index + 1)}
          >
            <span className="tab-title">{tab.title}</span>
            <span
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(index + 1);
              }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
      
      <div className="content-container">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );

   // tab render
   function renderContent() {
    // homescreen
    if (activeTab === 0) {
      return <FileBrowser 
        server={server} 
        language={language} 
        onExecute={onExecute} 
        currentPath={localPath}
        onPathChange={onPathChange}
      />;
    }
    
    const tab = tabs[activeTab - 1];
    if (!tab) return null;
    
    const tabKey = `${tab.title}-${tab.type}`;
    if (!tabTrackedRef.current[tabKey]) {
      analytics.trackEvent('Interface', 'TabOpen', `${tab.title} (${tab.type})`);
      tabTrackedRef.current[tabKey] = true;
    }
    
    import('../utils/commandProcessor').then(module => {
      const commandProcessor = module.default;
      
      commandProcessor.unlockAchievement('any_file', tab.title);
      
      if (tab.type === 'image') {
        commandProcessor.unlockAchievement('image_opened', tab.title);
      } else if (tab.type === 'timeline') {
        commandProcessor.unlockAchievement('timeline_opened', tab.title);
      } else if (tab.type === 'url' || 
          (tab.type === 'text' && 
           (tab.content.trim().startsWith('http://') || 
            tab.content.trim().startsWith('https://')))) {
        commandProcessor.unlockAchievement('link_opened', tab.title);
      }
    });
    
    switch (tab.type) {
      case 'pdf':
        const pdfUrl = tab.content.substring(4);
        return (
          <div className="content-pdf" key={`pdf-${activeTab}`}>
            <iframe
              src={`/pdfs/${pdfUrl}`}
              title={tab.title}
              width="100%"
              height="100%"
            />
          </div>
        );
      case 'image':
        const imageUrl = tab.content.substring(6);
        return (
          <div className="content-image" key={`image-${activeTab}`}>
            <div className="image-container">
              <img src={`/images/${imageUrl}`} alt={tab.title} />
            </div>
          </div>
        );
      case 'timeline':
        const timelineContent = tab.content || '';
        const timelineId = timelineContent.startsWith('timeline:') ? 
          timelineContent.substring(9) : 
          timelineContent;
        
        return <TimelineViewer 
          key={`timeline-${timelineId}-${activeTab}`} 
          id={timelineId} 
          language={language} 
        />;
      default:
        return (
          <div className="content-text-wrapper" key={`text-${activeTab}`}>
            <div className="content-text">
              <pre>{tab.content}</pre>
            </div>
          </div>
        );
    }
  }
};

// fileview component
const FileBrowser = ({ server, language, onExecute, currentPath, onPathChange }) => {
  const [innerPath, setInnerPath] = useState(currentPath);
  const fileEventThrottleRef = useRef({});
  
  useEffect(() => {
    setInnerPath(currentPath);
  }, [currentPath]);
  
  const translate = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };
  
  // Функция для проверки и установки троттлинга для файлов
  const checkAndTrackFile = (fileName, fileType, serverIp) => {
    const fileKey = `${fileName}-${fileType}-${serverIp}`;
    
    // Если у нас нет записи об этом файле или прошло больше 5 минут с последнего события
    const now = Date.now();
    const lastTracked = fileEventThrottleRef.current[fileKey] || 0;
    
    if (now - lastTracked > 5 * 60 * 1000) { // 5 минут
      analytics.trackFileOpen(fileName, fileType, serverIp);
      fileEventThrottleRef.current[fileKey] = now;
      return true;
    }
    
    return false;
  };
  
  if (!server) {
    return (
      <div className="no-server">
        <h2>{translate('not_connected')}</h2>
        <p>{translate('use_connect')}</p>
      </div>
    );
  }
  
  const result = fileSystem.getCurrentDirectoryContentForPath(innerPath);
  if (!result.success) {
    return (
      <div className="directory-error">
        <p>{result.message}</p>
      </div>
    );
  }
  
  const { directories, files } = result.content;
  
  const handleDirectoryClick = (dir) => {
    let newPath = innerPath === '/' ? `/${dir}` : `${innerPath}/${dir}`;
    setInnerPath(newPath);
    if (onPathChange) {
      onPathChange(newPath);
    }
  };
  
  const handleFileClick = (file) => {
    const openSafe = (url) => {
      try {
        if (!/^https?:\/\//i.test(url)) return;
        const w = window.open(url, '_blank', 'noopener,noreferrer');
        if (w) w.opener = null;
      } catch {}
    };

    const filePath = innerPath === '/' ? `/${file}` : `${innerPath}/${file}`;
    const fileResult = fileSystem.getFileContent(filePath);

    if (!fileResult.success) return;

    checkAndTrackFile(file, fileResult.type, fileSystem.currentServer);

    if (
      fileResult.type === 'url' ||
      (fileResult.type === 'text' && /^https?:\/\//i.test(fileResult.content.trim()))
    ) {
      openSafe(fileResult.content.trim());

      // для ачивки
      import('../utils/commandProcessor').then(module => {
        const commandProcessor = module.default;
        commandProcessor.unlockAchievement('link_opened', file);
      });

      return;
    }

    const fileObject = {
      title: file,
      content: fileResult.content,
      type: fileResult.type,
    };

    if (fileResult.type === 'text') {
      import('../utils/commandProcessor').then(module => {
        const commandProcessor = module.default;
        const content = fileResult.content.replace(/\\n/g, '\r\n');
        commandProcessor.processLoginInfo(content);
      });
    }

    onExecute(fileObject);
  };
  
  const handleGoUp = () => {
    if (innerPath === '/') return;
    
    const pathParts = innerPath.split('/').filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length === 0 ? '/' : `/${pathParts.join('/')}`;
    setInnerPath(newPath);
    if (onPathChange) {
      onPathChange(newPath);
    }
  };
  
  return (
    <div className="home-browser">
      <div className="directory-path">
        {innerPath}
      </div>
      
      <div className="directory-list-container">
        <ul className="directory-list">
          {innerPath !== '/' && (
            <li 
              className="directory-item directory-item-folder" 
              onClick={handleGoUp}
            >
              <span className="directory-item-icon">⬆️</span>
              <span className="directory-item-name">..</span>
            </li>
          )}
          
          {directories.map(dir => (
            <li 
              key={dir} 
              className="directory-item directory-item-folder"
              onClick={() => handleDirectoryClick(dir)}
            >
              <span className="directory-item-icon">📁</span>
              <span className="directory-item-name">{dir}</span>
            </li>
          ))}
          
          {files.map(file => (
            <li 
              key={file} 
              className="directory-item directory-item-file"
              onClick={() => handleFileClick(file)}
            >
              <span className="directory-item-icon">📄</span>
              <span className="directory-item-name">{file}</span>
            </li>
          ))}
          
          {directories.length === 0 && files.length === 0 && (
            <li className="directory-item-empty">
              {translate('empty_directory')}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};


const TimelineViewer = ({ id, language }) => {
  const timelineData = {
    globalcity: {
      en: [
        { year: 2023, month: 3, title: '', description: 'Joined RedBrixWall as a mobile citybuilder game designer. Learned the ropes, started by developing battlepasses. Rebalanced the Mine meta event' },
        { year: 2023, month: 4, title: '', description: 'Created a Territory and Warehouse expansion offers. Rebalanced the existing Diamond Fund offer.' },
        { year: 2023, month: 5, title: '', description: 'Rebalanced the Fortune wheelspin meta event and the Infinite Treasure offer.' },
        { year: 2023, month: 6, title: '', description: 'Made a level expansion update. Upgraded my previosly made expansion offers for the high-paying whale players.' },
        { year: 2023, month: 7, title: '', description: 'Designed an Airbase project with the military vehicle crafting for the Military mechanic.' },
        { year: 2023, month: 8, title: '', description: 'Designed a competition mechanic for the Airbase project. Design the new schedule for the new players.' },
        { year: 2023, month: 9, title: '', description: 'Started working on the clan mechanics. Rebalanced one of the main core mechanics - Ship deliveries.' },
        { year: 2023, month: 10, title: '', description: 'Completed the Ship deliveries A/B tests. Designed the Halloween event with the competition mechanic.' },
        { year: 2023, month: 11, title: '', description: 'Rebalanced the Kraken attack meta event. Worked on the Black Friday event.' },
        { year: 2023, month: 12, title: '', description: 'Merry Christmas! Reskins, thematical project. Designed a large Motorcade project.' },
        { year: 2024, month: 1, title: '', description: 'Upgraded the Battlepass mechanic. Created thematic reskins for the Happy Valentines day.' },
        { year: 2024, month: 2, title: '', description: 'Designed the Battlepass competition mechanic. Another new schedule for the new players.' },
        { year: 2024, month: 3, title: '', description: 'Designed my most favorite Cargo Delivery mechanic, which led to my first bonus payment!' },
        { year: 2024, month: 4, title: '', description: 'Created one of the most complex game mechanics existing here - Clan Competitions with Seasons.' },
        { year: 2024, month: 5, title: '', description: 'Made VIP subscription experiments. Started a new Gas Development project.' },
        { year: 2024, month: 6, title: '', description: 'Designed a city editing mode. Redesigned the Battlepass documentation for the quick GD development.' },
        { year: 2024, month: 7, title: '', description: 'Started the Cosmodrome project with a cosmo-ship missions mechanic. Designed an ad-skip offer.' },
        { year: 2024, month: 8, title: '', description: 'Added the competition mechanic to my Cargo Delivery.' },
        { year: 2024, month: 9, title: '', description: 'Added the competition mechanic to the Cosmodrome project. Designed the Halloween event (again) with the competition mechanic.' },
        { year: 2024, month: 10, title: '', description: 'Second Cosmodrome project was developed. New additions to the existing mechanic.' },
        { year: 2024, month: 11, title: '', description: 'Super VIP offer - no time constraints, everything is free, a creative mode in our F2P game.' },
        { year: 2024, month: 12, title: '', description: 'The Ski Resort project - first non-event mechanic to change at least a part of the world in our game.' },
        { year: 2025, month: 1, title: '', description: 'Active reskins of the current events - Chinese New Year, Superbowl (I called it a Large Bowl, get it?), Happy Valentines day.' },
        { year: 2025, month: 2, title: '', description: 'Upgrading the Ski Resort project. Upgrading the Gas Development project.' },
        { year: 2025, month: 3, title: '', description: 'Currently automating the GD processes - no more need to do mundane jobs, do the creative ones instead!' },
      ],
      ru: [
        { year: 2023, month: 3, title: '', description: 'Начал работу в RedBrixWall как геймдизайнер мобильного ситибилдера. Начал с разработки боевых пропусков. Ребалансировал мета-ивент Шахта' },
        { year: 2023, month: 4, title: '', description: 'Создал офферы расширения территории и склада. Перебалансил существующий оффер Алмазный фонд.' },
        { year: 2023, month: 5, title: '', description: 'Перебалансил мета-ивент Колесо фортуны и оффер Бесконечное сокровище.' },
        { year: 2023, month: 6, title: '', description: 'Убрал лимит игровых уровней. Улучшил ранее созданные офферы расширения для китов.' },
        { year: 2023, month: 7, title: '', description: 'Разработал проект Авиабаза с созданием техники для военной механики.' },
        { year: 2023, month: 8, title: '', description: 'Разработал механику соревнований для проекта Авиабаза. Ввел новое оперирование для новичков.' },
        { year: 2023, month: 9, title: '', description: 'Начал работу над клановыми механиками. Перебалансил награды одной из основных механик - отправки кораблей.' },
        { year: 2023, month: 10, title: '', description: 'Завершил A/B-тесты отправок кораблей. Разработал событие Хэллоуин с механикой соревнований.' },
        { year: 2023, month: 11, title: '', description: 'Перебалансил мета-ивент Кракен. Работал над событием Чёрная пятница для платящих игроков.' },
        { year: 2023, month: 12, title: '', description: 'С Рождеством! Рескины, тематический проект. Разработал проект Автострада.' },
        { year: 2024, month: 1, title: '', description: 'Улучшил механику боевого пропуска. Создал тематические рескины к Дню Святого Валентина.' },
        { year: 2024, month: 2, title: '', description: 'Разработал механику соревнований для боевого пропуска. Ещё одно оперирование для новичков.' },
        { year: 2024, month: 3, title: '', description: 'Разработал мою самую любимую механику Логистический центр, которая привела к моей первой премии!' },
        { year: 2024, month: 4, title: '', description: 'Создал одну из самых сложных игровых механик - Клановые соревнования с сезонами.' },
        { year: 2024, month: 5, title: '', description: 'Провёл эксперименты с VIP-подпиской. Начал новый проект Газовая Платформа.' },
        { year: 2024, month: 6, title: '', description: 'Задизайнил режим редактирования города. Переработал документацию боевого пропуска для быстрой разработки.' },
        { year: 2024, month: 7, title: '', description: 'Начал проект Космодром с механикой космических миссий. Разработал оффер пропуска рекламы.' },
        { year: 2024, month: 8, title: '', description: 'Добавил механику соревнований к моему Логистическому центру.' },
        { year: 2024, month: 9, title: '', description: 'Добавил механику соревнований к проекту Космодром. Разработал событие на Хэллоуин (снова) с механикой соревнований.' },
        { year: 2024, month: 10, title: '', description: 'Разработан второй проект Космодром. Новые дополнения к существующей механике.' },
        { year: 2024, month: 11, title: '', description: 'Предложение Супер VIP - без временных ограничений, всё бесплатно, творческий режим в нашей F2P игре.' },
        { year: 2024, month: 12, title: '', description: 'Проект Горнолыжный курорт - первая неивентовая механика, визуально меняющая часть мира в нашей игре.' },
        { year: 2025, month: 1, title: '', description: 'Активные рескины текущих событий - Китайский новый год, Суперкубок (хаха Large Bowl), День Святого Валентина.' },
        { year: 2025, month: 2, title: '', description: 'Дополнение проекта Горнолыжный курорт. Еще одна часть проекта Газовая платформа.' },
        { year: 2025, month: 3, title: '', description: 'В настоящее время автоматизирую процессы геймдизайна - больше не нужно выполнять рутинные задания, будем делать только творческие!' },
      ],
    },
    nextrp: {
      en: [
        { year: 2021, month: 12, title: '', description: 'Joined the NEXT-RP team as a game designer. Started working with the game balance.' },
        { year: 2022, month: 1, title: '', description: 'Redesigned the Prison faction for it to be less staying in one place and more socializing.' },
        { year: 2022, month: 2, title: '', description: 'Created and balanced the Weapon Upgrade mechanic with infinite depth.' },
        { year: 2022, month: 3, title: '', description: 'Rebalanced Battlepass rewards. Did not like the non-socializing playerbase, left the team.' }
      ],
      ru: [
        { year: 2021, month: 12, title: '', description: 'Присоединился к команде NEXT-RP в качестве геймдизайнера. Начал работу с балансом игры.' },
        { year: 2022, month: 1, title: '', description: 'Переработал фракцию "ФСИН", чтобы было меньше пребывания на одном месте и больше социализации.' },
        { year: 2022, month: 2, title: '', description: 'Создал и сбалансировал механику улучшения оружия с бесконечной глубиной.' },
        { year: 2022, month: 3, title: '', description: 'Ребалансировал награды боевого пропуска. Не понравилась несоциализирующаяся ментальность игроков, покинул команду.' }
      ],
    },
    samprp: {
      en: [
        { year: 2019, month: 3, title: '', description: 'Partially joined the Samp-Rp team as a moderator for the ideas forum.' },
        { year: 2019, month: 4, title: '', description: 'Started creating my own ideas for the game improvement. First accepted - House interior design.' },
        { year: 2020, month: 5, title: '', description: 'Joined the Samp-Rp team as a trainee game designer. Learned the ropes here.' },
        { year: 2020, month: 8, title: '', description: 'My first released feauture - improvements for the VIP system. Designed a new quest system - got delayed for a year.' },
        { year: 2020, month: 10, title: '', description: 'Designed a new core gameplay for the FBI faction - straying from the control to the undercover work with fake IDs.' },
        { year: 2020, month: 12, title: '', description: 'Started developing mechanics for the Police Faction - a new player search system' },
        { year: 2021, month: 3, title: '', description: 'Worked on a Clan Mechanic with a centralized spawn point - Offices.' },
        { year: 2021, month: 7, title: '', description: 'Designed a new Service call mechanic for the Police/Medic factions and Taxi/Mechanic jobs.' },
        { year: 2021, month: 10, title: '', description: 'Designed an Invite a returning friend feature - social players get their friends back into the game for a reward.' },
        { year: 2022, month: 1, title: '', description: 'Redesigned the ideas forum. Started moderating it.' },
        { year: 2022, month: 3, title: '', description: 'Designed a Daily Quest mechanic with a reward depth of 84 days.' },
        { year: 2022, month: 7, title: '', description: 'Participated in a new Court faction design process and further testing.' },
        { year: 2022, month: 9, title: '', description: 'Designed a new Bus Driver job - made it more balanced and user-friendly, added the first Government-Job interaction.' },
        { year: 2022, month: 11, title: '', description: 'Massive overhaul of the existing Police and Mayor factions - the first one got into the production half a year later.' },
        { year: 2022, month: 12, title: '', description: 'Started planning the new workflow of the GD department.' },
        { year: 2023, month: 1, title: '', description: 'Promoted to a Lead Game Designer. Finally implemented my workflow.' },
        { year: 2023, month: 2, title: '', description: 'Started designing a new house system - making it more than a spawn-point.' },
        { year: 2023, month: 3, title: '', description: 'Designed an Entertainment Center - uniting every system entertainment mechanic in one place.' },
        { year: 2023, month: 4, title: '', description: 'Preparing for opening the new Samp-Rp Underground server. Balancing the old mechanics.' },
        { year: 2023, month: 5, title: '', description: 'Merging two closing servers - rebalancing, preparing players to jump into the new ecosystem.' },
        { year: 2023, month: 6, title: '', description: 'Grand opening! Started moderating the new server.' },
        { year: 2023, month: 8, title: '', description: 'Designed the VIP subscription with multiple layers of monetization.' },
        { year: 2023, month: 9, title: '', description: 'Created the Boosters mechanic, experimenting with replacing the current monetization.' },
        { year: 2023, month: 10, title: '', description: 'Designed a Faction Achievements system with special passive bonuses for active players.' },
        { year: 2023, month: 11, title: '', description: 'Redesigned my first large Daily Quests mechanic for a better gameplay experience.' },
        { year: 2023, month: 12, title: '', description: 'Started working with the client launcher concepts.' },
        { year: 2024, month: 2, title: '', description: 'Designed a Business system remake - it would have been less boring and more awarding for almost every player segment.' },
        { year: 2024, month: 3, title: '', description: 'Designed a Vehicle system remake - complete customization, valuing the social part of the server history.' },
        { year: 2024, month: 4, title: '', description: 'Active work with the launcher - designing the UI, adapting system mechanics, finding custom content.' },
        { year: 2024, month: 5, title: '', description: 'Launcher beta-testing. TBH it was horrible.' },
        { year: 2024, month: 6, title: '', description: 'Grand release of the launcher. Left the team after that.' },
      ],
      ru: [
        { year: 2019, month: 3, title: '', description: 'Частично присоединился к команде Samp-Rp в качестве модератора форума идей.' },
        { year: 2019, month: 4, title: '', description: 'Начал создавать собственные идеи для улучшения игры. Первая принятая - дизайн интерьера дома.' },
        { year: 2020, month: 5, title: '', description: 'Присоединился к команде Samp-Rp в качестве стажёра-геймдизайнера. Научился всему здесь.' },
        { year: 2020, month: 8, title: '', description: 'Моя первая выпущенная механика - улучшения для VIP-системы. Разработал новую систему квестов - задержалась на год.' },
        { year: 2020, month: 10, title: '', description: 'Разработал новый основной геймплей для фракции ФБР - переход от контроля фракций к работе под прикрытием.' },
        { year: 2020, month: 12, title: '', description: 'Начал разрабатывать механики для фракции Полиции - новую систему обыска игроков.' },
        { year: 2021, month: 3, title: '', description: 'Работал над клановой механикой с централизованной точкой возрождения - офисами.' },
        { year: 2021, month: 7, title: '', description: 'Разработал новую механику вызова служб для фракций полиции/медиков и работ такси/механиков.' },
        { year: 2021, month: 10, title: '', description: 'Разработал функцию Пригласи вернувшегося друга - социальные игроки возвращают своих друзей в игру за вознаграждение.' },
        { year: 2022, month: 1, title: '', description: 'Переработал форум идей. Начал его модерировать.' },
        { year: 2022, month: 3, title: '', description: 'Разработал механику ежедневных заданий с глубиной наград в 84 дня.' },
        { year: 2022, month: 7, title: '', description: 'Участвовал в процессе разработки новой фракции Суд и её дальнейшем тестировании.' },
        { year: 2022, month: 9, title: '', description: 'Переделал работу Водитель автобуса - сделал её более сбалансированной и удобной, добавил первое взаимодействие фракции и работы.' },
        { year: 2022, month: 11, title: '', description: 'Масштабная переработка существующих фракций Полиции и Мэрии - первая попала в производство полгода спустя.' },
        { year: 2022, month: 12, title: '', description: 'Начал планирование нового воркфлоу геймдизайна.' },
        { year: 2023, month: 1, title: '', description: 'Повышен до лида. Наконец реализовал свой воркфлоу!' },
        { year: 2023, month: 2, title: '', description: 'Начал разрабатывать новую систему домов - делая её более значимой, чем просто точка спавна.' },
        { year: 2023, month: 3, title: '', description: 'Разработал Центр развлечений - объединение всеъ системных механик развлечений в одном месте.' },
        { year: 2023, month: 4, title: '', description: 'Подготовка к открытию нового сервера Samp-Rp Underground. Балансировка старых механик.' },
        { year: 2023, month: 5, title: '', description: 'Мерж двух закрывающихся серверов - ребаланс, подготовка игроков к переходу в новую экосистему.' },
        { year: 2023, month: 6, title: '', description: 'Торжественное открытие! Начал модерировать новый сервер.' },
        { year: 2023, month: 8, title: '', description: 'Разработал VIP-подписку с несколькими уровнями монетизации.' },
        { year: 2023, month: 9, title: '', description: 'Создал механику бустеров, экспериментируя с заменой текущей монетизации.' },
        { year: 2023, month: 10, title: '', description: 'Разработал систему достижений фракций со специальными пассивными бонусами для активных игроков.' },
        { year: 2023, month: 11, title: '', description: 'Переработал мою первую крупную механику ежедневных заданий для лучшего игрового опыта.' },
        { year: 2023, month: 12, title: '', description: 'Начал работу с концепциями клиентского лаунчера.' },
        { year: 2024, month: 2, title: '', description: 'Дизайн ремейка системы бизнеса - попытались превратить бизнесы в небольшие социальные хабы' },
        { year: 2024, month: 3, title: '', description: 'Дизайн ремейка системы транспортных средств - полная настройка, ценя социальную часть истории сервера.' },
        { year: 2024, month: 4, title: '', description: 'Активная работа с лаунчером - проектирование UI, адаптация системных механик, поиск кастомного контента.' },
        { year: 2024, month: 5, title: '', description: 'Бета-тестирование лаунчера. тбх было ужасно.' },
        { year: 2024, month: 6, title: '', description: 'Грандиозный выпуск лаунчера. После этого покинул команду.' },
      ],
    },
  };

  const timelineInfo = timelineData[id] || {};
  const data = timelineInfo[language] || timelineInfo.en || [];
  
  // debug missing timeline data
  if (!timelineData[id]) {
    console.warn(`Timeline data not found for ID: ${id}`);
  }
  
  const yearGroups = data.reduce((groups, item) => {
    const year = item.year;
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(item);
    return groups;
  }, {});

  const availableYears = Object.keys(yearGroups).map(year => parseInt(year));
  const defaultYear = availableYears.length > 0 ? availableYears[0] : null;
  const [selectedYear, setSelectedYear] = useState(null);
  
  // reset selected year when timeline changes
  React.useEffect(() => {
    setSelectedYear(defaultYear);
  }, [id, defaultYear]);
  
  // validate selected year is available
  React.useEffect(() => {
    if (selectedYear !== null && !availableYears.includes(selectedYear)) {
      setSelectedYear(defaultYear);
    }
  }, [selectedYear, availableYears, defaultYear]);

  const handleYearClick = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
  };
  
  const getMonthName = (month, lang) => {
    const date = new Date(2000, month - 1, 1);
    const monthName = date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'long',
    });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
  };

  if (availableYears.length === 0) {
    return (
      <div className="timeline-viewer">
        <div className="timeline-error">
          Timeline data not available
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-viewer">
      <div className="timeline">
        {Object.keys(yearGroups).map(year => (
          <div
            key={`year-${year}`}
            className={`timeline-year ${selectedYear === parseInt(year) ? 'active' : ''}`}
            onClick={() => handleYearClick(parseInt(year))}
          >
            {year}
          </div>
        ))}
      </div>
      
      {selectedYear && (
        <div className="timeline-details">
          <div className="timeline-months">
            {yearGroups[selectedYear].map((item, index) => (
              <div key={`event-${selectedYear}-${index}`} className="timeline-event">
                <div className="timeline-event-date">
                  {getMonthName(item.month, language)}
                </div>
                <div className="timeline-event-content">
                  {item.title && <h3>{item.title}</h3>}
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ContentBox;