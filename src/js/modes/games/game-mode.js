// Unified Iframe Game Mode Engine

import { BaseMode } from '../base-mode.js';
import { iframeManager } from '../../core/iframe-manager.js';

export class IframeGameMode extends BaseMode {
  constructor(config = {}) {
    super({
      ...config,
      category: 'games',
      type: 'iframe',
      tags: ['game', 'arcade', 'retro', ...(config.tags || [])]
    });
    this.autoStartType = config.autoStartType || 'default';
    this.templatePath = config.templatePath || `src/templates/games/${config.id}.html`;
  }

  async init(engine, store) {
    super.init(engine, store);
    await iframeManager.load(this.id, this.templatePath, this.autoStartType);
  }

  cleanup(engine) {
    super.cleanup(engine);
    iframeManager.cleanup();
  }
}

export const GAME_DEFINITIONS = [
  { id: 'tetris', label: 'Tetris Horizon Engine', tags: ['tetris', 'blocks', 'puzzle'] },
  { id: 'snake', label: 'Snake Engine Simulation', tags: ['snake', 'classic', 'arcade'] },
  { id: 'pacman', label: 'Pac-Man Engine - Turbo Edition', tags: ['pacman', 'ghosts', 'retro', 'namco'] },
  { id: 'mario', label: 'Super Mario Engine - Auto Simulation', tags: ['mario', 'nintendo', 'platformer'] },
  { id: 'flap', label: 'Neon Flap - Full Width Engine', tags: ['flappy', 'neon', 'tap'] },
  { id: 'neon_vector', label: 'Neon Vector - Space Engine', tags: ['space', 'asteroids', 'vector', 'shooter'] },
  { id: 'neon_boids', label: 'Neon Boids - Morphological Evolution', tags: ['boids', 'flocking', 'evolution', 'simulation'] },
  { id: 'chess', label: 'Chess Pro - AI & Multiplayer Edition', tags: ['chess', 'board game', 'ai'], autoStartType: 'chess' },
  { id: 'circular_maze', label: 'Infinite Circular Maze - Neural Engine', tags: ['maze', 'circular', 'algorithm'] },
  { id: 'maze', label: 'Infinite Maze - High Performance Engine', tags: ['maze', 'labyrinth', 'pathfinding'] },
  { id: 'neon_ecosystem', label: '3D Neon Ecosystem', tags: ['3d', 'ecosystem', 'particles', 'life'] },
  { id: 'koi_pond', label: 'Procedural Koi Pond', tags: ['koi', 'water', 'pond', 'zen', 'relaxing'] },
  { id: 'game_2048', label: '2048 Engine', tags: ['2048', 'numbers', 'puzzle', 'slide'] }
];

export function createGameModes() {
  return GAME_DEFINITIONS.map(def => new IframeGameMode(def));
}
