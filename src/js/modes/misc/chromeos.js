// Chrome OS System Update & Boot Screen

import { BaseMode } from '../base-mode.js';
import { imgChrome } from '../../utils/assets.js';

export class ChromeOsMode extends BaseMode {
  constructor() {
    super({
      id: 'chromeos',
      label: 'Chrome OS',
      category: 'misc',
      tags: ['chrome', 'chromeos', 'google', 'update', 'chromebook']
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

    // Clean pure white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.42;

    // Chrome 4-color Logo
    const logoSize = Math.min(110, Math.min(width, height) * 0.2);
    if (imgChrome && imgChrome.complete) {
      ctx.drawImage(imgChrome, centerX - logoSize / 2, centerY - logoSize / 2 - 30, logoSize, logoSize);
    }

    // "chromeOS" Typography
    ctx.fillStyle = '#202124';
    ctx.textAlign = 'center';
    ctx.font = '500 28px "Google Sans", "Roboto", -apple-system, sans-serif';
    ctx.fillText('chromeOS', centerX, centerY + logoSize / 2 + 15);

    // Update progress
    this.progress = (this.progress + dt * 2.2) % 100;
    const barW = Math.min(300, width * 0.7);
    const barH = 5;
    const barX = centerX - barW / 2;
    const barY = centerY + logoSize / 2 + 65;

    // Bar background
    ctx.fillStyle = '#e8eaed';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 3);
    ctx.fill();

    // Bar fill
    ctx.fillStyle = '#1a73e8';
    ctx.beginPath();
    ctx.roundRect(barX, barY, (this.progress / 100) * barW, barH, 3);
    ctx.fill();

    // Subtitle
    ctx.fillStyle = '#5f6368';
    ctx.font = '400 14px "Google Sans", "Roboto", sans-serif';
    ctx.fillText(`Updating device... ${Math.floor(this.progress)}%`, centerX, barY + 30);
  }
}
