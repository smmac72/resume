import React, { useEffect, useState } from 'react';
import fileSystem from '../utils/fileSystem';
import '../styles/ContentBox.css';

const ContentBox = ({ language, server, tabs, activeTab, onTabChange, onTabClose, onExecute, currentPath, onPathChange }) => {
  const [localPath, setLocalPath] = useState(currentPath);
  
  // Синхронизируем путь при изменении извне
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

  // Рендер контента в зависимости от активной вкладки
  function renderContent() {
    // Если активная вкладка 0, показываем домашнюю (просмотр файлов)
    if (activeTab === 0) {
      return <FileBrowser 
        server={server} 
        language={language} 
        onExecute={onExecute} 
        currentPath={localPath}
        onPathChange={onPathChange}
      />;
    }
    
    // Иначе показываем содержимое вкладки
    const tab = tabs[activeTab - 1];
    if (!tab) return null;
    
    // Извлечение содержимого в зависимости от типа
    switch (tab.type) {
      case 'pdf':
        const pdfUrl = tab.content.substring(4); // Удаление префикса 'pdf:'
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
        const imageUrl = tab.content.substring(6); // Удаление префикса 'image:'
        return (
          <div className="content-image">
            <img src={`/images/${imageUrl}`} alt={tab.title} />
          </div>
        );
      case 'timeline':
        const timelineId = tab.content.substring(9); // Удаление префикса 'timeline:'
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

// Компонент просмотра файлов
const FileBrowser = ({ server, language, onExecute, currentPath, onPathChange }) => {
  const [innerPath, setInnerPath] = useState(currentPath);
  
  // Обновление внутреннего пути при изменении внешнего
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
  
  // Получение содержимого текущей директории
  const result = fileSystem.getCurrentDirectoryContentForPath(innerPath);
  
  if (!result.success) {
    return (
      <div className="directory-error">
        <p>{result.message}</p>
      </div>
    );
  }
  
  const { directories, files } = result.content;
  
  // Обработка клика по директории
  const handleDirectoryClick = (dir) => {
    let newPath = innerPath === '/' ? `/${dir}` : `${innerPath}/${dir}`;
    setInnerPath(newPath);
    if (onPathChange) {
      onPathChange(newPath);
    }
  };
  
  // Обработка клика по файлу
  const handleFileClick = (file) => {
    const filePath = innerPath === '/' ? `/${file}` : `${innerPath}/${file}`;
    const fileResult = fileSystem.getFileContent(filePath);
    
    if (fileResult.success) {
      const fileObject = {
        title: file,
        content: fileResult.content,
        type: fileResult.type,
      };
      
      // Если это текстовый файл, обработаем логины в нем
      if (fileResult.type === 'text') {
        // Import commandProcessor to process login credentials
        import('../utils/commandProcessor').then(module => {
          const commandProcessor = module.default;
          const content = fileResult.content.replace(/\\n/g, '\r\n');
          commandProcessor.processLoginInfo(content);
        });
      }
      
      onExecute(fileObject);
    }
  };
  
  // Обработка перехода на уровень выше
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
  );
};

// Компонент просмотра временной шкалы для контента временной шкалы
const TimelineViewer = ({ id, language }) => {
  // В реальном приложении это загружало бы данные временной шкалы из бэкенда
  // Для этого примера мы будем использовать фиктивные данные
  const timelineData = {
    career_timeline: {
      en: [
        { year: 2018, month: 1, title: 'Started career', description: 'First job as a junior developer' },
        { year: 2019, month: 6, title: 'Promotion', description: 'Promoted to mid-level developer' },
        { year: 2020, month: 3, title: 'New project', description: 'Started working on a major project' },
        { year: 2021, month: 9, title: 'Senior position', description: 'Promoted to senior developer' },
        { year: 2022, month: 5, title: 'Leadership', description: 'Became team lead' },
        { year: 2023, month: 2, title: 'Architecture', description: 'Transitioned to solution architect role' },
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
    certificates: {
      en: [
        { year: 2018, month: 3, title: 'Web Development', description: 'Certificate in Web Development Fundamentals' },
        { year: 2019, month: 1, title: 'JavaScript', description: 'Advanced JavaScript Programming' },
        { year: 2020, month: 8, title: 'React', description: 'React and Redux Certification' },
        { year: 2021, month: 5, title: 'Cloud', description: 'AWS Certified Solutions Architect' },
        { year: 2022, month: 11, title: 'DevOps', description: 'DevOps Engineering Certificate' },
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
