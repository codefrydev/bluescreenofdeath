// Modern Floating Glass Pill Navigation Bar Component

import { modeRegistry } from '../../config/mode-registry.js';
import { store } from '../../core/store.js';
import { engine } from '../../core/engine.js';
import { searchPalette } from './search-palette.js';
import { modeCustomizer } from './mode-customizer.js';
import { screensaverController } from './screensaver-modal.js';
import { showHomePage, showCanvasView } from '../home-overlay.js';
import { toggleFullscreen } from '../../events/handlers.js';

class NavBar {
  constructor() {
    this.container = null;
    this.hideTimeout = null;
    this.activeDropdown = null;
  }

  init() {
    this.container = document.getElementById('ui-container');
    if (!this.container) return;

    this.render();
    this.setupAutoHide();
    this.setupOutsideClick();

    // Listen to store currentMode changes to update active buttons
    store.subscribe('currentMode', (newMode) => {
      this.updateActiveItem(newMode);
    });

    store.subscribe('currentColor', (newColor) => {
      this.updateActiveSwatch(newColor);
    });
  }

  render() {
    this.container.className = 'desktop-ui glass-pill fixed top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 z-[2000] select-none max-w-[96vw] transition-all duration-300 max-[768px]:hidden shadow-2xl';
    this.container.innerHTML = '';

    // 1. Swatch Group
    const swatches = document.createElement('div');
    swatches.className = 'flex items-center gap-1.5 pr-1';
    swatches.innerHTML = `
      <button class="swatch active w-6 h-6 rounded-full bg-black cursor-pointer" data-color="#000000" title="Pure Black" aria-label="Pure Black"></button>
      <button class="swatch w-6 h-6 rounded-full bg-white cursor-pointer" data-color="#ffffff" title="Pure White" aria-label="Pure White"></button>
      <input type="color" id="desktopColorPicker" class="w-6 h-6 rounded-full cursor-pointer" value="#000000" title="Custom Color" aria-label="Custom Color">
    `;

    swatches.querySelector('[data-color="#000000"]').addEventListener('click', () => {
      store.set('currentColor', '#000000');
      showCanvasView();
      engine.switchMode('color');
    });

    swatches.querySelector('[data-color="#ffffff"]').addEventListener('click', () => {
      store.set('currentColor', '#ffffff');
      showCanvasView();
      engine.switchMode('color');
    });

    swatches.querySelector('#desktopColorPicker').addEventListener('input', (e) => {
      store.set('currentColor', e.target.value);
      showCanvasView();
      engine.switchMode('color');
    });

    this.container.appendChild(swatches);

    // Divider
    this.container.appendChild(this.createDivider());

    // 2. Categories Dropdowns
    const categories = modeRegistry.getCategories();
    for (const cat of categories) {
      const dropdown = this.createCategoryDropdown(cat);
      this.container.appendChild(dropdown);
    }

    // Divider
    this.container.appendChild(this.createDivider());

    // 3. Search Palette Button
    const searchBtn = document.createElement('button');
    searchBtn.className = 'nav-btn';
    searchBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
      </svg>
      <span>Search</span>
      <kbd class="text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-neutral-400">⌘K</kbd>
    `;
    searchBtn.addEventListener('click', () => searchPalette.open());
    this.container.appendChild(searchBtn);

    // 4. Customizer Button
    const customizerBtn = document.createElement('button');
    customizerBtn.className = 'nav-btn';
    customizerBtn.title = 'Customize active simulation';
    customizerBtn.innerHTML = `
      <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
      </svg>
      <span>Tweak</span>
    `;
    customizerBtn.addEventListener('click', () => modeCustomizer.toggle());
    this.container.appendChild(customizerBtn);

    // 5. Screensaver Button
    const ssBtn = document.createElement('button');
    ssBtn.id = 'navScreensaverBtn';
    ssBtn.className = 'nav-btn';
    ssBtn.innerHTML = `<span>Screensaver</span>`;
    ssBtn.addEventListener('click', () => screensaverController.openModal());
    this.container.appendChild(ssBtn);

    // 6. Home Button
    const homeBtn = document.createElement('button');
    homeBtn.className = 'nav-btn';
    homeBtn.innerHTML = `<span>Home</span>`;
    homeBtn.addEventListener('click', () => showHomePage());
    this.container.appendChild(homeBtn);

    // 7. Fullscreen Button
    const fsBtn = document.createElement('button');
    fsBtn.className = 'nav-btn font-semibold text-blue-400 border-blue-500/30 hover:border-blue-500/60';
    fsBtn.innerHTML = `<span>FS</span>`;
    fsBtn.addEventListener('click', () => toggleFullscreen());
    this.container.appendChild(fsBtn);

    // 8. Hide Bar Button
    const hideBtn = document.createElement('button');
    hideBtn.className = 'w-7 h-7 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-xs cursor-pointer ml-0.5';
    hideBtn.title = 'Hide Menu Bar (move mouse to unhide)';
    hideBtn.innerHTML = `✕`;
    hideBtn.addEventListener('click', () => {
      document.body.classList.add('ui-bar-hidden');
    });
    this.container.appendChild(hideBtn);
  }

  createDivider() {
    const div = document.createElement('div');
    div.className = 'w-px h-4 bg-white/15 mx-0.5 flex-shrink-0';
    return div;
  }

  createCategoryDropdown(cat) {
    const wrapper = document.createElement('div');
    wrapper.className = 'dropdown relative inline-block';

    const btn = document.createElement('button');
    btn.className = 'nav-btn drop-btn';
    btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.label}</span>`;

    const content = document.createElement('div');
    content.className = 'dropdown-content glass-dropdown absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-2xl p-1.5 z-[2100] max-h-[70vh] overflow-y-auto';

    const modes = modeRegistry.getModesByCategory(cat.id);
    for (const m of modes) {
      const item = document.createElement('button');
      item.className = 'menu-item';
      item.setAttribute('data-mode', m.id);
      item.innerHTML = `
        <span class="truncate">${m.label}</span>
        ${m.type === 'iframe' ? '<span class="text-[9px] uppercase px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">Play</span>' : ''}
      `;
      item.addEventListener('click', () => {
        this.closeAllDropdowns();
        showCanvasView();
        engine.switchMode(m.id);
      });
      content.appendChild(item);
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = content.classList.contains('show');
      this.closeAllDropdowns();
      if (!isOpen) {
        content.classList.add('show');
        btn.classList.add('active');
        this.activeDropdown = content;
      }
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(content);
    return wrapper;
  }

  closeAllDropdowns() {
    const all = document.querySelectorAll('.dropdown-content.show');
    all.forEach(el => el.classList.remove('show'));
    const allBtns = document.querySelectorAll('.drop-btn.active');
    allBtns.forEach(btn => btn.classList.remove('active'));
    this.activeDropdown = null;
  }

  setupOutsideClick() {
    document.addEventListener('click', (e) => {
      if (this.activeDropdown && !e.target.closest('.dropdown')) {
        this.closeAllDropdowns();
      }
    });
  }

  setupAutoHide() {
    const resetTimer = () => {
      document.body.classList.remove('ui-bar-hidden');
      if (this.hideTimeout) clearTimeout(this.hideTimeout);

      // Auto-hide only in canvas view and when no modal or dropdown is open
      if (document.body.classList.contains('canvas-view') && !this.activeDropdown) {
        this.hideTimeout = setTimeout(() => {
          if (!this.activeDropdown && !screensaverController.isRunning()) {
            document.body.classList.add('ui-bar-hidden');
          }
        }, 4000);
      }
    };

    window.addEventListener('mousemove', resetTimer, { passive: true });
    window.addEventListener('touchstart', resetTimer, { passive: true });
    window.addEventListener('keydown', resetTimer, { passive: true });
  }

  updateActiveItem(modeId) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(el => {
      if (el.getAttribute('data-mode') === modeId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  updateActiveSwatch(color) {
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(swatch => {
      if (swatch.getAttribute('data-color') === color) {
        swatch.classList.add('active');
      } else {
        swatch.classList.remove('active');
      }
    });
  }
}

export const navBar = new NavBar();
