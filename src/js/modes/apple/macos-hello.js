// macOS Vintage "hello" Boot Mode

import { BaseMode } from '../base-mode.js';
import { imgAppleWhite } from '../../utils/assets.js';
import { drawMacOSProgressBar } from '../../utils/drawing.js';

export class MacosHelloMode extends BaseMode {
  constructor() {
    super({
      id: 'macos_hello',
      label: 'macOS Hello',
      category: 'apple',
      tags: ['apple', 'mac', 'hello', 'vintage', 'retro', '1984']
    });
    this.progress = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.progress = 0;
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Vintage "hello" script
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    const isMobile = width < 640;
    const helloSize = isMobile ? 64 : 110;
    ctx.font = `italic 300 ${helloSize}px "Brush Script MT", "Snell Roundhand", cursive, sans-serif`;
    ctx.fillText('hello', centerX, centerY - 60);

    // Progress bar
    this.progress = (this.progress + dt * 15) % 100;
    const barWidth = Math.min(260, width * 0.65);
    const barHeight = 4;
    const barX = centerX - barWidth / 2;
    const barY = centerY + 40;

    drawMacOSProgressBar(ctx, barX, barY, barWidth, barHeight, this.progress / 100);
  }
}
