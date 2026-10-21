// Main entry point - orchestrates engine, state, and UI components

import { engine } from './core/engine.js';
import { store } from './core/store.js';
import { navBar } from './ui/components/nav-bar.js';
import { mobileDrawer } from './ui/components/mobile-drawer.js';
import { searchPalette } from './ui/components/search-palette.js';
import { modeCustomizer } from './ui/components/mode-customizer.js';
import { screensaverController } from './ui/components/screensaver-modal.js';
import { initHomeOverlay, showHomePage, showCanvasView } from './ui/home-overlay.js';
import { initEventHandlers, toggleFullscreen } from './events/handlers.js';

// Setup global helpers for HTML attributes and legacy callers
window.setMode = async function (modeId, val, el) {
  showCanvasView();
  if (val) {
    store.set('currentColor', val);
  }
  await engine.switchMode(modeId);
};

window.showHomePage = showHomePage;
window.showCanvasView = showCanvasView;
window.toggleFullscreen = toggleFullscreen;
window.toggleMobileMenu = () => mobileDrawer.toggle();
window.closeMobileMenu = () => mobileDrawer.close();
window.toggleGameScreensaver = () => screensaverController.openModal();
window.stopRandomScreensaver = () => screensaverController.stop();
window.isRandomScreensaverRunning = () => screensaverController.isRunning();

// Initialize Core Engine
engine.init();

// Initialize UI Subsystems
navBar.init();
mobileDrawer.init();
searchPalette.init();
modeCustomizer.init();
screensaverController.init();
initHomeOverlay();
initEventHandlers();
