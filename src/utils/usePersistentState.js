import { useState, useEffect } from 'react';
import StorageUtils from './storageUtils';

// custom hook for persistent state
const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => 
    StorageUtils.loadItem(key, initialValue)
  );

  useEffect(() => {
    StorageUtils.saveItem(key, state);
  }, [key, state]);

  return [state, setState];
};

export default usePersistentState;