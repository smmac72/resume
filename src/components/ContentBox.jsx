import React, { useEffect, useState } from 'react';
import fileSystem from '../utils/fileSystem';
import '../styles/ContentBox.css';

const ContentBox = ({ language, server, tabs, activeTab, onTabChange, onTabClose, onExecute, currentPath, onPathChange }) => {
  const [localPath, setLocalPath] = useState(currentPath);
  
  // sync local path with overall path, include server changing
  useEffect(() => {
    setLocalPath(currentPath);
  }, [currentPath]);
  useEffect(() => {
    setLocalPath('/');
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
        {renderContent()}
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
    
    // for achievement purposes
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
    
    // get file based on its type
    switch (tab.type) {
      case 'pdf':
        const pdfUrl = tab.content.substring(4);
        return (
          <div className="content-pdf">
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
          <div className="content-image">
            <img src={`/images/${imageUrl}`} alt={tab.title} />
          </div>
        );
      case 'timeline':
        const timelineId = tab.content.substring(9);
        return <TimelineViewer id={timelineId} language={language} />;
      default:
        return (
          <div className="content-text">
            <pre>{tab.content}</pre>
          </div>
        );
    }
  }
};

// fileview component
const FileBrowser = ({ server, language, onExecute, currentPath, onPathChange }) => {
  const [innerPath, setInnerPath] = useState(currentPath);
  
  useEffect(() => {
    setInnerPath(currentPath);
  }, [currentPath]);
  
  if (!server) {
    return (
      <div className="no-server">
        <h2>{language === 'ru' ? 'Не подключен к серверу' : 'Not connected to any server'}</h2>
        <p>{language === 'ru' ? 'Используйте команду "connect" для подключения' : 'Use the "connect" command to connect to a server'}</p>
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
    const filePath = innerPath === '/' ? `/${file}` : `${innerPath}/${file}`;
    const fileResult = fileSystem.getFileContent(filePath);
    
    if (fileResult.success) {
      // url checking for opening _blank
      if (fileResult.type === 'url' || 
          (fileResult.type === 'text' && 
           (fileResult.content.trim().startsWith('http://') || 
            fileResult.content.trim().startsWith('https://')))) {
        window.open(fileResult.content.trim(), '_blank');
        
        // for achievement purposes
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
      
      // analyze credentials
      if (fileResult.type === 'text') {
        import('../utils/commandProcessor').then(module => {
          const commandProcessor = module.default;
          const content = fileResult.content.replace(/\\n/g, '\r\n');
          commandProcessor.processLoginInfo(content);
        });
      }
      
      onExecute(fileObject);
    }
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
              <span>..</span>
            </li>
          )}
          
          {directories.map(dir => (
            <li 
              key={dir} 
              className="directory-item directory-item-folder"
              onClick={() => handleDirectoryClick(dir)}
            >
              <span className="directory-item-icon">📁</span>
              <span>{dir}</span>
            </li>
          ))}
          
          {files.map(file => (
            <li 
              key={file} 
              className="directory-item directory-item-file"
              onClick={() => handleFileClick(file)}
            >
              <span className="directory-item-icon">📄</span>
              <span>{file}</span>
            </li>
          ))}
          
          {directories.length === 0 && files.length === 0 && (
            <li className="directory-item-empty">
              {language === 'ru' ? 'Пустая директория' : 'Empty directory'}
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
        { year: 2023, month: 12, title: '', description: 'Merry Christmas. Reskins, thematical project. Designed a large Motorcade project.' },
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
        { year: 2018, month: 1, title: 'Начало карьеры', description: 'Первая работа в качестве младшего разработчика' },
        { year: 2019, month: 6, title: 'Повышение', description: 'Повышен до разработчика среднего уровня' },
        { year: 2020, month: 3, title: 'Новый проект', description: 'Начал работать над крупным проектом' },
        { year: 2021, month: 9, title: 'Старшая должность', description: 'Повышен до старшего разработчика' },
        { year: 2022, month: 5, title: 'Руководство', description: 'Стал руководителем команды' },
        { year: 2023, month: 2, title: 'Архитектура', description: 'Перешел на роль архитектора решений' },
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
        { year: 2018, month: 3, title: 'Веб-разработка', description: 'Сертификат по основам веб-разработки' },
        { year: 2019, month: 1, title: 'JavaScript', description: 'Продвинутое программирование на JavaScript' },
        { year: 2020, month: 8, title: 'React', description: 'Сертификация по React и Redux' },
        { year: 2021, month: 5, title: 'Облако', description: 'AWS Certified Solutions Architect' },
        { year: 2022, month: 11, title: 'DevOps', description: 'Сертификат инженера DevOps' },
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
        { year: 2018, month: 3, title: 'Веб-разработка', description: 'Сертификат по основам веб-разработки' },
        { year: 2019, month: 1, title: 'JavaScript', description: 'Продвинутое программирование на JavaScript' },
        { year: 2020, month: 8, title: 'React', description: 'Сертификация по React и Redux' },
        { year: 2021, month: 5, title: 'Облако', description: 'AWS Certified Solutions Architect' },
        { year: 2022, month: 11, title: 'DevOps', description: 'Сертификат инженера DevOps' },
      ],
    },
  };

  // Получение данных временной шкалы для указанного ID и языка
  const data = timelineData[id] ? timelineData[id][language] || timelineData[id].en : [];
  
  // Группировка по годам
  const yearGroups = data.reduce((groups, item) => {
    const year = item.year;
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(item);
    return groups;
  }, {});

  // Состояние для выбранного года
  const [selectedYear, setSelectedYear] = useState(data.length > 0 ? data[0].year : null);

  // Обработка клика по году
  const handleYearClick = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
  };
  
  // Получение имени месяца в правильном регистре
  const getMonthName = (month, lang) => {
    const date = new Date(2000, month - 1, 1);
    const monthName = date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', {
      month: 'long',
    });
    return monthName.toUpperCase();
  };

  return (
    <div className="timeline-viewer">
      <div className="timeline">
        {Object.keys(yearGroups).map(year => (
          <div
            key={year}
            className={`timeline-year ${selectedYear === parseInt(year) ? 'active' : ''}`}
            onClick={() => handleYearClick(parseInt(year))}
          >
            {year}
          </div>
        ))}
      </div>
      
      {selectedYear && (
        <div className="timeline-details">
          <h2>{selectedYear}</h2>
          <div className="timeline-months">
            {yearGroups[selectedYear].map((item, index) => (
              <div key={index} className="timeline-event">
                <div className="timeline-event-date">
                  {getMonthName(item.month, language)}
                </div>
                <div className="timeline-event-content">
                  <h3>{item.title}</h3>
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