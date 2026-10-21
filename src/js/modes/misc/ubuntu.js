// Ubuntu 22.04 LTS Boot and Loading Simulation

import { BaseMode } from '../base-mode.js';
import { imgUbuntu } from '../../utils/assets.js';

export class UbuntuMode extends BaseMode {
  constructor() {
    super({
      id: 'ubuntu',
      label: 'Ubuntu 22.04',
      category: 'misc',
      tags: ['ubuntu', 'linux', 'boot', 'canonical', 'distro']
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

    // Dark aubergine / Ubuntu signature background
    ctx.fillStyle = '#2c001e';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.42;

    // Ubuntu Circle of Friends Logo
    const logoSize = Math.min(130, Math.min(width, height) * 0.22);
    if (imgUbuntu && imgUbuntu.complete) {
      ctx.drawImage(imgUbuntu, centerX - logoSize / 2, centerY - logoSize / 2 - 20, logoSize, logoSize);
    }

    // Ubuntu Wordmark
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '300 32px "Ubuntu", -apple-system, sans-serif';
    ctx.fillText('ubuntu', centerX, centerY + logoSize / 2 + 25);

    // 4 Pulsing Dots Spinner
    const dotCount = 4;
    const dotSpacing = 16;
    const totalDotW = (dotCount - 1) * dotSpacing;
    const startDotX = centerX - totalDotW / 2;
    const dotY = centerY + logoSize / 2 + 70;

    for (let i = 0; i < dotCount; i++) {
      const pulse = Math.sin((frame / 12) - (i * 0.5));
      const alpha = 0.3 + 0.7 * Math.max(0, pulse);
      ctx.fillStyle = `rgba(233, 84, 32, ${alpha})`;
      ctx.beginPath();
      ctx.arc(startDotX + i * dotSpacing, dotY, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
