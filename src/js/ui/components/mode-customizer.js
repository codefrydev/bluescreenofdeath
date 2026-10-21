// Mode Customizer Drawer Component for Live Parameter Tuning

import { store } from '../../core/store.js';
import { modeRegistry } from '../../config/mode-registry.js';
import { engine } from '../../core/engine.js';

class ModeCustomizer {
  constructor() {
    this.drawer = null;
    this.isOpen = false;
  }

  init() {
    this.createDom();
  }

  createDom() {
    let existing = document.getElementById('modeCustomizerDrawer');
    if (existing) existing.remove();

    const drawer = document.createElement('div');
    drawer.id = 'modeCustomizerDrawer';
    drawer.className = 'customizer-drawer fixed top-0 right-0 h-full w-full max-w-sm z-[3500] glass-dropdown border-l border-white/15 p-6 flex flex-col shadow-2xl overflow-y-auto';
    drawer.innerHTML = `
      <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div>
          <h3 id="customizerModeTitle" class="text-base font-semibold text-white">Customize Simulation</h3>
          <p id="customizerModeSubtitle" class="text-xs text-neutral-400">Live configuration options</p>
        </div>
        <button id="customizerCloseBtn" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-lg leading-none cursor-pointer">×</button>
      </div>

      <div id="customizerControls" class="flex-1 space-y-5">
        <!-- Dynamic controls injected here -->
      </div>

      <div class="pt-5 border-t border-white/10 mt-6 flex items-center justify-between">
        <button id="customizerFavoriteBtn" class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/15 text-neutral-300 cursor-pointer">
          <span id="customizerFavStar">★</span>
          <span id="customizerFavText">Add to Favorites</span>
        </button>
        <button id="customizerResetBtn" class="px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white cursor-pointer">
          Reset Defaults
        </button>
      </div>
    `;

    document.body.appendChild(drawer);
    this.drawer = drawer;

    drawer.querySelector('#customizerCloseBtn').addEventListener('click', () => this.close());
    drawer.querySelector('#customizerFavoriteBtn').addEventListener('click', () => {
      const modeId = store.get('currentMode');
      store.toggleFavorite(modeId);
      this.updateFavButton();
    });
    drawer.querySelector('#customizerResetBtn').addEventListener('click', () => {
      const modeId = store.get('currentMode');
      // Reset options
      if (modeId === 'win_10_bsod_enhanced') {
        store.setModeOption(modeId, 'stopCode', 'CRITICAL_PROCESS_DIED');
      } else if (modeId === 'matrix') {
        store.setModeOption(modeId, 'color', '#00ff66');
      }
      this.renderControls(modeId);
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.drawer.classList.add('show');
    const modeId = store.get('currentMode');
    const mode = modeRegistry.getMode(modeId);

    const titleEl = this.drawer.querySelector('#customizerModeTitle');
    const subEl = this.drawer.querySelector('#customizerModeSubtitle');
    if (titleEl && mode) titleEl.textContent = mode.label;
    if (subEl && mode) subEl.textContent = `Category: ${mode.category.toUpperCase()}`;

    this.updateFavButton();
    this.renderControls(modeId);
  }

  close() {
    this.isOpen = false;
    this.drawer.classList.remove('show');
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  updateFavButton() {
    const modeId = store.get('currentMode');
    const isFav = store.isFavorite(modeId);
    const star = this.drawer.querySelector('#customizerFavStar');
    const text = this.drawer.querySelector('#customizerFavText');
    if (star) star.className = isFav ? 'text-yellow-400' : 'text-neutral-500';
    if (text) text.textContent = isFav ? 'In Favorites' : 'Add to Favorites';
  }

  renderControls(modeId) {
    const container = this.drawer.querySelector('#customizerControls');
    if (!container) return;

    if (modeId === 'win_10_bsod_enhanced') {
      const currentCode = store.getModeOption('win_10_bsod_enhanced', 'stopCode', 'CRITICAL_PROCESS_DIED');
      const stopCodes = [
        'CRITICAL_PROCESS_DIED',
        'PAGE_FAULT_IN_NONPAGED_AREA',
        'KERNEL_SECURITY_CHECK_FAILURE',
        'SYSTEM_SERVICE_EXCEPTION',
        'DPC_WATCHDOG_VIOLATION',
        'IRQL_NOT_LESS_OR_EQUAL'
      ];

      container.innerHTML = `
        <div class="space-y-2">
          <label class="block text-xs font-medium text-neutral-300">Stop Code Error</label>
          <select id="bsodStopCodeSelect" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs outline-none focus:border-blue-500">
            ${stopCodes.map(c => `<option value="${c}" ${c === currentCode ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-medium text-neutral-300">Custom Error Message</label>
          <input 
            type="text" 
            id="bsodCustomCodeInput" 
            value="${currentCode}" 
            placeholder="Type custom stop code..." 
            class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white text-xs outline-none focus:border-blue-500 font-mono"
          />
        </div>
      `;

      const select = container.querySelector('#bsodStopCodeSelect');
      const input = container.querySelector('#bsodCustomCodeInput');

      select.addEventListener('change', () => {
        input.value = select.value;
        store.setModeOption('win_10_bsod_enhanced', 'stopCode', select.value);
        const active = engine.activeMode;
        if (active && active.id === 'win_10_bsod_enhanced') {
          active.options.stopCode = select.value;
        }
      });

      input.addEventListener('input', () => {
        store.setModeOption('win_10_bsod_enhanced', 'stopCode', input.value);
        const active = engine.activeMode;
        if (active && active.id === 'win_10_bsod_enhanced') {
          active.options.stopCode = input.value;
        }
      });

    } else if (modeId === 'matrix') {
      const currentColor = store.getModeOption('matrix', 'color', '#00ff66');
      const presets = [
        { label: 'Classic Green', color: '#00ff66' },
        { label: 'Cyber Cyan', color: '#00f0ff' },
        { label: 'Amber Terminal', color: '#ffaa00' },
        { label: 'Blood Red', color: '#ff3344' },
        { label: 'Neon Purple', color: '#c055ff' },
        { label: 'Ice White', color: '#ffffff' }
      ];

      container.innerHTML = `
        <div class="space-y-3">
          <label class="block text-xs font-medium text-neutral-300">Glyph Color Palette</label>
          <div class="grid grid-cols-2 gap-2">
            ${presets.map(p => `
              <button 
                data-color="${p.color}" 
                class="matrix-color-btn px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border border-white/10 hover:border-white/30 text-white cursor-pointer ${
                  p.color === currentColor ? 'bg-white/15 border-blue-500' : 'bg-black/30'
                }"
              >
                <span class="w-3.5 h-3.5 rounded-full flex-shrink-0" style="background:${p.color}"></span>
                <span class="truncate">${p.label}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('.matrix-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const col = btn.getAttribute('data-color');
          store.setModeOption('matrix', 'color', col);
          this.renderControls('matrix');
        });
      });

    } else if (modeId === 'color') {
      const curColor = store.get('currentColor') || '#000000';
      container.innerHTML = `
        <div class="space-y-3">
          <label class="block text-xs font-medium text-neutral-300">Custom Background Color</label>
          <div class="flex items-center gap-3">
            <input type="color" id="customizerColorPicker" value="${curColor}" class="w-10 h-10 rounded-xl cursor-pointer" />
            <input type="text" id="customizerColorHex" value="${curColor}" class="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/15 text-white font-mono text-xs" />
          </div>
        </div>
      `;

      const picker = container.querySelector('#customizerColorPicker');
      const hex = container.querySelector('#customizerColorHex');

      picker.addEventListener('input', () => {
        hex.value = picker.value;
        store.set('currentColor', picker.value);
      });

      hex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(hex.value)) {
          picker.value = hex.value;
          store.set('currentColor', hex.value);
        }
      });

    } else {
      container.innerHTML = `
        <div class="py-8 text-center text-neutral-400 text-xs">
          No adjustable parameters for this simulation mode. It runs with authentic fidelity!
        </div>
      `;
    }
  }
}

export const modeCustomizer = new ModeCustomizer();
