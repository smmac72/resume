import React, { useState, useEffect } from 'react';
import commandProcessor from '../utils/commandProcessor';

const Achievements = ({ language }) => {
  // Получаем текущие достижения
  const [achievements, setAchievements] = useState(commandProcessor.getAchievements());
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);
  const totalAchievements = 8;

  // Определение всех достижений: оставляем только тип и иконку
  const allAchievements = [
    {
      type: 'any_file',
      icon: '📄',
    },
    {
      type: 'image_opened',
      icon: '🖼️',
    },
    {
      type: 'link_opened',
      icon: '🌐',
    },
    {
      type: 'timeline_opened',
      icon: '📅',
    },
    {
      type: 'music_played',
      icon: '🎵',
    },
    {
      type: 'language_changed',
      icon: '🌍',
    },
    {
      type: 'logins_found',
      icon: '🔑',
    },
    {
      type: 'secret_server_access',
      icon: '🕵️',
    },
  ];

  // Эффект для анимации разблокировки достижений
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

  // Рендер сетки достижений: каждый бокс содержит только иконку достижения
  const renderAchievementGrid = () => {
    return (
      <div className="achievements-grid">
        {allAchievements.map((achievement) => {
          const achieved = achievements.some(a => a.type === achievement.type);
          return (
            <div
              key={achievement.type}
              className={`achievement-icon-container ${achieved ? 'achieved' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Условный рендеринг для разных состояний
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
