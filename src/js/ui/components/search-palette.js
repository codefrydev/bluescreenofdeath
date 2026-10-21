// Spotlight Command Palette & Quick Search Component

import { modeRegistry } from '../../config/mode-registry.js';
import { store } from '../../core/store.js';
import { engine } from '../../core/engine.js';
import { showCanvasView } from '../home-overlay.js';

class SearchPalette {
  constructor() {
    this.modal = null;
    this.input = null;
    this.resultsContainer = null;
    this.selectedIndex = 0;
    this.currentResults = [];
    this.isOpen = false;
  }

  init() {
    this.createDom();
    this.setupKeyboardListeners();
  }

  createDom() {
    let existing = document.getElementById('searchPaletteModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'searchPaletteModal';
    modal.className = 'search-palette-modal fixed inset-0 z-[4000] bg-black/70 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4';
    modal.innerHTML = `
      <div class="search-box glass-dropdown w-full max-w-xl rounded-2xl overflow-hidden border border-white/15 shadow-2xl flex flex-col max-h-[75vh]">
        <div class="flex items-center px-4 py-3.5 border-b border-white/10 gap-3 bg-white/5">
          <svg class="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input 
            type="text" 
            id="searchPaletteInput" 
            placeholder="Search simulations, games, BSODs... (or press Esc to close)" 
            class="flex-1 bg-transparent text-white text-sm outline-none placeholder-neutral-500"
            autocomplete="off"
            spellcheck="false"
          />
          <kbd class="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-400 border border-white/10">ESC</kbd>
        </div>
        <div id="searchPaletteResults" class="flex-1 overflow-y-auto p-2 divide-y divide-white/5">
          <!-- Results injected here -->
        </div>
        <div class="px-4 py-2 border-t border-white/10 bg-black/40 text-[11px] text-neutral-400 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span><kbd class="font-mono bg-white/10 px-1 rounded text-[10px]">↑</kbd> <kbd class="font-mono bg-white/10 px-1 rounded text-[10px]">↓</kbd> navigate</span>
            <span><kbd class="font-mono bg-white/10 px-1 rounded text-[10px]">ENTER</kbd> select</span>
          </div>
          <span>37 simulations available</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;
    this.input = modal.querySelector('#searchPaletteInput');
    this.resultsContainer = modal.querySelector('#searchPaletteResults');

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close();
    });

    this.input.addEventListener('input', () => {
      this.updateResults(this.input.value);
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigate(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigate(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.selectCurrent();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });
  }

  setupKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K or '/' (when not typing in an input)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        this.open();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.modal.classList.add('show');
    this.input.value = '';
    this.selectedIndex = 0;
    this.updateResults('');
    setTimeout(() => this.input.focus(), 60);
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('show');
    this.input.blur();
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  updateResults(query) {
    const q = query.trim().toLowerCase();
    let modes = [];

    if (!q) {
      // Empty query: Show Favorites and Recents first, then popular modes
      const favorites = store.get('favorites') || [];
      const recents = store.get('recents') || [];
      const priorityIds = Array.from(new Set([...favorites, ...recents]));
      
      const priorityModes = priorityIds.map(id => modeRegistry.getMode(id)).filter(Boolean);
      const remainingModes = modeRegistry.getAllModes().filter(m => !priorityIds.includes(m.id));
      modes = [...priorityModes, ...remainingModes];
    } else {
      modes = modeRegistry.searchModes(q);
    }

    this.currentResults = modes;
    this.selectedIndex = Math.min(this.selectedIndex, Math.max(0, modes.length - 1));
    this.renderResults();
  }

  renderResults() {
    if (this.currentResults.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="py-10 text-center text-neutral-500 text-xs">
          No simulations found matching your query.
        </div>
      `;
      return;
    }

    this.resultsContainer.innerHTML = this.currentResults.map((mode, index) => {
      const isSelected = index === this.selectedIndex;
      const cat = modeRegistry.getCategory(mode.category);
      const catLabel = cat ? cat.label : mode.category;
      const catIcon = cat ? cat.icon : '✨';
      const isFav = store.isFavorite(mode.id);

      return `
        <div 
          data-index="${index}" 
          class="palette-item flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-600/25 border border-blue-500/40 text-white' : 'hover:bg-white/5 text-neutral-300'
          }"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span class="text-base">${catIcon}</span>
            <div class="min-w-0">
              <div class="text-sm font-medium truncate flex items-center gap-2">
                <span>${mode.label}</span>
                ${isFav ? '<span class="text-yellow-400 text-xs">★</span>' : ''}
              </div>
              <div class="text-[11px] text-neutral-400 truncate">${mode.tags ? mode.tags.slice(0, 3).join(' • ') : ''}</div>
            </div>
          </div>
          <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 uppercase tracking-wider flex-shrink-0">
            ${catLabel}
          </span>
        </div>
      `;
    }).join('');

    // Attach click listeners to rendered items
    const items = this.resultsContainer.querySelectorAll('.palette-item');
    items.forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        this.selectedIndex = idx;
        this.selectCurrent();
      });
    });

    // Scroll selected item into view
    const selectedEl = items[this.selectedIndex];
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  navigate(dir) {
    if (this.currentResults.length === 0) return;
    this.selectedIndex = (this.selectedIndex + dir + this.currentResults.length) % this.currentResults.length;
    this.renderResults();
  }

  async selectCurrent() {
    const selected = this.currentResults[this.selectedIndex];
    if (!selected) return;

    this.close();
    showCanvasView();
    await engine.switchMode(selected.id);
  }
}

export const searchPalette = new SearchPalette();
