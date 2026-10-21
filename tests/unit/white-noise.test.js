import { describe, it, expect } from 'vitest';
import { WhiteNoiseMode } from '../../src/js/modes/pranks/white-noise.js';

describe('WhiteNoiseMode Performance & Lifecycle', () => {
  it('should initialize an offscreen 256x144 canvas and 32-bit buffer', async () => {
    const mode = new WhiteNoiseMode();
    const fakeEngine = {
      getLogicalWidth: () => 1920,
      getLogicalHeight: () => 1080
    };

    await mode.init(fakeEngine, {});
    expect(mode.offscreenCanvas).toBeDefined();
    expect(mode.offscreenCanvas.width).toBe(256);
    expect(mode.offscreenCanvas.height).toBe(144);
    expect(mode.buffer32).toBeDefined();
    expect(mode.buffer32.length).toBe(256 * 144);

    mode.cleanup(fakeEngine);
    expect(mode.offscreenCanvas).toBeNull();
    expect(mode.buffer32).toBeNull();
  });
});
