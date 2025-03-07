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

  useEffect(() => {
    commandProcessor.setLanguage(language);
  }, [language]);

  useEffect(() => {
    if (currentPath !== fileSystem.currentPath) {
      fileSystem.changeDirectory(currentPath);
    }
  }, [currentPath]);

  useEffect(() => {
    if (output.length === 0) {
      const initialMessages = [];
      
      initialMessages.push(commandProcessor.translate('welcome_message'));
      
      if (server) {
        initialMessages.push(`${commandProcessor.translate('connected_to')}: ${server.ip}`);
      }
      setOutput(initialMessages);
    }
  }, []);

  // scroll effect
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  // window focus
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [input, output]);

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

  const getPromptString = () => {
    if (server) {
      return `${server.username}@${fileSystem.currentServer}:${fileSystem.currentPath}$ `;
    } else {
      return '> ';
    }
  };

  const handleSubmit = () => {
    const command = input.trim();
    addToOutput(`${getPromptString()}${command}`);
    setInput('');
    
    if (pendingAuthentication) {
      handleAuthentication(command);
      return;
    }
    
    const result = commandProcessor.processCommand(command, {
      onConnect,
      onDisconnect,
      onAuthenticate,
      onRun,
      onLanguageChange,
    });
    
    if (result.success) {
      if (result.message) {
        addToOutput(result.html ? result.message : result.message);
      }
      
      if (command.startsWith('cd ') && onPathChange) {
        onPathChange(fileSystem.currentPath);
      }
    } else {
      addToOutput(`Error: ${result.message}`);
      if (result.hint) {
        addToOutput(result.hint);
      }
    }
  };

  const handleAuthentication = (password) => {
    addToOutput('********');
    
    const authResult = fileSystem.authenticate(pendingUsername, password);
    
    if (authResult.success) {
      commandProcessor.knownLogins[fileSystem.currentServer] = {
        username: pendingUsername,
        password,
        formatted: `${pendingUsername}:${password}@${fileSystem.currentServer}`
      };
      
      if (onAuthenticate) {
        onAuthenticate(authResult.server);
      }
      addToOutput(commandProcessor.translate('auth_success'));
    } else {
      addToOutput(commandProcessor.translate('auth_fail'));
    }
    
    setPendingAuthentication(false);
    setPendingAuthServer(null);
    setPendingUsername('');
  };

  const addToOutput = (line) => {
    setOutput(prev => {
      // keeping only 50 lines
      const newOutput = [...prev, line];
      if (newOutput.length > 50) {
        return newOutput.slice(newOutput.length - 50);
      }
      return newOutput;
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      
      const completed = commandProcessor.autoComplete(input);
      if (completed !== input) {
        setInput(completed);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      
      const prevCommand = commandProcessor.getPreviousCommand();
      if (prevCommand !== null) {
        setInput(prevCommand);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); 
      const nextCommand = commandProcessor.getNextCommand();
      if (nextCommand !== null) {
        setInput(nextCommand);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

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
