// Windows 11 Loading and Update Screen with Fluent Spinner

import { BaseMode } from '../base-mode.js';
import { imgWin } from '../../utils/assets.js';
import { drawWin11Spinner } from '../../utils/drawing.js';

export class Win11LoadingMode extends BaseMode {
  constructor() {
    super({
      id: 'win_11_loading',
      label: 'Windows 11 Loading',
      category: 'windows',
      tags: ['windows', 'windows 11', 'loading', 'spinner', 'update']
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
    const frame = engine.getFrame();

    // Windows 11 Black/Very Dark Navy background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.42;

    // Windows 11 Fluent Blue Logo
    const logoSize = Math.min(100, Math.min(width, height) * 0.18);
    if (imgWin && imgWin.complete) {
      ctx.drawImage(imgWin, centerX - logoSize / 2, centerY - logoSize - 30, logoSize, logoSize);
    }

    // Windows 11 Modern Smooth 5-dot Spinner
    drawWin11Spinner(ctx, centerX, centerY + 40, 24, frame);

    // Realistic slow progress simulation
    this.progress = (this.progress + dt * 1.5) % 100;
    const percentInt = Math.floor(this.progress);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 24px "Segoe UI Variable", "Segoe UI", sans-serif';
    ctx.fillText('Working on updates', centerX, centerY + 110);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '400 16px "Segoe UI Variable", "Segoe UI", sans-serif';
    ctx.fillText(`${percentInt}% complete`, centerX, centerY + 145);
    ctx.fillText("Please keep your computer on.", centerX, centerY + 175);
  }
}
