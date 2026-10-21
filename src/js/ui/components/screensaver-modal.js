// Unified Screensaver Controller with Filter Categories and Floating HUD

import { modeRegistry } from '../../config/mode-registry.js';
import { store } from '../../core/store.js';
import { engine } from '../../core/engine.js';
import { showCanvasView } from '../home-overlay.js';

class ScreensaverController {
  constructor() {
    this.intervalId = null;
    this.countdownId = null;
    this.secondsRemaining = 15;
    this.lastModeId = null;
    this.modal = null;
    this.hud = null;
    this.filterCategory = 'all'; // 'all' | 'games' | 'windows' | 'pranks'
  }

  init() {
    this.createModal();
    this.createHud();
  }

  createModal() {
    let existing = document.getElementById('screensaverUnifiedModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'screensaverUnifiedModal';
    modal.className = 'fixed inset-0 z-[3600] bg-black/75 backdrop-blur-md hidden items-center justify-center p-4';
    modal.innerHTML = `
      <div class="glass-dropdown border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl">✨</span>
            <h2 class="text-xl font-bold text-white">Screensaver Engine</h2>
          </div>
          <button id="screensaverCloseModal" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white flex items-center justify-center text-lg leading-none cursor-pointer">×</button>
        </div>

        <p class="text-xs text-neutral-400">
          Cycle automatically through simulations and games at your chosen interval.
        </p>

        <!-- Category Filter -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-neutral-300">Included Simulations</label>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <button data-cat="all" class="screensaver-filter-btn px-3 py-2 rounded-xl border border-blue-500 bg-blue-500/20 text-white font-medium cursor-pointer">All Modes (37)</button>
            <button data-cat="games" class="screensaver-filter-btn px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-neutral-300 hover:border-white/30 cursor-pointer">Only Games (13)</button>
            <button data-cat="windows" class="screensaver-filter-btn px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-neutral-300 hover:border-white/30 cursor-pointer">Only Windows (6)</button>
            <button data-cat="pranks" class="screensaver-filter-btn px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-neutral-300 hover:border-white/30 cursor-pointer">Only Pranks (5)</button>
          </div>
        </div>

        <!-- Interval Input -->
        <div class="space-y-2">
          <label class="block text-xs font-medium text-neutral-300">Interval (seconds)</label>
          <div class="flex items-center gap-3">
            <input 
              type="number" 
              id="screensaverIntervalInput" 
              min="3" 
              max="300" 
              value="${store.get('screensaverInterval') || 15}" 
              class="w-full px-4 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm outline-none focus:border-blue-500 font-mono"
            />
            <span class="text-xs text-neutral-400">seconds</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-2">
          <button id="screensaverStartBtn" class="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer transition-colors shadow-lg shadow-blue-600/30">
            Start Screensaver
          </button>
          <button id="screensaverCancelBtn" class="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-medium text-xs cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });

    modal.querySelector('#screensaverCloseModal').addEventListener('click', () => this.closeModal());
    modal.querySelector('#screensaverCancelBtn').addEventListener('click', () => this.closeModal());

    modal.querySelectorAll('.screensaver-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.screensaver-filter-btn').forEach(b => {
          b.className = 'screensaver-filter-btn px-3 py-2 rounded-xl border border-white/10 bg-black/30 text-neutral-300 hover:border-white/30 cursor-pointer';
        });
        btn.className = 'screensaver-filter-btn px-3 py-2 rounded-xl border border-blue-500 bg-blue-500/20 text-white font-medium cursor-pointer';
        this.filterCategory = btn.getAttribute('data-cat');
      });
    });

    modal.querySelector('#screensaverStartBtn').addEventListener('click', () => {
      const input = modal.querySelector('#screensaverIntervalInput');
      const val = parseInt(input.value, 10);
      const interval = isNaN(val) || val < 3 ? 15 : val;
      store.set('screensaverInterval', interval);
      this.closeModal();
      this.start(interval);
    });
  }

  createHud() {
    let existing = document.getElementById('screensaverHud');
    if (existing) existing.remove();

    const hud = document.createElement('div');
    hud.id = 'screensaverHud';
    hud.className = 'fixed top-3 right-4 z-[2500] hidden items-center gap-2 px-3 py-1.5 rounded-full glass-pill text-xs border border-green-500/40 text-white shadow-xl screensaver-hud';
    hud.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
      <span id="screensaverHudText" class="font-mono text-[11px] text-green-300">15s</span>
      <button id="screensaverHudSkip" class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] cursor-pointer" title="Next Mode">Skip</button>
      <button id="screensaverHudStop" class="px-2 py-0.5 rounded bg-red-600/30 hover:bg-red-600/50 text-red-300 text-[10px] cursor-pointer" title="Stop Screensaver">Stop</button>
    `;

    document.body.appendChild(hud);
    this.hud = hud;

    hud.querySelector('#screensaverHudSkip').addEventListener('click', (e) => {
      e.stopPropagation();
      this.cycleNext();
    });

    hud.querySelector('#screensaverHudStop').addEventListener('click', (e) => {
      e.stopPropagation();
      this.stop();
    });
  }

  openModal() {
    if (this.isRunning()) {
      this.stop();
      return;
    }
    this.modal.style.display = 'flex';
  }

  closeModal() {
    this.modal.style.display = 'none';
  }

  isRunning() {
    return store.get('isScreensaverActive') === true;
  }

  start(intervalSeconds) {
    this.stop();
    store.set('isScreensaverActive', true);

    showCanvasView();
    this.hud.style.display = 'flex';

    this.cycleNext();

    this.secondsRemaining = intervalSeconds;
    this.updateHudText();

    this.countdownId = setInterval(() => {
      this.secondsRemaining--;
      if (this.secondsRemaining <= 0) {
        this.secondsRemaining = intervalSeconds;
        this.cycleNext();
      }
      this.updateHudText();
    }, 1000);
  }

  cycleNext() {
    let candidateModes = [];
    if (this.filterCategory === 'all') {
      candidateModes = modeRegistry.getAllModes().filter(m => m.id !== 'color');
    } else {
      candidateModes = modeRegistry.getModesByCategory(this.filterCategory);
    }

    if (candidateModes.length === 0) return;

    // Avoid immediate repeats
    const filtered = candidateModes.filter(m => m.id !== this.lastModeId);
    const pool = filtered.length > 0 ? filtered : candidateModes;
    const picked = pool[(Math.random() * pool.length) | 0];

    this.lastModeId = picked.id;
    engine.switchMode(picked.id);
  }

  updateHudText() {
    const textEl = this.hud?.querySelector('#screensaverHudText');
    if (textEl) {
      textEl.textContent = `${this.secondsRemaining}s`;
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.countdownId) {
      clearInterval(this.countdownId);
      this.countdownId = null;
    }
    store.set('isScreensaverActive', false);
    if (this.hud) {
      this.hud.style.display = 'none';
    }
  }
}

export const screensaverController = new ScreensaverController();
