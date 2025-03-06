import React, { useState, useEffect } from 'react';
import commandProcessor from '../utils/commandProcessor';

const Achievements = ({ language }) => {
  const [achievements, setAchievements] = useState(commandProcessor.getAchievements());
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, visible: false, content: null });
  const totalAchievements = 8;

  // Определение всех возможных достижений
  const allAchievements = [
    {
      type: 'any_file',
      icon: '📄',
      title: {
        en: 'File Explorer',
        ru: 'Исследователь файлов'
      },
      description: {
        en: 'Opened any file',
        ru: 'Открыл любой файл'
      }
    },
    {
      type: 'image_opened',
      icon: '🖼️',
      title: {
        en: 'Image Viewer',
        ru: 'Просмотр изображений'
      },
      description: {
        en: 'Opened an image',
        ru: 'Открыл изображение'
      }
    },
    {
      type: 'link_opened',
      icon: '🌐',
      title: {
        en: 'Web Explorer',
        ru: 'Веб-исследователь'
      },
      description: {
        en: 'Opened a website',
        ru: 'Открыл сайт'
      }
    },
    {
      type: 'timeline_opened',
      icon: '📅',
      title: {
        en: 'Time Traveler',
        ru: 'Путешественник во времени'
      },
      description: {
        en: 'Opened a timeline',
        ru: 'Открыл временную шкалу'
      }
    },
    {
      type: 'music_played',
      icon: '🎵',
      title: {
        en: 'DJ Mode',
        ru: 'Режим DJ'
      },
      description: {
        en: 'Played background music',
        ru: 'Включил фоновую музыку'
      }
    },
    {
      type: 'language_changed',
      icon: '🌍',
      title: {
        en: 'Polyglot',
        ru: 'Полиглот'
      },
      description: {
        en: 'Changed interface language',
        ru: 'Сменил язык интерфейса'
      }
    },
    {
      type: 'logins_found',
      icon: '🔑',
      title: {
        en: 'Credentials Hunter',
        ru: 'Охотник за учетками'
      },
      description: {
        en: 'Found login:password',
        ru: 'Нашел логин:пароль'
      }
    },
    {
      type: 'secret_server_access',
      icon: '🕵️',
      title: {
        en: 'Secret Access',
        ru: 'Секретный доступ'
      },
      description: {
        en: 'Connected to server 31.31.196.69',
        ru: 'Подключился к серверу 31.31.196.69'
      }
    }
  ];

  // Обработчик наведения на достижение
  const handleMouseEnter = (e, achievement) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipContent = (
      <>
        <div className="achievement-tooltip-title">
          {achievement.title[language] || achievement.title.en}
        </div>
        <div className="achievement-tooltip-desc">
          {achievement.description[language] || achievement.description.en}
        </div>
      </>
    );

    // Определение позиции тултипа
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;

    let x = rect.left + rect.width / 2;
    let y = rect.top;

    // Вертикальное позиционирование
    if (spaceBelow > spaceAbove) {
      // Больше места снизу
      y = rect.bottom;
    } else {
      // Больше места сверху
      y = rect.top - 10;
    }

    // Горизонтальное позиционирование
    if (spaceLeft < 60) {
      // Слева мало места
      x = rect.right + 15;
    } else if (spaceRight < 60) {
      // Справа мало места
      x = rect.left - 15;
    }

    setTooltipPosition({ 
      x, 
      y, 
      visible: true, 
      content: tooltipContent 
    });
  };

  // Обработчик ухода мыши
  const handleMouseLeave = () => {
    setTooltipPosition(prev => ({ ...prev, visible: false }));
  };

  // Рендер сетки достижений
  const renderAchievementGrid = () => {
    return (
      <div className="achievements-grid">
        {allAchievements.map((achievement, index) => {
          const achieved = achievements.some(a => a.type === achievement.type);
          
          return (
            <div 
              key={achievement.type} 
              className={`achievement-icon-container ${achieved ? 'achieved' : 'locked'}`}
              onMouseEnter={(e) => handleMouseEnter(e, achievement)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="achievement-icon">{achievement.icon}</div>
            </div>
          );
        })}

        {tooltipPosition.visible && (
          <div 
            className="achievement-tooltip" 
            style={{
              position: 'fixed',
              top: `${tooltipPosition.y}px`,
              left: `${tooltipPosition.x}px`,
              transform: 'translate(-50%, -100%)',
              opacity: 1
            }}
          >
            {tooltipPosition.content}
          </div>
        )}
      </div>
    );
  };

  // Эффект для отслеживания разблокировки достижений
  useEffect(() => {
    if (commandProcessor.achievementsUnlocked && achievements.length > 0) {
      setShowUnlockAnimation(true);
      commandProcessor.achievementsUnlocked = false;
      
      const timer = setTimeout(() => {
        setShowUnlockAnimation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [achievements.length]);

  // Условный рендеринг для различных состояний достижений
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
  
  return (
    <>
      <div className="achievements-header-line">
        {language === 'ru' ? 'Достижения' : 'Achievements'}: {achievements.length}/{totalAchievements}
      </div>
      {renderAchievementGrid()}
    </>
  );
};

export default Achievements;