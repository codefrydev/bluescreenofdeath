// Reactive State Store with localStorage persistence and Pub/Sub events

const STORAGE_FAVORITES_KEY = 'bsod_favorites';
const STORAGE_RECENTS_KEY = 'bsod_recents';
const STORAGE_CUSTOMIZER_KEY = 'bsod_customizer_options';

function loadFromStorage(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // quota exceeded or private mode
  }
}

class Store {
  constructor() {
    this.state = {
      currentMode: 'color',
      currentColor: '#000000',
      isScreensaverActive: false,
      screensaverType: 'random', // 'random' | 'games'
      screensaverInterval: 15,
      uiVisible: true,
      activeModal: null, // null | 'search' | 'customizer' | 'screensaver' | 'mobileMenu'
      favorites: loadFromStorage(STORAGE_FAVORITES_KEY, ['win_10_bsod_enhanced', 'matrix', 'tetris', 'broken_screen']),
      recents: loadFromStorage(STORAGE_RECENTS_KEY, []),
      customizerOptions: loadFromStorage(STORAGE_CUSTOMIZER_KEY, {
        win_10_bsod_enhanced: {
          stopCode: 'CRITICAL_PROCESS_DIED',
          qrText: 'https://windows.com/stopcode',
          speed: 1.0
        },
        matrix: {
          color: '#00ff66',
          speed: 1.0
        },
        dvd: {
          speed: 3
        }
      })
    };

    this.listeners = new Map();
  }

  getState() {
    return this.state;
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    const prev = this.state[key];
    if (prev === value) return;
    this.state[key] = value;
    this.emit(key, value, prev);
  }

  update(key, fn) {
    const prev = this.state[key];
    const next = fn(prev);
    this.state[key] = next;
    this.emit(key, next, prev);
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    const set = this.listeners.get(key);
    set.add(callback);
    return () => set.delete(callback);
  }

  emit(key, value, prev) {
    const specific = this.listeners.get(key);
    if (specific) {
      specific.forEach(cb => {
        try { cb(value, prev); } catch (err) { console.error(`Error in store listener for "${key}":`, err); }
      });
    }
    const wildcard = this.listeners.get('*');
    if (wildcard) {
      wildcard.forEach(cb => {
        try { cb(key, value, prev); } catch (err) { console.error('Error in wildcard store listener:', err); }
      });
    }
  }

  // Favorites management
  toggleFavorite(modeId) {
    const favorites = [...this.state.favorites];
    const idx = favorites.indexOf(modeId);
    if (idx > -1) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(modeId);
    }
    this.set('favorites', favorites);
    saveToStorage(STORAGE_FAVORITES_KEY, favorites);
  }

  isFavorite(modeId) {
    return this.state.favorites.includes(modeId);
  }

  // Recents management
  addRecent(modeId) {
    if (!modeId || modeId === 'color') return;
    const recents = [modeId, ...this.state.recents.filter(id => id !== modeId)].slice(0, 8);
    this.set('recents', recents);
    saveToStorage(STORAGE_RECENTS_KEY, recents);
  }

  // Customizer options
  getModeOption(modeId, optionKey, defaultValue) {
    const opts = this.state.customizerOptions[modeId];
    return opts && opts[optionKey] !== undefined ? opts[optionKey] : defaultValue;
  }

  setModeOption(modeId, optionKey, value) {
    const current = { ...(this.state.customizerOptions[modeId] || {}) };
    current[optionKey] = value;
    const updated = { ...this.state.customizerOptions, [modeId]: current };
    this.set('customizerOptions', updated);
    saveToStorage(STORAGE_CUSTOMIZER_KEY, updated);
  }
}

export const store = new Store();
