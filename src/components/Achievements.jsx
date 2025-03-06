import React, { useState, useEffect } from 'react';
import commandProcessor from '../utils/commandProcessor';

const Achievements = ({ language }) => {
  const achievements = commandProcessor.getAchievements();
  const totalAchievements = 8; // Теперь у нас 8 достижений
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  
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
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-tooltip">
                <div className="achievement-tooltip-title">
                  {achievement.title[language] || achievement.title.en}
                </div>
                <div className="achievement-tooltip-desc">
                  {achievement.description[language] || achievement.description.en}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Если нет достижений, показываем заблокированное сообщение
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
  
  // Если идет анимация разблокировки
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
  
  // Нормальный вид с достижениями
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