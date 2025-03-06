import React, { useState, useEffect, useRef } from 'react';
import commandProcessor from '../utils/commandProcessor';
import fileSystem from '../utils/fileSystem';
import '../styles/Terminal.css';

const Terminal = ({ 
  onConnect, 
  onDisconnect, 
  onAuthenticate, 
  onRun, 
  onLanguageChange,
  language,
  server,
  currentPath,
  onPathChange
}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([]);
  const [pendingAuthentication, setPendingAuthentication] = useState(false);
  const [pendingAuthServer, setPendingAuthServer] = useState(null);
  const [pendingUsername, setPendingUsername] = useState('');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const outputEndRef = useRef(null);

  // Эффект для установки языка
  useEffect(() => {
    commandProcessor.setLanguage(language);
  }, [language]);

  // Эффект для обновления пути при изменении текущего пути извне
  useEffect(() => {
    if (currentPath !== fileSystem.currentPath) {
      fileSystem.changeDirectory(currentPath);
    }
  }, [currentPath]);

  // Эффект для отображения приветственного сообщения при загрузке
  useEffect(() => {
    // Только один раз при монтировании компонента
    if (output.length === 0) {
      // Проверяем, что output пуст (первый рендер)
      const initialMessages = [];
      
      initialMessages.push(commandProcessor.translate('welcome_message'));
      
      if (server) {
        initialMessages.push(`${commandProcessor.translate('connected_to')}: ${server.ip}`);
      }
      
      // Устанавливаем все сообщения сразу, вместо вызова addToOutput для каждого
      setOutput(initialMessages);
    }
  }, []);

  // Эффект для прокрутки вниз
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  // Эффект для фокусировки ввода
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [input, output]);

  // Рендер приглашения командной строки
  const renderPrompt = () => {
    if (server) {
      const username = fileSystem.authenticatedServers[fileSystem.currentServer]?.username || server.username;
      return (
        <span className="terminal-prompt">
          <span className="terminal-user">{username}</span>
          <span className="terminal-at">@</span>
          <span className="terminal-server">{fileSystem.currentServer}</span>
          <span className="terminal-colon">:</span>
          <span className="terminal-path">{fileSystem.currentPath}</span>
          <span className="terminal-dollar">$ </span>
        </span>
      );
    } else {
      return <span className="terminal-prompt">{'> '}</span>;
    }
  };

  // Получить строковое представление приглашения
  const getPromptString = () => {
    if (server) {
      return `${server.username}@${fileSystem.currentServer}:${fileSystem.currentPath}$ `;
    } else {
      return '> ';
    }
  };

  // Обработка отправки команды
  const handleSubmit = () => {
    const command = input.trim();
    
    // Добавление команды в вывод с текстовым представлением приглашения
    addToOutput(`${getPromptString()}${command}`);
    
    // Очистка ввода
    setInput('');
    
    // Если мы ждем аутентификации
    if (pendingAuthentication) {
      handleAuthentication(command);
      return;
    }
    
    // Обработка команды
    const result = commandProcessor.processCommand(command, {
      onConnect,
      onDisconnect,
      onAuthenticate,
      onRun,
      onLanguageChange,
    });
    
    // Добавление результата в вывод
    if (result.success) {
      if (result.message) {
        addToOutput(result.html ? result.message : result.message);
      }
      
      // Если это была команда CD, которая выполнилась успешно, уведомляем родителя об изменении пути
      if (command.startsWith('cd ') && onPathChange) {
        onPathChange(fileSystem.currentPath);
      }
    } else {
      addToOutput(`Error: ${result.message}`);
      
      // Если есть подсказка, добавляем ее
      if (result.hint) {
        addToOutput(result.hint);
      }
    }
  };

  // Обработка аутентификации
  const handleAuthentication = (password) => {
    // Скрытие пароля в выводе
    addToOutput('********');
    
    // Аутентификация
    const authResult = fileSystem.authenticate(pendingUsername, password);
    
    if (authResult.success) {
      // Сохранение информации для входа
      commandProcessor.knownLogins[fileSystem.currentServer] = {
        username: pendingUsername,
        password,
        formatted: `${pendingUsername}:${password}@${fileSystem.currentServer}`
      };
      
      // Вызов onAuthenticate
      if (onAuthenticate) {
        onAuthenticate(authResult.server);
      }
      
      // Добавление сообщения об успехе в вывод
      addToOutput(commandProcessor.translate('auth_success'));
    } else {
      // Добавление сообщения об ошибке в вывод
      addToOutput(commandProcessor.translate('auth_fail'));
    }
    
    // Сброс состояния аутентификации
    setPendingAuthentication(false);
    setPendingAuthServer(null);
    setPendingUsername('');
  };

  // Добавление строки в вывод
  const addToOutput = (line) => {
    setOutput(prev => {
      // Сохранение только последних 50 строк, чтобы предотвратить бесконечный рост терминала
      const newOutput = [...prev, line];
      if (newOutput.length > 50) {
        return newOutput.slice(newOutput.length - 50);
      }
      return newOutput;
    });
  };

  // Обработка нажатия клавиши
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      
      // Автодополнение
      const completed = commandProcessor.autoComplete(input);
      if (completed !== input) {
        setInput(completed);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      // Получение предыдущей команды
      const prevCommand = commandProcessor.getPreviousCommand();
      if (prevCommand !== null) {
        setInput(prevCommand);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      
      // Получение следующей команды
      const nextCommand = commandProcessor.getNextCommand();
      if (nextCommand !== null) {
        setInput(nextCommand);
      }
    }
  };

  // Обработка изменения ввода
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Обработка клика по терминалу
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal" ref={terminalRef} onClick={handleTerminalClick}>
      <div className="terminal-header">
        <div className="terminal-title">Terminal</div>
      </div>
      <div className="terminal-content">
        {output.map((line, index) => (
          <div 
            key={index} 
            className="terminal-line"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
        <div className="terminal-input-line">
          {renderPrompt()}
          <input
            ref={inputRef}
            type={pendingAuthentication ? 'password' : 'text'}
            className="terminal-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            autoFocus
          />
        </div>
        <div ref={outputEndRef} />
      </div>
    </div>
  );
};

export default Terminal;
