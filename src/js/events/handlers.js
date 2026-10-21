// Global Event Handlers for Keyboard, Gestures, and Fullscreen

import { store } from '../core/store.js';
import { engine } from '../core/engine.js';
import { mobileDrawer } from '../ui/components/mobile-drawer.js';
import { searchPalette } from '../ui/components/search-palette.js';
import { modeCustomizer } from '../ui/components/mode-customizer.js';
import { showCanvasView } from '../ui/home-overlay.js';

let abortController = null;

function getFullscreenAPI() {
  const doc = document.documentElement;
  if (doc.requestFullscreen) {
    return {
      request: () => doc.requestFullscreen(),
      exit: () => document.exitFullscreen(),
      element: () => document.fullscreenElement,
    };
  } else if (doc.webkitRequestFullscreen) {
    return {
      request: () => doc.webkitRequestFullscreen(),
      exit: () => document.webkitExitFullscreen(),
      element: () => document.webkitFullscreenElement,
    };
  }
  return null;
}

export function toggleFullscreen() {
  const fsAPI = getFullscreenAPI();
  if (!fsAPI) return;

  try {
    if (!fsAPI.element()) {
      fsAPI.request().catch(err => console.warn('Failed to enter fullscreen:', err));
    } else {
      fsAPI.exit().catch(err => console.warn('Failed to exit fullscreen:', err));
    }
  } catch (error) {
    console.warn('Fullscreen operation failed:', error);
  }
}

export function initEventHandlers() {
  cleanupEventHandlers();

  abortController = new AbortController();
  const signal = abortController.signal;

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // Forward input to active mode (e.g. Hacker Typer)
    if (engine.activeMode && typeof engine.activeMode.onInput === 'function') {
      engine.activeMode.onInput(e);
    }

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    // 'F' key toggles fullscreen
    if (e.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }

    // Spacebar generates random vibrant color
    if (e.code === 'Space') {
      e.preventDefault();
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      store.set('currentColor', randomColor);
      showCanvasView();
      engine.switchMode('color');
    }

    // Escape closes modals or unhides UI bar
    if (e.key === 'Escape') {
      if (document.body.classList.contains('ui-bar-hidden')) {
        document.body.classList.remove('ui-bar-hidden');
      } else {
        mobileDrawer.close();
        searchPalette.close();
        modeCustomizer.close();
      }
    }
  }, { signal });
}

export function cleanupEventHandlers() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}
