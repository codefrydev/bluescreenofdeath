// Core Simulation Engine with HiDPI Scaling and Delta-Time RAF Loop

import { store } from './store.js';
import { modeRegistry } from '../config/mode-registry.js';
import { iframeManager } from './iframe-manager.js';

export class Engine {
  constructor() {
    this.canvas = document.getElementById('colorCanvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.activeMode = null;
    this.isRunning = false;
    this.rafId = null;
    this.lastTimestamp = 0;
    this.frame = 0;
    this.elapsedTime = 0;
    this.switchToken = 0;

    this.width = window.innerWidth || 1920;
    this.height = window.innerHeight || 1080;
    this.dpr = window.devicePixelRatio || 1;

    this.loop = this.loop.bind(this);
  }

  init() {
    if (!this.canvas) {
      this.canvas = document.getElementById('colorCanvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
      }
    }

    this.setupResizeListener();
    this.resizeCanvas();
    this.start();
  }

  setupResizeListener() {
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        this.resizeCanvas();
        if (this.activeMode && typeof this.activeMode.resize === 'function') {
          this.activeMode.resize(this.width, this.height, this.dpr);
        }
      });
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.resizeCanvas();
        if (this.activeMode && typeof this.activeMode.resize === 'function') {
          this.activeMode.resize(this.width, this.height, this.dpr);
        }
      }, 150);
    });
  }

  resizeCanvas() {
    if (!this.canvas || !this.ctx) return;

    this.width = window.innerWidth || 1920;
    this.height = window.innerHeight || 1080;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Cap at 2.5 for performance

    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Scale drawing context to logical CSS pixels
    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    this.rafId = requestAnimationFrame(this.loop);
  }

  pause() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (!this.isRunning) {
      this.start();
    }
  }

  async switchMode(modeId) {
    if (!modeId) return;

    this.switchToken++;
    const token = this.switchToken;

    // Teardown previous mode
    if (this.activeMode) {
      try {
        this.activeMode.cleanup(this);
      } catch (err) {
        console.warn('Error cleaning up mode:', err);
      }
      this.activeMode = null;
    }

    // Always clean up any existing iframes
    iframeManager.cleanup();

    const mode = modeRegistry.getMode(modeId);
    if (!mode) {
      console.warn(`Mode not found: ${modeId}, falling back to color`);
      if (modeId !== 'color') {
        await this.switchMode('color');
      }
      return;
    }

    this.activeMode = mode;
    store.set('currentMode', modeId);
    store.addRecent(modeId);

    // Reset frame and progress counters for the new mode
    this.frame = 0;
    this.elapsedTime = 0;

    try {
      await mode.init(this, store);
      if (token !== this.switchToken) {
        // Obsolete init, user switched mode while async loading
        return;
      }
    } catch (err) {
      console.error(`Error initializing mode "${modeId}":`, err);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;

    const rawDt = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Clamp dt to max 0.1s to prevent physics blowup when tab is backgrounded
    const dt = Math.max(0, Math.min(rawDt, 0.1));

    this.frame++;
    this.elapsedTime += dt;

    if (this.ctx && this.canvas && this.activeMode && this.activeMode.type !== 'iframe') {
      try {
        // Clear canvas in logical dimensions
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.activeMode.render(this.ctx, this, dt);
      } catch (err) {
        console.error('Error in render loop:', err);
      }
    }

    this.rafId = requestAnimationFrame(this.loop);
  }

  getLogicalWidth() {
    return this.width;
  }

  getLogicalHeight() {
    return this.height;
  }

  getDpr() {
    return this.dpr;
  }

  getFrame() {
    return this.frame;
  }

  getElapsedTime() {
    return this.elapsedTime;
  }
}

export const engine = new Engine();
