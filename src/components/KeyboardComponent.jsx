import React, { useState, useEffect } from 'react';
import '../styles/Keyboard.css';

const KeyboardComponent = ({ onKeyPress }) => {
  const [activeKeys, setActiveKeys] = useState([]);
  const [heldKeys, setHeldKeys] = useState([]);

  const sendVirtualKey = (key) => {
    window.dispatchEvent(new CustomEvent('virtual-key', { detail: { key } }));
  };

  // keys
  const keyRows = [
    ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACK'],
    ['TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CAPS', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'ENTER'],
    ['SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT'],
    ['CTRL', 'ALT', '', 'ALT', 'CTRL'],
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      // code instead of key for any language layout on the keyboard
      const keyCode = e.code;
      
      const keyMapping = {
        'Escape': 'ESC',
        'Backspace': 'BACK',
        'Tab': 'TAB',
        'CapsLock': 'CAPS',
        'ShiftLeft': 'SHIFT',
        'ShiftRight': 'SHIFT',
        'ControlLeft': 'CTRL',
        'ControlRight': 'CTRL',
        'AltLeft': 'ALT',
        'AltRight': 'ALT',
        'Space': '',
        'Enter': 'ENTER',

        'KeyQ': 'Q', 'KeyW': 'W', 'KeyE': 'E', 'KeyR': 'R', 'KeyT': 'T',
        'KeyY': 'Y', 'KeyU': 'U', 'KeyI': 'I', 'KeyO': 'O', 'KeyP': 'P',
        'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyF': 'F', 'KeyG': 'G',
        'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L',
        'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C', 'KeyV': 'V', 'KeyB': 'B',
        'KeyN': 'N', 'KeyM': 'M',

        'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
        'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',

        'Minus': '-', 'Equal': '=', 'BracketLeft': '[', 'BracketRight': ']',
        'Backslash': '\\', 'Semicolon': ';', 'Quote': '\'', 'Comma': ',',
        'Period': '.', 'Slash': '/'
      };
      
      const displayKey = keyMapping[keyCode] || e.key.toUpperCase();
      
      setActiveKeys(prev => [...prev, displayKey]);
      setHeldKeys(prev => [...prev, displayKey]);
      
      if (onKeyPress) {
        onKeyPress(e);
      }
    };
    
    const handleKeyUp = (e) => {
      const keyCode = e.code;
      
      const keyMapping = {
        'Escape': 'ESC',
        'Backspace': 'BACK',
        'Tab': 'TAB',
        'CapsLock': 'CAPS',
        'ShiftLeft': 'SHIFT',
        'ShiftRight': 'SHIFT',
        'ControlLeft': 'CTRL',
        'ControlRight': 'CTRL',
        'AltLeft': 'ALT',
        'AltRight': 'ALT',
        'Space': '',
        'Enter': 'ENTER',

        'KeyQ': 'Q', 'KeyW': 'W', 'KeyE': 'E', 'KeyR': 'R', 'KeyT': 'T',
        'KeyY': 'Y', 'KeyU': 'U', 'KeyI': 'I', 'KeyO': 'O', 'KeyP': 'P',
        'KeyA': 'A', 'KeyS': 'S', 'KeyD': 'D', 'KeyF': 'F', 'KeyG': 'G',
        'KeyH': 'H', 'KeyJ': 'J', 'KeyK': 'K', 'KeyL': 'L',
        'KeyZ': 'Z', 'KeyX': 'X', 'KeyC': 'C', 'KeyV': 'V', 'KeyB': 'B',
        'KeyN': 'N', 'KeyM': 'M',

        'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
        'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',

        'Minus': '-', 'Equal': '=', 'BracketLeft': '[', 'BracketRight': ']',
        'Backslash': '\\', 'Semicolon': ';', 'Quote': '\'', 'Comma': ',',
        'Period': '.', 'Slash': '/'
      };
      
      const displayKey = keyMapping[keyCode] || e.key.toUpperCase();
      
      setActiveKeys(prev => prev.filter(k => k !== displayKey));
      setHeldKeys(prev => prev.filter(k => k !== displayKey));
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKeyPress]);

  // effect to flash key for the visual feedback
  useEffect(() => {
    const timers = activeKeys.map(key => {
      return setTimeout(() => {
        setActiveKeys(prev => prev.filter(k => k !== key));
      }, 200);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [activeKeys]);

  const handleKeyClick = (key) => {
    if (key === '') return;
    
    let event;
    
    switch (key) {
      case '':
        sendVirtualKey(' ');
        break;
      case 'BACK':
        sendVirtualKey('Backspace');
        break;
      case 'ENTER':
        sendVirtualKey('Enter');
        break;
      case 'TAB':
        sendVirtualKey('Tab');
        break;
      case 'ESC':
      case 'CAPS':
      case 'SHIFT':
      case 'CTRL':
      case 'ALT':
        setActiveKeys(prev => [...prev, key]);
        setTimeout(() => setActiveKeys(prev => prev.filter(k => k !== key)), 200);
        break;
      default:
        sendVirtualKey(key.length === 1 ? key.toLowerCase() : key);
    }
    
    setActiveKeys(prev => [...prev, key]);
  };

  // mapping keys to different style classes
  const getKeyClass = (key) => {
    let className = 'keyboard-key';
    
    if (activeKeys.includes(key)) {
      className += ' active';
    } else if (heldKeys.includes(key)) {
      className += ' held';
    }
    
    switch (key) {
      case 'BACK':
        className += ' key-2x';
        break;
      case 'TAB':
      case 'CAPS':
      case '\\':
        className += ' key-1-5x';
        break;
      case 'SHIFT':
        className += ' key-2-25x';
        break;
      case 'ENTER':
        className += ' key-2-25x';
        break;
      case 'CTRL':
      case 'ALT':
        className += ' key-1-25x';
        break;
      case '':
        className += ' key-6x';
        break;
      default:
        break;
    }
    
    return className;
  };

  return (
    <div className="keyboard">
      {keyRows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <div
              key={`${rowIndex}-${keyIndex}`}
              className={getKeyClass(key)}
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default KeyboardComponent;
