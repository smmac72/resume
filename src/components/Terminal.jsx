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
    const handler = (e) => {
      const msg = e?.detail;
      if (msg) {
        addToOutput(msg);
      }
    };
    window.addEventListener('terminal:echo', handler);
    return () => window.removeEventListener('terminal:echo', handler);
  }, []);

  useEffect(() => {
    const onVirtualKey = (e) => {
      const vkey = e?.detail?.key;
      if (!vkey) return;
      handleVirtualKey(vkey);
    };
    window.addEventListener('virtual-key', onVirtualKey);
    return () => window.removeEventListener('virtual-key', onVirtualKey);
  }, [input]);

  useEffect(() => {
    if (server?.ip && fileSystem.currentPath !== currentPath) {
      fileSystem.changeDirectory(currentPath);
    }
  }, [currentPath, server?.ip]);

  useEffect(() => {
    if (output.length === 0) {
      const initialMessages = [];
      
      initialMessages.push(commandProcessor.translate('welcome_message'));
      
      if (server) {
        initialMessages.push(`${commandProcessor.translate('connected_to')}: ${server.ip}`);
      }
      setOutput(initialMessages);
    }
  }, [output.length, server]);

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
      const username =
        fileSystem.authenticatedServers[server.ip]?.username || 'guest';
      return (
        <span className="terminal-prompt">
          <span className="terminal-user">{username}</span>
          <span className="terminal-at">@</span>
          <span className="terminal-server">{server.ip}</span>
          <span className="terminal-colon">:</span>
          <span className="terminal-path">{currentPath}</span>
          <span className="terminal-dollar">$ </span>
        </span>
      );
    }
    return <span className="terminal-prompt">{'> '}</span>;
  };

  const getPromptString = () => {
    if (server) {
      const username =
        fileSystem.authenticatedServers[server.ip]?.username || 'guest';
      return `${username}@${server.ip}:${currentPath}$ `;
    }
    return '> ';
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

    const handleVirtualKey = (key) => {
      if (key === 'Enter') {
        handleSubmit();
        return;
      }
      if (key === 'Tab') {
        const completed = commandProcessor.autoComplete(input);
        if (completed !== input) setInput(completed);
        return;
      }
      if (key === 'Backspace') {
        setInput((prev) => prev.slice(0, -1));
        return;
      }
      if (key.length === 1) {
        setInput((prev) => prev + key);
        return;
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
