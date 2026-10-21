// Authentic macOS Boot screen with phase transitions and smooth progress bar

import { BaseMode } from '../base-mode.js';
import { imgAppleWhite } from '../../utils/assets.js';
import { drawMacOSBootProgressBar } from '../../utils/drawing.js';

export class MacosBootMode extends BaseMode {
  constructor() {
    super({
      id: 'macos_boot',
      label: 'macOS Boot',
      category: 'apple',
      tags: ['apple', 'mac', 'macos', 'boot', 'apple logo']
    });

    this.progress = 0;
    this.bootPhase = 'booting';
    this.phaseStartTime = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.progress = 0;
    this.bootPhase = 'booting';
    this.phaseStartTime = engine.getElapsedTime();
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    const elapsedTime = engine.getElapsedTime();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.45;

    // Crisp White Apple Logo
    const logoSize = Math.min(100, Math.min(width, height) * 0.16);
    if (imgAppleWhite && imgAppleWhite.complete) {
      ctx.drawImage(imgAppleWhite, centerX - logoSize / 2, centerY - logoSize / 2 - 20, logoSize, logoSize);
    }

    // Realistic macOS boot progress (fast initial, pauses at 80%, then finishes)
    if (this.progress < 100) {
      const rate = this.progress > 75 && this.progress < 85 ? 0.08 : 0.25;
      this.progress = Math.min(100, this.progress + dt * 10 * rate);
    } else {
      if (!this.fadeStartTime) this.fadeStartTime = elapsedTime;
      if (elapsedTime - this.fadeStartTime > 3.0) {
        // Reset cycle
        this.progress = 0;
        this.fadeStartTime = null;
      }
    }

    const barWidth = Math.min(240, width * 0.6);
    const barHeight = 4;
    const barX = centerX - barWidth / 2;
    const barY = centerY + logoSize / 2 + 50;

    drawMacOSBootProgressBar(ctx, barX, barY, barWidth, barHeight, this.progress);
  }
}
