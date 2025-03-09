const StorageUtils = {
    saveItem: (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    },
  
    loadItem: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        return defaultValue;
      }
    },
  
    updateItem: (key, updateFn) => {
      const currentData = StorageUtils.loadItem(key, {});
      const updatedData = updateFn(currentData);
      StorageUtils.saveItem(key, updatedData);
      return updatedData;
    },
  
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  };
  
  export default StorageUtils;