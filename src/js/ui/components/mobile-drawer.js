// Mobile Drawer and Bottom Sheet Navigation Component

import { modeRegistry } from '../../config/mode-registry.js';
import { store } from '../../core/store.js';
import { engine } from '../../core/engine.js';
import { searchPalette } from './search-palette.js';
import { screensaverController } from './screensaver-modal.js';
import { showHomePage, showCanvasView } from '../home-overlay.js';
import { toggleFullscreen } from '../../events/handlers.js';

class MobileDrawer {
  constructor() {
    this.menu = null;
    this.overlay = null;
    this.btn = null;
    this.isOpen = false;
  }

  init() {
    this.ensureMenuBtn();
    this.menu = document.getElementById('mobileMenu');
    this.overlay = document.getElementById('mobileMenuOverlay');

    if (!this.menu || !this.overlay) return;

    this.renderContent();
    this.setupListeners();
  }

  ensureMenuBtn() {
    let btn = document.getElementById('mobileMenuBtn');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'mobileMenuBtn';
      btn.className = 'fixed bottom-5 right-5 z-[2100] w-12 h-12 rounded-full glass-pill border border-white/20 shadow-2xl flex items-center justify-center text-white cursor-pointer min-[769px]:hidden transition-all duration-200 active:scale-90';
      btn.setAttribute('aria-label', 'Open mobile menu');
      btn.innerHTML = `
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      `;
      document.body.appendChild(btn);
    }
    this.btn = btn;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
  }

  renderContent() {
    const content = document.getElementById('mobile-menu-content');
    if (!content) return;

    content.className = 'flex-1 overflow-y-auto px-4 py-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-[#12141d] text-white';
    content.innerHTML = '';

    // 1. Color Picker Row
    const colorRow = document.createElement('div');
    colorRow.className = 'grid grid-cols-3 gap-2 mb-4';
    colorRow.innerHTML = `
      <button class="py-2.5 rounded-xl border border-white/10 bg-black text-white text-xs font-medium cursor-pointer" data-color="#000000">Black</button>
      <button class="py-2.5 rounded-xl border border-white/10 bg-white text-black text-xs font-medium cursor-pointer" data-color="#ffffff">White</button>
      <label class="py-2.5 rounded-xl border border-white/10 bg-white/5 text-neutral-300 text-xs font-medium flex items-center justify-center cursor-pointer relative">
        <input type="color" id="mobileDrawerColorPicker" class="absolute inset-0 opacity-0 w-full h-full cursor-pointer">
        Custom
      </label>
    `;

    colorRow.querySelector('[data-color="#000000"]').addEventListener('click', () => {
      store.set('currentColor', '#000000');
      showCanvasView();
      engine.switchMode('color');
      this.close();
    });

    colorRow.querySelector('[data-color="#ffffff"]').addEventListener('click', () => {
      store.set('currentColor', '#ffffff');
      showCanvasView();
      engine.switchMode('color');
      this.close();
    });

    colorRow.querySelector('#mobileDrawerColorPicker').addEventListener('input', (e) => {
      store.set('currentColor', e.target.value);
      showCanvasView();
      engine.switchMode('color');
      this.close();
    });

    content.appendChild(colorRow);

    // 2. Search & Screensaver Action Buttons
    const quickActions = document.createElement('div');
    quickActions.className = 'flex gap-2 mb-4';
    quickActions.innerHTML = `
      <button id="mobileSearchTrigger" class="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-neutral-200 flex items-center justify-center gap-2 cursor-pointer">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        Search Simulations
      </button>
      <button id="mobileScreensaverTrigger" class="flex-1 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-xs font-medium text-blue-300 flex items-center justify-center gap-1.5 cursor-pointer">
        ✨ Screensaver
      </button>
    `;

    quickActions.querySelector('#mobileSearchTrigger').addEventListener('click', () => {
      this.close();
      searchPalette.open();
    });

    quickActions.querySelector('#mobileScreensaverTrigger').addEventListener('click', () => {
      this.close();
      screensaverController.openModal();
    });

    content.appendChild(quickActions);

    // 3. Categorized Sections with Expand/Collapse
    const categories = modeRegistry.getCategories();
    for (const cat of categories) {
      const modes = modeRegistry.getModesByCategory(cat.id);
      const section = document.createElement('div');
      section.className = 'mb-4';
      section.innerHTML = `
        <div class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>${cat.icon}</span>
          <span>${cat.label}</span>
          <span class="text-neutral-500 font-normal">(${modes.length})</span>
        </div>
        <div class="grid grid-cols-2 gap-1.5">
          ${modes.map(m => `
            <button 
              data-mode="${m.id}" 
              class="mobile-mode-btn text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:bg-blue-600/30 text-xs text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center justify-between"
            >
              <span class="truncate">${m.label}</span>
            </button>
          `).join('')}
        </div>
      `;

      section.querySelectorAll('.mobile-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const modeId = btn.getAttribute('data-mode');
          showCanvasView();
          engine.switchMode(modeId);
          this.close();
        });
      });

      content.appendChild(section);
    }

    // 4. Bottom Utilities Row
    const bottomRow = document.createElement('div');
    bottomRow.className = 'flex gap-2 pt-2 border-t border-white/10 mt-3';
    bottomRow.innerHTML = `
      <button id="mobileHomeBtn" class="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-neutral-300 font-medium cursor-pointer">Home</button>
      <button id="mobileFullscreenBtn" class="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer">Fullscreen</button>
    `;

    bottomRow.querySelector('#mobileHomeBtn').addEventListener('click', () => {
      this.close();
      showHomePage();
    });

    bottomRow.querySelector('#mobileFullscreenBtn').addEventListener('click', () => {
      this.close();
      toggleFullscreen();
    });

    content.appendChild(bottomRow);
  }

  setupListeners() {
    this.overlay.addEventListener('click', () => this.close());

    // Close button in drawer header
    const closeBtn = this.menu.querySelector('button[onclick*="toggleMobileMenu"]');
    if (closeBtn) {
      closeBtn.removeAttribute('onclick');
      closeBtn.addEventListener('click', () => this.close());
    }

    // Swipe down to dismiss
    let touchStartY = 0;
    this.menu.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.menu.addEventListener('touchmove', (e) => {
      const currentY = e.touches[0].clientY;
      if (currentY - touchStartY > 80 && this.menu.scrollTop <= 0) {
        this.close();
      }
    }, { passive: true });
  }

  open() {
    this.isOpen = true;
    this.menu.classList.add('show');
    this.overlay.classList.add('show');
    document.body.classList.add('mobile-menu-open');
  }

  close() {
    this.isOpen = false;
    this.menu.classList.remove('show');
    this.overlay.classList.remove('show');
    document.body.classList.remove('mobile-menu-open');
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }
}

export const mobileDrawer = new MobileDrawer();
