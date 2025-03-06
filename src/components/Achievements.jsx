import React, { useState, useEffect } from 'react';
import commandProcessor from '../utils/commandProcessor';

const Achievements = ({ language }) => {
  const achievements = commandProcessor.getAchievements();
  const totalAchievements = commandProcessor.availableAchievements.length;
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  
  // Check if achievements were just unlocked
  useEffect(() => {
    if (commandProcessor.achievementsUnlocked && achievements.length > 0) {
      setShowUnlockAnimation(true);
      
      // Reset the flag
      commandProcessor.achievementsUnlocked = false;
      
      // Show animation for 3 seconds
      const timer = setTimeout(() => {
        setShowUnlockAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [achievements.length]);
  
  // Define achievement details
  const achievementDetails = {
    server_connection: {
      en: 'Connected to server',
      ru: 'Подключение к серверу',
      icon: '🖥️',
      desc: {
        en: 'Successfully connected to a server',
        ru: 'Успешно подключен к серверу'
      }
    },
    first_login: {
      en: 'Authenticated to server',
      ru: 'Аутентификация на сервере',
      icon: '🔐',
      desc: {
        en: 'Successfully logged in to a server',
        ru: 'Успешно выполнен вход на сервер'
      }
    },
    logins_found: {
      en: 'Found credentials',
      ru: 'Найдены данные',
      icon: '📜',
      desc: {
        en: 'Found login credentials in a file',
        ru: 'Найдены учетные данные в файле'
      }
    },
    secret_server_access: {
      en: 'Secret server',
      ru: 'Секретный сервер',
      icon: '🔒',
      desc: {
        en: 'Accessed a protected server',
        ru: 'Получен доступ к защищенному серверу'
      }
    },
    file_executed: {
      en: 'Executed file',
      ru: 'Выполнен файл',
      icon: '📂',
      desc: {
        en: 'Executed a file using run command',
        ru: 'Выполнен файл с помощью команды run'
      }
    },
    timeline_opened: {
      en: 'Timeline',
      ru: 'Таймлайн',
      icon: '📅',
      desc: {
        en: 'Opened a timeline file',
        ru: 'Открыт файл таймлайна'
      }
    },
    image_opened: {
      en: 'Image viewed',
      ru: 'Просмотр изображения',
      icon: '🖼️',
      desc: {
        en: 'Opened an image file',
        ru: 'Открыт файл изображения'
      }
    },
    link_opened: {
      en: 'Link opened',
      ru: 'Открыта ссылка',
      icon: '🔗',
      desc: {
        en: 'Opened a web link',
        ru: 'Открыта веб-ссылка'
      }
    },
    language_changed: {
      en: 'Language',
      ru: 'Язык',
      icon: '🌐',
      desc: {
        en: 'Changed the interface language',
        ru: 'Изменен язык интерфейса'
      }
    },
    music_played: {
      en: 'Music',
      ru: 'Музыка',
      icon: '🎵',
      desc: {
        en: 'Played background music',
        ru: 'Воспроизведена фоновая музыка'
      }
    },
  };
  
  // Create a grid of achievements - filled and empty placeholders
  const renderAchievementGrid = () => {
    const achievementTypes = commandProcessor.availableAchievements;
    const rows = Math.ceil(achievementTypes.length / 5);
    
    const grid = [];
    for (let i = 0; i < rows; i++) {
      const rowItems = [];
      for (let j = 0; j < 5; j++) {
        const index = i * 5 + j;
        if (index < achievementTypes.length) {
          const type = achievementTypes[index];
          const achieved = achievements.some(a => a.type === type);
          const details = achievementDetails[type] || {
            en: type,
            ru: type,
            icon: '🏆',
            desc: {
              en: 'Achievement unlocked',
              ru: 'Достижение разблокировано'
            }
          };
          
          rowItems.push(
            <div 
              key={type} 
              className={`achievement-icon-container ${achieved ? 'achieved' : 'locked'}`}
            >
              <div className="achievement-icon">{details.icon}</div>
              <div className="achievement-tooltip">{details.desc[language] || details.desc.en}</div>
            </div>
          );
        }
      }
      grid.push(<div key={`row-${i}`} className="achievement-row">{rowItems}</div>);
    }
    
    return grid;
  };
  
  // If no achievements, show locked message
  if (achievements.length === 0) {
    return (
      <>
        <div className="achievements-header-line">
          {language === 'ru' ? 'Достижения' : 'Achievements'}: 0/{totalAchievements}
        </div>
        <div className="achievements-locked">
          {language === 'ru' ? 'ДОСТИЖЕНИЯ ЗАБЛОКИРОВАНЫ' : 'ACHIEVEMENTS LOCKED'}
        </div>
      </>
    );
  }
  
  // If showing unlock animation
  if (showUnlockAnimation) {
    return (
      <>
        <div className="achievements-header-line">
          {language === 'ru' ? 'Достижения' : 'Achievements'}: {achievements.length}/{totalAchievements}
        </div>
        <div className="achievements-unlocked-animation">
          {language === 'ru' ? 'ДОСТИЖЕНИЯ РАЗБЛОКИРОВАНЫ' : 'ACHIEVEMENTS UNLOCKED'}
        </div>
      </>
    );
  }
  
  // Normal view with achievements
  return (
    <>
      <div className="achievements-header-line">
        {language === 'ru' ? 'Достижения' : 'Achievements'}: {achievements.length}/{totalAchievements}
      </div>
      <div className="achievements-grid">
        {renderAchievementGrid()}
      </div>
    </>
  );
};

export default Achievements;
