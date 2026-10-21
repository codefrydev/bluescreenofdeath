// SMPTE Color Bars / TV "NO SIGNAL" OSD Simulation

import { BaseMode } from '../base-mode.js';

export class NoSignalMode extends BaseMode {
  constructor() {
    super({
      id: 'no_signal',
      label: 'No Signal',
      category: 'pranks',
      tags: ['prank', 'tv', 'smpte', 'color bars', 'no signal', 'broadcast']
    });
    this.boxX = 100;
    this.boxY = 100;
    this.vx = 80;
    this.vy = 60;
  }

  async init(engine, store) {
    super.init(engine, store);
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    this.boxX = width * 0.3;
    this.boxY = height * 0.3;
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    // 1. Top Section (75% height) - 7 SMPTE Primary and Secondary bars
    const topHeight = height * 0.67;
    const colors7 = [
      '#C0C0C0', // Gray/White
      '#C0C000', // Yellow
      '#00C0C0', // Cyan
      '#00C000', // Green
      '#C000C0', // Magenta
      '#C00000', // Red
      '#0000C0'  // Blue
    ];

    const barW = width / 7;
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = colors7[i];
      ctx.fillRect(i * barW, 0, barW + 1, topHeight);
    }

    // 2. Middle Section (8% height) - Castellation bars
    const midHeight = height * 0.08;
    const midY = topHeight;
    const colorsCast = ['#0000C0', '#131313', '#C000C0', '#131313', '#00C0C0', '#131313', '#C0C0C0'];
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = colorsCast[i];
      ctx.fillRect(i * barW, midY, barW + 1, midHeight);
    }

    // 3. Bottom Section (25% height)
    const botY = midY + midHeight;
    const botHeight = height - botY;
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, botY, width, botHeight);

    // Floating OSD "NO SIGNAL" Box (bounces smoothly)
    const boxW = 200;
    const boxH = 65;

    this.boxX += this.vx * dt;
    this.boxY += this.vy * dt;

    if (this.boxX <= 0) {
      this.boxX = 0;
      this.vx = Math.abs(this.vx);
    } else if (this.boxX + boxW >= width) {
      this.boxX = width - boxW;
      this.vx = -Math.abs(this.vx);
    }

    if (this.boxY <= 0) {
      this.boxY = 0;
      this.vy = Math.abs(this.vy);
    } else if (this.boxY + boxH >= height) {
      this.boxY = height - boxH;
      this.vy = -Math.abs(this.vy);
    }

    // OSD dialog box
    ctx.fillStyle = 'rgba(0, 0, 180, 0.9)';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.fillRect(this.boxX, this.boxY, boxW, boxH);
    ctx.strokeRect(this.boxX, this.boxY, boxW, boxH);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 16px "Courier New", monospace';
    ctx.fillText('NO SIGNAL', this.boxX + boxW / 2, this.boxY + 28);
    ctx.font = '12px "Courier New", monospace';
    ctx.fillText('INPUT: HDMI 1', this.boxX + boxW / 2, this.boxY + 48);
  }
}
