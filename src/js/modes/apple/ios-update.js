// iOS Update Simulation Mode with Apple Logo and progress bar

import { BaseMode } from '../base-mode.js';
import { imgAppleWhite } from '../../utils/assets.js';
import { drawiOSProgressBar } from '../../utils/drawing.js';

export class IosUpdateMode extends BaseMode {
  constructor() {
    super({
      id: 'ios_update',
      label: 'iOS Update',
      category: 'apple',
      tags: ['apple', 'ios', 'iphone', 'ipad', 'update', 'loading']
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
    const elapsedTime = engine.getElapsedTime();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.44;

    const logoSize = Math.min(110, Math.min(width, height) * 0.18);
    if (imgAppleWhite && imgAppleWhite.complete) {
      ctx.drawImage(imgAppleWhite, centerX - logoSize / 2, centerY - logoSize / 2 - 20, logoSize, logoSize);
    }

    this.progress = (this.progress + dt * 2.5) % 100;
    const barWidth = Math.min(260, width * 0.65);
    const barHeight = 4;
    const barX = centerX - barWidth / 2;
    const barY = centerY + logoSize / 2 + 50;

    drawiOSProgressBar(ctx, barX, barY, barWidth, barHeight, this.progress / 100);

    const updateMessages = ['Preparing update...', 'Verifying update...', 'Installing update...', 'Finishing up...'];
    const msgIdx = Math.floor((elapsedTime / 4) % updateMessages.length);

    ctx.fillStyle = '#8e8e93';
    ctx.textAlign = 'center';
    ctx.font = '400 15px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillText(updateMessages[msgIdx], centerX, barY + 36);
  }
}
