import React, { useState, useEffect, useRef } from 'react';
import commandProcessor from '../utils/commandProcessor';

const Achievements = ({ language }) => {
  const [achievements] = useState(commandProcessor.getAchievements());
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const tooltipTimeout = useRef(null);
  const containerRefs = useRef({});
  const totalAchievements = 8;

  // defining achievements and their details
  const achievementDetails = {
    any_file: {
      icon: '📄',
      nameEn: 'File Explorer',
      nameRu: 'Исследователь файлов',
      descriptionEn: 'Open any file',
      descriptionRu: 'Откройте любой файл'
    },
    image_opened: {
      icon: '🖼️',
      nameEn: 'Image Viewer',
      nameRu: 'Просмотрщик изображений',
      descriptionEn: 'Open an image file',
      descriptionRu: 'Откройте изображение'
    },
    link_opened: {
      icon: '🌐',
      nameEn: 'Web Navigator',
      nameRu: 'Веб-навигатор',
      descriptionEn: 'Open a web link',
      descriptionRu: 'Откройте веб-ссылку'
    },
    timeline_opened: {
      icon: '📅',
      nameEn: 'Researcher',
      nameRu: 'Исследователь',
      descriptionEn: 'View a timeline',
      descriptionRu: 'Просмотрите хронологию'
    },
    music_played: {
      icon: '🎵',
      nameEn: 'DJ Eban',
      nameRu: 'DJ-профессионал',
      descriptionEn: 'Play some music',
      descriptionRu: 'Включите музыку'
    },
    language_changed: {
      icon: '🌍',
      nameEn: 'Mr.Worldwide',
      nameRu: 'Питбуль',
      descriptionEn: 'Change the system language',
      descriptionRu: 'Измените язык системы'
    },
    logins_found: {
      icon: '🔑',
      nameEn: 'Le Hacker',
      nameRu: 'Искатель паролей',
      descriptionEn: 'Discover login credentials',
      descriptionRu: 'Найдите учетные данные для входа'
    },
    secret_server_access: {
      icon: '🕵️',
      nameEn: 'Cow Level',
      nameRu: 'Cow Level',
      descriptionEn: 'Moo Moo Server',
      descriptionRu: 'Moo Moo Server'
    },
  };

  // unlocking animation
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

  // clean up any timers when component unmounts
  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  // get all achievement types
  const allAchievementTypes = Object.keys(achievementDetails);
  
  // get tooltip position class based on the icon's position in the grid
  const getTooltipPositionClass = (index) => {
    const row = Math.floor(index / 4); // only four icons per row
    const col = index % 4;
    
    let positionClass = '';
    
    // determine vertical position (top/bottom)
    if (row === 0) {
      positionClass += 'tooltip-top '; // show tooltip ABOVE for top row
    } else {
      positionClass += 'tooltip-bottom '; // show tooltip BELOW for bottom row
    }
    
    // determine horizontal alignment (left/center/right)
    if (col === 0) {
      positionClass += 'tooltip-left';
    } else if (col === 3) {
      positionClass += 'tooltip-right';
    } else {
      positionClass += 'tooltip-center';
    }
    
    return positionClass;
  };

  // check if mouse is over container
  const checkHover = (type) => {
    const container = containerRefs.current[type];
    if (!container) return;
    const rect = container.getBoundingClientRect();
    
    if (
      rect &&
      window.event && 
      window.event.clientX >= rect.left &&
      window.event.clientX <= rect.right &&
      window.event.clientY >= rect.top &&
      window.event.clientY <= rect.bottom
    ) {
      // keep tooltip open
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
        tooltipTimeout.current = null;
      }
      
      if (activeTooltip !== type) {
        setActiveTooltip(type);
      }
      
      requestAnimationFrame(() => checkHover(type));
    } else {
      // schedule tooltip to hide
      if (!tooltipTimeout.current) {
        tooltipTimeout.current = setTimeout(() => {
          setActiveTooltip(null);
          tooltipTimeout.current = null;
        }, 500);
      }
    }
  };

  // handler for showing tooltip
  const handleMouseEnter = (type) => {
    if (tooltipTimeout.current) {
      clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = null;
    }
    
    setActiveTooltip(type);
    // start checking for hover status
    requestAnimationFrame(() => checkHover(type));
  };

  // render tooltip for an achievement
  const renderTooltip = (type, index) => {
    const details = achievementDetails[type];
    if (!details) return null;
    
    const positionClass = getTooltipPositionClass(index);

    return (
      <div className={`achievement-tooltip ${positionClass}`}>
        <div className="tooltip-title">
          {language === 'ru' ? details.nameRu : details.nameEn}
        </div>
        <div className="tooltip-description">
          {language === 'ru' ? details.descriptionRu : details.descriptionEn}
        </div>
      </div>
    );
  };

  // render achievement grid - icons with tooltips
  const renderAchievementGrid = () => {
    return (
      <div className="achievements-grid">
        {allAchievementTypes.map((type, index) => {
          const achieved = achievements.some(a => a.type === type);
          const details = achievementDetails[type] || { icon: '❓' };
          
          return (
            <div
              key={type}
              className={`achievement-icon-container ${achieved ? 'achieved' : 'locked'}`}
              onMouseEnter={() => handleMouseEnter(type)}
              ref={el => containerRefs.current[type] = el}
            >
              <div className="achievement-icon">{details.icon}</div>
              {activeTooltip === type && renderTooltip(type, index)}
            </div>
          );
        })}
      </div>
    );
  };

  // if no achievements, show locked message, otherwise show grid
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
