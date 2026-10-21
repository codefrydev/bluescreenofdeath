// High-Performance TV White Noise / Static Simulation

import { BaseMode } from '../base-mode.js';

export class WhiteNoiseMode extends BaseMode {
  constructor() {
    super({
      id: 'white_noise',
      label: 'White Noise',
      category: 'pranks',
      tags: ['prank', 'static', 'tv', 'white noise', 'crt', 'retro']
    });

    this.offscreenCanvas = null;
    this.offscreenCtx = null;
    this.bufferWidth = 256;
    this.bufferHeight = 144;
    this.imageData = null;
    this.buffer32 = null;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = this.bufferWidth;
    this.offscreenCanvas.height = this.bufferHeight;
    this.offscreenCtx = this.offscreenCanvas.getContext ? this.offscreenCanvas.getContext('2d') : null;

    if (this.offscreenCtx && typeof this.offscreenCtx.createImageData === 'function') {
      this.imageData = this.offscreenCtx.createImageData(this.bufferWidth, this.bufferHeight);
      this.buffer32 = new Uint32Array(this.imageData.data.buffer);
    } else {
      // Fallback / headless test environment support
      const buffer = new ArrayBuffer(this.bufferWidth * this.bufferHeight * 4);
      this.buffer32 = new Uint32Array(buffer);
    }
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    if (!this.buffer32) return;

    // Fast 32-bit integer noise generation
    const len = this.buffer32.length;
    for (let i = 0; i < len; i++) {
      // 8-bit luminance with 0xFF alpha (0xFFbbggrr in little-endian)
      const val = (Math.random() * 255) | 0;
      this.buffer32[i] = (255 << 24) | (val << 16) | (val << 8) | val;
    }

    if (this.offscreenCtx && this.imageData) {
      this.offscreenCtx.putImageData(this.imageData, 0, 0);

      // Render scaled up to full canvas with nearest-neighbor for authentic CRT static look
      const prevSmoothing = ctx.imageSmoothingEnabled;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.offscreenCanvas, 0, 0, width, height);
      ctx.imageSmoothingEnabled = prevSmoothing;
    }
  }

  cleanup(engine) {
    super.cleanup(engine);
    this.offscreenCanvas = null;
    this.offscreenCtx = null;
    this.imageData = null;
    this.buffer32 = null;
  }
}
