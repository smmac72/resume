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
        { year: 2023, month: 3, title: '', description: 'Joined RedBrixWall as a mobile city builder game designer. Started by developing battle passes and rebalancing the Mine meta event.' },
        { year: 2023, month: 4, title: '', description: 'Created Territory and Warehouse expansion offers. Rebalanced the existing Diamond Fund offer.' },
        { year: 2023, month: 5, title: '', description: 'Rebalanced the Fortune Wheel meta event and the Infinite Treasure offer.' },
        { year: 2023, month: 6, title: '', description: 'Delivered a level cap expansion update. Upgraded previously made expansion offers for high-spending players.' },
        { year: 2023, month: 7, title: '', description: 'Designed the Airbase project — a military vehicle crafting feature for the Military mechanic.' },
        { year: 2023, month: 8, title: '', description: 'Developed a competition mechanic for the Airbase project. Designed a new onboarding schedule for new players.' },
        { year: 2023, month: 9, title: '', description: 'Started working on clan mechanics. Rebalanced one of the core systems — Ship Deliveries.' },
        { year: 2023, month: 10, title: '', description: 'Completed A/B testing for Ship Deliveries. Designed the Halloween event with the competition mechanic.' },
        { year: 2023, month: 11, title: '', description: 'Rebalanced the Kraken Attack meta event. Worked on the Black Friday event.' },
        { year: 2023, month: 12, title: '', description: 'Merry Christmas! Created holiday reskins and designed the large-scale Motorcade project.' },
        { year: 2024, month: 1, title: '', description: 'Upgraded the Battle Pass mechanic and produced Valentine’s Day reskins.' },
        { year: 2024, month: 2, title: '', description: 'Designed a competition mechanic for the Battle Pass and created a new onboarding schedule for beginners.' },
        { year: 2024, month: 3, title: '', description: 'Designed my favorite feature — Cargo Delivery — which earned my first bonus payment!' },
        { year: 2024, month: 4, title: '', description: 'Created one of the most complex mechanics — Clan Competitions with seasonal cycles.' },
        { year: 2024, month: 5, title: '', description: 'Experimented with VIP subscriptions. Started the Gas Development project.' },
        { year: 2024, month: 6, title: '', description: 'Designed a City Editing mode. Updated Battle Pass documentation for faster GD iteration.' },
        { year: 2024, month: 7, title: '', description: 'Started the Cosmodrome project with space mission mechanics. Designed an ad-skip offer.' },
        { year: 2024, month: 8, title: '', description: 'Added the competition mechanic to my Cargo Delivery feature.' },
        { year: 2024, month: 9, title: '', description: 'Expanded the Cosmodrome project with competition mechanics. Designed another Halloween event with competitive elements.' },
        { year: 2024, month: 10, title: '', description: 'Developed the second Cosmodrome project with new mechanic extensions.' },
        { year: 2024, month: 11, title: '', description: 'Created the Super VIP offer — no time limits, full creative mode in our F2P game.' },
        { year: 2024, month: 12, title: '', description: 'Designed the Ski Resort project — the first non-event mechanic that visually changes part of the world.' },
        { year: 2025, month: 1, title: '', description: 'Handled event reskins — Chinese New Year, Super Bowl (or “Large Bowl”), and Valentine’s Day.' },
        { year: 2025, month: 2, title: '', description: 'Upgraded the Ski Resort and Gas Development projects.' },
        { year: 2025, month: 3, title: '', description: 'Automating GD processes — replacing routine work with creative tasks!' },
        { year: 2025, month: 4, title: '', description: 'Leaving the project — passed everything I knew to the newer generations!' },
      ],
      ru: [
        { year: 2023, month: 3, title: '', description: 'Начал работу в RedBrixWall как геймдизайнер мобильного сити-билдера. Начал с разработки боевых пропусков и ребаланса мета-ивента «Шахта».' },
        { year: 2023, month: 4, title: '', description: 'Создал офферы расширения территории и склада. Переработал оффер «Алмазный фонд».' },
        { year: 2023, month: 5, title: '', description: 'Перебалансировал мета-ивент «Колесо фортуны» и оффер «Бесконечное сокровище».' },
        { year: 2023, month: 6, title: '', description: 'Реализовал обновление с расширением уровней. Улучшил ранее созданные офферы расширения для игроков-китов.' },
        { year: 2023, month: 7, title: '', description: 'Разработал проект «Авиабаза» с механикой создания военной техники.' },
        { year: 2023, month: 8, title: '', description: 'Разработал механику соревнований для проекта «Авиабаза». Настроил новое оперирование для новичков.' },
        { year: 2023, month: 9, title: '', description: 'Начал работу над клановыми механиками. Перебалансировал одну из ключевых систем — «Отправки кораблей».' },
        { year: 2023, month: 10, title: '', description: 'Провёл A/B-тесты отправок кораблей. Разработал событие «Хэллоуин» с механикой соревнований.' },
        { year: 2023, month: 11, title: '', description: 'Перебалансировал мета-ивент «Кракен». Работал над событием «Чёрная пятница».' },
        { year: 2023, month: 12, title: '', description: 'Рождественское обновление: рескины и тематический проект. Разработал крупный проект «Автоколонна».' },
        { year: 2024, month: 1, title: '', description: 'Улучшил механику боевого пропуска. Создал тематические рескины ко Дню Святого Валентина.' },
        { year: 2024, month: 2, title: '', description: 'Разработал механику соревнований для боевого пропуска. Настроил новое оперирование для новичков.' },
        { year: 2024, month: 3, title: '', description: 'Разработал любимую механику — «Логистический центр», что принесло мне первую премию!' },
        { year: 2024, month: 4, title: '', description: 'Создал одну из самых сложных игровых механик — «Клановые соревнования» с сезонностью.' },
        { year: 2024, month: 5, title: '', description: 'Провёл эксперименты с VIP-подпиской. Начал проект «Газовая платформа».' },
        { year: 2024, month: 6, title: '', description: 'Разработал режим редактирования города. Переработал документацию боевого пропуска для ускорения GD-процессов.' },
        { year: 2024, month: 7, title: '', description: 'Начал проект «Космодром» с механикой космических миссий. Разработал оффер пропуска рекламы.' },
        { year: 2024, month: 8, title: '', description: 'Добавил механику соревнований к «Логистическому центру».' },
        { year: 2024, month: 9, title: '', description: 'Добавил механику соревнований к проекту «Космодром». Разработал новое событие «Хэллоуин» с соревновательными элементами.' },
        { year: 2024, month: 10, title: '', description: 'Разработан второй проект «Космодром». Добавлены новые элементы к существующей механике.' },
        { year: 2024, month: 11, title: '', description: 'Создал предложение «Супер VIP» — без ограничений по времени, всё бесплатно, творческий режим в F2P-игре.' },
        { year: 2024, month: 12, title: '', description: 'Разработал проект «Горнолыжный курорт» — первую неивентовую механику, изменяющую часть игрового мира.' },
        { year: 2025, month: 1, title: '', description: 'Работал над рескинами текущих событий — Китайский Новый год, Суперкубок (шутливо «Большая миска») и День Святого Валентина.' },
        { year: 2025, month: 2, title: '', description: 'Продолжил разработку проектов «Горнолыжный курорт» и «Газовая платформа».' },
        { year: 2025, month: 3, title: '', description: 'Автоматизирую процессы геймдизайна — меньше рутины, больше творчества!' },
        { year: 2025, month: 4, title: '', description: 'Покинул команду — потомки получили бесконечные таблицы и гайдлайны, державшие проект.' },
      ],
    },
    nextrp: {
      en: [
        { year: 2021, month: 12, title: '', description: 'Joined the NEXT-RP team as a game designer, focusing on overall game balance.' },
        { year: 2022, month: 1, title: '', description: 'Redesigned the Prison faction to make gameplay less stationary and more socially engaging.' },
        { year: 2022, month: 2, title: '', description: 'Designed and balanced the Weapon Upgrade mechanic with infinite progression depth.' },
        { year: 2022, month: 3, title: '', description: 'Rebalanced Battle Pass rewards. Left the team due to the non-social nature of the player community.' },
      ],
      ru: [
        { year: 2021, month: 12, title: '', description: 'Присоединился к команде NEXT-RP в качестве геймдизайнера, сосредоточившись на балансе игры.' },
        { year: 2022, month: 1, title: '', description: 'Переработал фракцию «ФСИН», сделав геймплей менее статичным и более социальным.' },
        { year: 2022, month: 2, title: '', description: 'Разработал и сбалансировал механику улучшения оружия с бесконечной прогрессией.' },
        { year: 2022, month: 3, title: '', description: 'Перебалансировал награды боевого пропуска. Покинул команду из-за низкой вовлечённости игроков в социальные взаимодействия.' },
      ],
    },
    samprp: {
      en: [
        { year: 2019, month: 3, title: '', description: 'Partially joined the Samp-RP team as a moderator of the Ideas forum.' },
        { year: 2019, month: 4, title: '', description: 'Started proposing my own improvement concepts. First one accepted: House interior design.' },
        { year: 2020, month: 5, title: '', description: 'Joined the Samp-RP team as a trainee game designer. Learned the ropes on live tasks.' },
        { year: 2020, month: 8, title: '', description: 'First released feature: VIP system improvements. Designed a new quest system (delayed by a year).' },
        { year: 2020, month: 10, title: '', description: 'Redesigned core gameplay for the FBI faction—shifted from control-focused to undercover play with fake IDs.' },
        { year: 2020, month: 12, title: '', description: 'Began developing mechanics for the Police faction—new player search system.' },
        { year: 2021, month: 3, title: '', description: 'Worked on a Clan system with a centralized spawn point (“Offices”).' },
        { year: 2021, month: 7, title: '', description: 'Designed a Service Call mechanic for Police/Medic factions and Taxi/Mechanic jobs.' },
        { year: 2021, month: 10, title: '', description: 'Designed “Invite a Returning Friend” feature—social players bring friends back for rewards.' },
        { year: 2022, month: 1, title: '', description: 'Redesigned the Ideas forum and took over moderation.' },
        { year: 2022, month: 3, title: '', description: 'Designed a Daily Quests system with 84-day reward depth.' },
        { year: 2022, month: 7, title: '', description: 'Participated in the new Court faction design and subsequent testing.' },
        { year: 2022, month: 9, title: '', description: 'Redesigned the Bus Driver job—more balanced, user-friendly; introduced first Government–Job interaction.' },
        { year: 2022, month: 11, title: '', description: 'Massive overhaul of Police and Mayor factions—the first shipped ~6 months later.' },
        { year: 2022, month: 12, title: '', description: 'Planned a new workflow for the GD department.' },
        { year: 2023, month: 1, title: '', description: 'Promoted to Lead Game Designer. Rolled out my workflow organization-wide.' },
        { year: 2023, month: 2, title: '', description: 'Started designing a new Housing system—more than just a spawn point.' },
        { year: 2023, month: 3, title: '', description: 'Designed an Entertainment Center—unifying all system entertainment mechanics in one hub.' },
        { year: 2023, month: 4, title: '', description: 'Prepared the new Samp-RP Underground server; balanced legacy mechanics.' },
        { year: 2023, month: 5, title: '', description: 'Merged two closing servers—rebalance, onboarding players into the new ecosystem.' },
        { year: 2023, month: 6, title: '', description: 'Grand opening! Began moderating the new server.' },
        { year: 2023, month: 8, title: '', description: 'Designed a multi-tier VIP subscription.' },
        { year: 2023, month: 9, title: '', description: 'Created the Boosters mechanic, experimenting with alternative monetization.' },
        { year: 2023, month: 10, title: '', description: 'Designed Faction Achievements with passive bonuses for active players.' },
        { year: 2023, month: 11, title: '', description: 'Redesigned my first large Daily Quests system for better UX.' },
        { year: 2023, month: 12, title: '', description: 'Began working on client launcher concepts.' },
        { year: 2024, month: 2, title: '', description: 'Business system remake—turning businesses into small social hubs.' },
        { year: 2024, month: 3, title: '', description: 'Vehicle system remake—full customization, valuing server history and social identity.' },
        { year: 2024, month: 4, title: '', description: 'Active launcher work—UI design, system integration, sourcing custom content.' },
        { year: 2024, month: 5, title: '', description: 'Launcher beta testing—identified major issues and improvement areas.' },
        { year: 2024, month: 6, title: '', description: 'Grand release of the launcher. Left the team afterward.' },
      ],
      ru: [
        { year: 2019, month: 3, title: '', description: 'Частично присоединился к команде Samp-RP как модератор форума идей.' },
        { year: 2019, month: 4, title: '', description: 'Начал предлагать собственные концепты улучшений. Первая принятая идея: дизайн интерьера домов.' },
        { year: 2020, month: 5, title: '', description: 'Присоединился к команде в роли стажёра-геймдизайнера. Освоил процессы на боевых задачах.' },
        { year: 2020, month: 8, title: '', description: 'Первая выпущенная фича: улучшения VIP-системы. Спроектировал новую систему квестов (задержалась на год).' },
        { year: 2020, month: 10, title: '', description: 'Переработал core-геймплей фракции ФБР — от контроля к работе под прикрытием с поддельными документами.' },
        { year: 2020, month: 12, title: '', description: 'Начал разработку механик для фракции Полиции — новая система обыска игроков.' },
        { year: 2021, month: 3, title: '', description: 'Работал над клановой системой с централизованной точкой возрождения («Офисы»).' },
        { year: 2021, month: 7, title: '', description: 'Спроектировал механику вызова служб для фракций Полиции/Медиков и работ Такси/Механиков.' },
        { year: 2021, month: 10, title: '', description: 'Сделал фичу «Пригласи вернувшегося друга» — социальные игроки возвращают друзей за награду.' },
        { year: 2022, month: 1, title: '', description: 'Переработал форум идей и взял на себя модерацию.' },
        { year: 2022, month: 3, title: '', description: 'Спроектировал систему ежедневных заданий с глубиной наград 84 дня.' },
        { year: 2022, month: 7, title: '', description: 'Участвовал в дизайне новой фракции Суд и её тестировании.' },
        { year: 2022, month: 9, title: '', description: 'Переделал работу Водитель автобуса — баланс, удобство; добавил первое взаимодействие Власти и Работы.' },
        { year: 2022, month: 11, title: '', description: 'Масштабно переработал фракции Полиции и Мэрии — первая ушла в прод ~через полгода.' },
        { year: 2022, month: 12, title: '', description: 'Спланировал новый воркфлоу отдела геймдизайна.' },
        { year: 2023, month: 1, title: '', description: 'Повышен до лида. Внедрил свой воркфлоу в команде.' },
        { year: 2023, month: 2, title: '', description: 'Начал дизайн новой системы домов — больше, чем просто точка спавна.' },
        { year: 2023, month: 3, title: '', description: 'Спроектировал Центр развлечений — единый хаб всех развлекательных механик.' },
        { year: 2023, month: 4, title: '', description: 'Готовил сервер Samp-RP Underground; балансировал наследованные механики.' },
        { year: 2023, month: 5, title: '', description: 'Объединил два закрывающихся сервера — ребаланс и подготовка игроков к новой экосистеме.' },
        { year: 2023, month: 6, title: '', description: 'Торжественный запуск! Начал модерировать новый сервер.' },
        { year: 2023, month: 8, title: '', description: 'Спроектировал многоуровневую VIP-подписку.' },
        { year: 2023, month: 9, title: '', description: 'Создал механику Бустеров — эксперименты с альтернативной монетизацией.' },
        { year: 2023, month: 10, title: '', description: 'Спроектировал Систему достижений фракций с пассивными бонусами активным игрокам.' },
        { year: 2023, month: 11, title: '', description: 'Переработал свою первую крупную систему ежедневных заданий для лучшего UX.' },
        { year: 2023, month: 12, title: '', description: 'Приступил к концептам клиентского лаунчера.' },
        { year: 2024, month: 2, title: '', description: 'Ремейк системы бизнеса — превращаем бизнесы в небольшие социальные хабы.' },
        { year: 2024, month: 3, title: '', description: 'Ремейк системы транспорта — полная кастомизация, ценим историю сервера и социальную идентичность.' },
        { year: 2024, month: 4, title: '', description: 'Активная работа над лаунчером — UI, интеграция систем, поиск кастомного контента.' },
        { year: 2024, month: 5, title: '', description: 'Бета-тест лаунчера — выявлены критичные проблемы и зоны улучшений.' },
        { year: 2024, month: 6, title: '', description: 'Грандиозный релиз лаунчера. После релиза покинул команду.' },
      ],
    },
    majesticrp: {
      en: [
        { year: 2025, month: 5, title: '', description: 'Joined the Majestic RP team. Documented all faction features for reference in a parallel project.' },
        { year: 2025, month: 6, title: '', description: 'Delivered the first production-ready feature — used the Blip API to create in-game map infoboxes.' },
        { year: 2025, month: 7, title: '', description: 'Produced several concept drafts — redesigned the Phone feature and proposed browser-game integration. Both were sent to backlog.' },
        { year: 2025, month: 8, title: '', description: 'Owned the School Event feature — designed documentation, balance, asset list, and feature goals.' },
        { year: 2025, month: 9, title: '', description: 'Supported School Event development across teams. After release, started working on the Builder Job feature (a cooperative task system for new players).' },
        { year: 2025, month: 10, title: '', description: 'Supported Builder Job feature delivery with cross-team coordination. Began working on player retention through the new-player questline.' },
      ],
      ru: [
        { year: 2025, month: 5, title: '', description: 'Присоединился к команде Majestic RP. Подготовил документацию по фракционным фичам для использования в соседнем проекте.' },
        { year: 2025, month: 6, title: '', description: 'Реализовал первую продакшн-фичу — использовал Blip API для создания информационных плашек на карте.' },
        { year: 2025, month: 7, title: '', description: 'Разработал несколько концепций — переработка Телефона и интеграция браузерных игр. Обе идеи отправлены в бэклог.' },
        { year: 2025, month: 8, title: '', description: 'Вёл Школьное событие: документация, баланс, ассет-лист и цели фичи.' },
        { year: 2025, month: 9, title: '', description: 'Сопровождал разработку Школьного события до релиза. После — начал работу над фичей Строителя для новичков (кооперативная механика).' },
        { year: 2025, month: 10, title: '', description: 'Поддерживал разработку работы Строителя, участвовал в межкомандной координации. Начал проект по удержанию новичков через стартовый квест.' },
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