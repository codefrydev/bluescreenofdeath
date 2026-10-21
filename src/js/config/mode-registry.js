// Central Mode Registry & Catalog for all Screen Simulations and Games

import { Win10BsodMode } from '../modes/windows/win10-bsod.js';
import { WinXpBsodMode } from '../modes/windows/win-xp-bsod.js';
import { WinBiosMode } from '../modes/windows/win-bios.js';
import { Win11LoadingMode } from '../modes/windows/win11-loading.js';
import { WinXpUpdateMode } from '../modes/windows/win-xp-update.js';
import { WinRansomwareMode } from '../modes/windows/win-ransomware.js';

import { MacosBootMode } from '../modes/apple/macos-boot.js';
import { MacosHelloMode } from '../modes/apple/macos-hello.js';
import { MacosPanicMode } from '../modes/apple/macos-panic.js';
import { MacosDriftMode } from '../modes/apple/macos-drift.js';
import { IosUpdateMode } from '../modes/apple/ios-update.js';
import { IosDisabledMode } from '../modes/apple/ios-disabled.js';

import { BrokenScreenMode } from '../modes/pranks/broken-screen.js';
import { WhiteNoiseMode } from '../modes/pranks/white-noise.js';
import { RadarMode } from '../modes/pranks/radar.js';
import { HackerTyperMode } from '../modes/pranks/hacker-typer.js';
import { NoSignalMode } from '../modes/pranks/no-signal.js';

import { UbuntuMode } from '../modes/misc/ubuntu.js';
import { ChromeOsMode } from '../modes/misc/chromeos.js';
import { MatrixMode } from '../modes/misc/matrix.js';
import { DvdMode } from '../modes/misc/dvd.js';
import { FlipClockMode } from '../modes/misc/flip-clock.js';
import { QuotesMode } from '../modes/misc/quotes.js';

import { ColorMode } from '../modes/color/color-mode.js';
import { createGameModes } from '../modes/games/game-mode.js';

export const CATEGORIES = [
  { id: 'windows', label: 'Windows', icon: '🪟', order: 1, desc: 'BSOD, boot, BIOS, and update sequences' },
  { id: 'apple', label: 'Apple', icon: '🍎', order: 2, desc: 'macOS, iOS, kernel panics, and lockouts' },
  { id: 'pranks', label: 'Pranks', icon: '😈', order: 3, desc: 'Broken screens, static, radar, and hacker typer' },
  { id: 'misc', label: 'More', icon: '➕', order: 4, desc: 'Ubuntu, ChromeOS, Matrix digital rain, flip clock, DVD' },
  { id: 'games', label: 'Games', icon: '🎮', order: 5, desc: 'Playable retro and neo-arcade simulations' }
];

class ModeRegistry {
  constructor() {
    this.modes = new Map();
    this.categories = [...CATEGORIES].sort((a, b) => a.order - b.order);
    this.registerAll();
  }

  register(modeInstance) {
    if (!modeInstance || !modeInstance.id) return;
    this.modes.set(modeInstance.id, modeInstance);
  }

  registerAll() {
    // Windows
    this.register(new WinXpUpdateMode());
    this.register(new Win10BsodMode());
    this.register(new WinXpBsodMode());
    this.register(new WinBiosMode());
    this.register(new Win11LoadingMode());
    this.register(new WinRansomwareMode());

    // Apple
    this.register(new MacosDriftMode());
    this.register(new MacosHelloMode());
    this.register(new MacosBootMode());
    this.register(new MacosPanicMode());
    this.register(new IosUpdateMode());
    this.register(new IosDisabledMode());

    // Pranks
    this.register(new BrokenScreenMode());
    this.register(new WhiteNoiseMode());
    this.register(new RadarMode());
    this.register(new HackerTyperMode());
    this.register(new NoSignalMode());

    // Misc
    this.register(new UbuntuMode());
    this.register(new ChromeOsMode());
    this.register(new MatrixMode());
    this.register(new DvdMode());
    this.register(new FlipClockMode());
    this.register(new QuotesMode());

    // Color
    this.register(new ColorMode());

    // Games
    const gameModes = createGameModes();
    for (const gm of gameModes) {
      this.register(gm);
    }
  }

  getMode(id) {
    return this.modes.get(id) || null;
  }

  getAllModes() {
    return Array.from(this.modes.values());
  }

  getCategories() {
    return this.categories;
  }

  getCategory(catId) {
    return this.categories.find(c => c.id === catId) || null;
  }

  getModesByCategory(categoryId) {
    return this.getAllModes().filter(m => m.category === categoryId);
  }

  getCategoryForMode(modeId) {
    const mode = this.getMode(modeId);
    return mode ? mode.category : null;
  }

  searchModes(query) {
    if (!query || typeof query !== 'string') return this.getAllModes();
    const q = query.trim().toLowerCase();
    return this.getAllModes().filter(m => {
      if (m.id.toLowerCase().includes(q)) return true;
      if (m.label.toLowerCase().includes(q)) return true;
      if (m.category.toLowerCase().includes(q)) return true;
      if (m.tags && m.tags.some(t => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }
}

export const modeRegistry = new ModeRegistry();

// Backward compatibility exports for existing templates and utilities
export const MODES = modeRegistry.getAllModes();
export function getCategoryForMode(modeId) { return modeRegistry.getCategoryForMode(modeId); }
export function getMode(modeId) { return modeRegistry.getMode(modeId); }
export function getModesForCategory(categoryId) { return modeRegistry.getModesByCategory(categoryId); }
export function getCategories() { return modeRegistry.getCategories(); }
export function getTemplatePath(modeId) {
  const mode = modeRegistry.getMode(modeId);
  if (!mode || mode.type === 'custom' || mode.id === 'color') return null;
  return `src/templates/${mode.category}/${mode.id}.html`;
}
export function isRawHtmlMode(modeId) {
  const mode = modeRegistry.getMode(modeId);
  return mode ? mode.type === 'iframe' : false;
}
