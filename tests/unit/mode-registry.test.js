import { describe, it, expect } from 'vitest';
import { modeRegistry, CATEGORIES } from '../../src/js/config/mode-registry.js';

describe('ModeRegistry', () => {
  it('should have all 5 standard categories', () => {
    const cats = modeRegistry.getCategories();
    expect(cats.length).toBe(5);
    const catIds = cats.map(c => c.id);
    expect(catIds).toContain('windows');
    expect(catIds).toContain('apple');
    expect(catIds).toContain('pranks');
    expect(catIds).toContain('misc');
    expect(catIds).toContain('games');
  });

  it('should register 37 modes without duplicate IDs', () => {
    const allModes = modeRegistry.getAllModes();
    expect(allModes.length).toBe(37);

    const ids = allModes.map(m => m.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(37);
  });

  it('should retrieve individual modes by ID', () => {
    const bsod = modeRegistry.getMode('win_10_bsod_enhanced');
    expect(bsod).toBeDefined();
    expect(bsod.label).toBe('Windows 10 BSOD');
    expect(bsod.category).toBe('windows');

    const matrix = modeRegistry.getMode('matrix');
    expect(matrix).toBeDefined();
    expect(matrix.label).toBe('Matrix Rain');
    expect(matrix.category).toBe('misc');

    const tetris = modeRegistry.getMode('tetris');
    expect(tetris).toBeDefined();
    expect(tetris.type).toBe('iframe');
    expect(tetris.category).toBe('games');
  });

  it('should accurately filter modes by category', () => {
    const games = modeRegistry.getModesByCategory('games');
    expect(games.length).toBe(13);

    const windowsModes = modeRegistry.getModesByCategory('windows');
    expect(windowsModes.length).toBe(6);

    const appleModes = modeRegistry.getModesByCategory('apple');
    expect(appleModes.length).toBe(6);

    const pranks = modeRegistry.getModesByCategory('pranks');
    expect(pranks.length).toBe(5);
  });

  it('should support search by label, id, and tags', () => {
    const bsodResults = modeRegistry.searchModes('bsod');
    expect(bsodResults.length).toBeGreaterThanOrEqual(2);

    const marioResults = modeRegistry.searchModes('mario');
    expect(marioResults.length).toBe(1);
    expect(marioResults[0].id).toBe('mario');

    const appleResults = modeRegistry.searchModes('apple');
    expect(appleResults.length).toBeGreaterThanOrEqual(5);
  });
});
