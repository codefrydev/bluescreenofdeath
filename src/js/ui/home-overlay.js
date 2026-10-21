// Home Page Navigation and Category Modal Component

import { modeRegistry } from '../config/mode-registry.js';
import { engine } from '../core/engine.js';
import { screensaverController } from './components/screensaver-modal.js';

export function showHomePage() {
  const homePage = document.getElementById('homePage');
  const canvas = document.getElementById('colorCanvas');
  const uiContainer = document.getElementById('ui-container');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');

  if (homePage) homePage.style.display = 'block';
  if (canvas) canvas.style.display = 'none';
  if (uiContainer) uiContainer.style.display = 'none';
  if (mobileMenuBtn) mobileMenuBtn.style.display = 'none';

  document.body.classList.add('home-view');
  document.body.classList.remove('canvas-view');
  document.body.style.overflow = 'auto';
}

export function showCanvasView() {
  const homePage = document.getElementById('homePage');
  const canvas = document.getElementById('colorCanvas');
  const uiContainer = document.getElementById('ui-container');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');

  if (homePage) homePage.style.display = 'none';
  if (canvas) {
    canvas.style.display = 'block';
    canvas.classList.remove('hidden');
  }
  if (uiContainer) uiContainer.style.display = '';
  if (mobileMenuBtn) mobileMenuBtn.style.display = '';

  document.body.classList.remove('home-view');
  document.body.classList.add('canvas-view');
  document.body.style.overflow = 'hidden';
}

// Global exposure
window.showHomePage = showHomePage;
window.showCanvasView = showCanvasView;
window.showHomeOverlay = showHomePage;
window.hideHomeOverlay = showCanvasView;

export function showCategoryModes(categoryId) {
  const modes = modeRegistry.getModesByCategory(categoryId);
  if (!modes || modes.length === 0) return;

  const cat = modeRegistry.getCategory(categoryId);
  const categoryLabel = cat ? cat.label : categoryId;

  // Remove existing modal
  const existing = document.querySelector('.category-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.className = 'category-modal fixed inset-0 z-[3200] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-200';
  modal.style.opacity = '0';

  const modalContent = document.createElement('div');
  modalContent.className = 'glass-dropdown border border-white/15 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl max-h-[82vh] flex flex-col';

  modalContent.innerHTML = `
    <div class="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4 flex-shrink-0">
      <div class="flex items-center gap-2.5">
        <span class="text-xl">${cat ? cat.icon : '✨'}</span>
        <h3 class="text-lg font-bold text-white">${categoryLabel}</h3>
      </div>
      <button class="modal-close-btn w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-lg leading-none cursor-pointer">×</button>
    </div>
    <div class="category-modes-grid grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto flex-1 pr-1">
      ${modes.map(m => `
        <button 
          data-mode="${m.id}" 
          class="cat-item-btn text-left p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/40 text-xs text-neutral-200 hover:text-white transition-all cursor-pointer flex flex-col gap-1"
        >
          <span class="font-medium text-sm truncate">${m.label}</span>
          <span class="text-[10px] text-neutral-400 truncate">${m.tags ? m.tags.slice(0, 2).join(', ') : ''}</span>
        </button>
      `).join('')}
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  const close = () => {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 200);
  };

  modalContent.querySelector('.modal-close-btn').addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  modalContent.querySelectorAll('.cat-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modeId = btn.getAttribute('data-mode');
      close();
      showCanvasView();
      engine.switchMode(modeId);
    });
  });

  requestAnimationFrame(() => {
    modal.style.opacity = '1';
  });
}

export function initHomeOverlay() {
  // Check URL parameters for direct mode launch (e.g. ?mode=win_10_bsod_enhanced)
  try {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    if (modeParam && modeRegistry.getMode(modeParam)) {
      showCanvasView();
      engine.switchMode(modeParam);
    } else {
      showHomePage();
    }
  } catch (e) {
    showHomePage();
  }

  // Category card click listeners
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const catId = card.getAttribute('data-category');
      if (catId) showCategoryModes(catId);
    });
  });

  // Random screensaver start button on Home page
  const startBtn = document.getElementById('random-screensaver-start');
  const intervalInput = document.getElementById('random-screensaver-interval');
  if (startBtn && intervalInput) {
    startBtn.addEventListener('click', () => {
      const val = parseInt(intervalInput.value.trim(), 10);
      const interval = isNaN(val) || val < 1 ? 15 : val;
      screensaverController.start(interval);
    });
  }
}
