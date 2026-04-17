
const STORAGE_KEY_PREFIX = 'sprout_local_';

export const storage = {
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving to local storage', e);
    }
  },

  load: (key: string) => {
    try {
      const item = localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error loading from local storage', e);
      return null;
    }
  },

  remove: (key: string) => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${key}`);
  },

  clear: () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
};
