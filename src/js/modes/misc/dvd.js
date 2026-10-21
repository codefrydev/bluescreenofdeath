// Classic DVD Bouncing Screensaver with Corner-Hit Detection and Color Shifts

import { BaseMode } from '../base-mode.js';

export class DvdMode extends BaseMode {
  constructor() {
    super({
      id: 'dvd',
      label: 'DVD Bouncing',
      category: 'misc',
      tags: ['dvd', 'bouncing', 'screensaver', 'retro', 'corner', 'logo']
    });

    this.x = 100;
    this.y = 100;
    this.vx = 140;
    this.vy = 120;
    this.boxW = 140;
    this.boxH = 70;
    this.colors = ['#ff3366', '#33ccff', '#ffcc00', '#33ff66', '#cc33ff', '#ff6600'];
    this.colorIndex = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    this.x = Math.max(20, Math.random() * (width - this.boxW - 40));
    this.y = Math.max(20, Math.random() * (height - this.boxH - 40));
    this.colorIndex = (Math.random() * this.colors.length) | 0;
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    let hit = false;

    if (this.x <= 0) {
      this.x = 0;
      this.vx = Math.abs(this.vx);
      hit = true;
    } else if (this.x + this.boxW >= width) {
      this.x = width - this.boxW;
      this.vx = -Math.abs(this.vx);
      hit = true;
    }

    if (this.y <= 0) {
      this.y = 0;
      this.vy = Math.abs(this.vy);
      hit = true;
    } else if (this.y + this.boxH >= height) {
      this.y = height - this.boxH;
      this.vy = -Math.abs(this.vy);
      hit = true;
    }

    if (hit) {
      this.colorIndex = (this.colorIndex + 1) % this.colors.length;
    }

    const currentColor = this.colors[this.colorIndex];

    // Draw DVD Badge
    ctx.save();
    ctx.fillStyle = currentColor;
    ctx.shadowColor = currentColor;
    ctx.shadowBlur = 12;

    // Disc Ellipse
    ctx.beginPath();
    ctx.ellipse(this.x + this.boxW / 2, this.y + this.boxH * 0.72, this.boxW * 0.44, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // "DVD" Bold Typography
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px "Arial Black", Impact, sans-serif';
    ctx.fillText('DVD', this.x + this.boxW / 2, this.y + 40);

    // "VIDEO" Subtitle
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('V I D E O', this.x + this.boxW / 2, this.y + 58);

    ctx.restore();
  }
}
