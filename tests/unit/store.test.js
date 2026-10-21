import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../../src/js/core/store.js';

describe('Reactive Store', () => {
  beforeEach(() => {
    store.set('currentMode', 'color');
    store.set('currentColor', '#000000');
  });

  it('should get and set state values', () => {
    expect(store.get('currentMode')).toBe('color');
    store.set('currentMode', 'win_10_bsod_enhanced');
    expect(store.get('currentMode')).toBe('win_10_bsod_enhanced');
  });

  it('should notify subscribers when a value changes', () => {
    let notifiedVal = null;
    let notifiedPrev = null;
    const unsub = store.subscribe('currentColor', (val, prev) => {
      notifiedVal = val;
      notifiedPrev = prev;
    });

    store.set('currentColor', '#ffffff');
    expect(notifiedVal).toBe('#ffffff');
    expect(notifiedPrev).toBe('#000000');

    unsub();
    store.set('currentColor', '#ff0000');
    expect(notifiedVal).toBe('#ffffff'); // should not be notified after unsub
  });

  it('should toggle favorites cleanly', () => {
    const isInitiallyFav = store.isFavorite('test_mode');
    store.toggleFavorite('test_mode');
    expect(store.isFavorite('test_mode')).toBe(!isInitiallyFav);

    store.toggleFavorite('test_mode');
    expect(store.isFavorite('test_mode')).toBe(isInitiallyFav);
  });

  it('should track recent modes with max cap', () => {
    store.addRecent('mode_1');
    store.addRecent('mode_2');
    store.addRecent('mode_3');

    const recents = store.get('recents');
    expect(recents[0]).toBe('mode_3');
    expect(recents[1]).toBe('mode_2');
    expect(recents[2]).toBe('mode_1');
  });
});
