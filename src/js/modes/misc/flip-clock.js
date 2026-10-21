// Retro Flip Clock Simulation with Smooth Card Split and Seconds Pulse

import { BaseMode } from '../base-mode.js';

export class FlipClockMode extends BaseMode {
  constructor() {
    super({
      id: 'flip_clock',
      label: 'Flip Clock',
      category: 'misc',
      tags: ['clock', 'time', 'flip clock', 'retro', 'minimal', 'ambient']
    });
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    ctx.fillStyle = '#0f1117';
    ctx.fillRect(0, 0, width, height);

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const isMobile = width < 640;
    const cardW = isMobile ? width * 0.25 : Math.min(180, width * 0.22);
    const cardH = cardW * 1.25;
    const gap = isMobile ? 8 : 16;
    const totalW = cardW * 3 + gap * 2;
    const startX = (width - totalW) / 2;
    const startY = (height - cardH) / 2;

    const renderCard = (val, x, label) => {
      // Rounded Card container
      ctx.fillStyle = '#1c1f2b';
      ctx.strokeStyle = '#2d3245';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x, startY, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      // Horizontal flip divider line
      ctx.strokeStyle = '#0f1117';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, startY + cardH / 2);
      ctx.lineTo(x + cardW, startY + cardH / 2);
      ctx.stroke();

      // Digit
      ctx.fillStyle = '#f3f4f6';
      ctx.textAlign = 'center';
      const fontSize = Math.floor(cardH * 0.65);
      ctx.font = `700 ${fontSize}px "Inter", "Helvetica Neue", sans-serif`;
      ctx.fillText(val, x + cardW / 2, startY + cardH * 0.72);

      // Label (HOURS, MINUTES, SECONDS)
      ctx.fillStyle = '#6b7280';
      ctx.font = `600 ${isMobile ? 8 : 11}px sans-serif`;
      ctx.fillText(label, x + cardW / 2, startY + cardH + 24);
    };

    renderCard(hours, startX, 'HOURS');
    renderCard(minutes, startX + cardW + gap, 'MINUTES');
    renderCard(seconds, startX + (cardW + gap) * 2, 'SECONDS');
  }
}
