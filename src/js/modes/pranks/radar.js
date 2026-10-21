// Military / Sci-Fi Radar Screen with Rotating Sweep and Phosphor Blips

import { BaseMode } from '../base-mode.js';

export class RadarMode extends BaseMode {
  constructor() {
    super({
      id: 'radar',
      label: 'Radar Screen',
      category: 'pranks',
      tags: ['prank', 'radar', 'military', 'sonar', 'sci-fi', 'green']
    });
    this.angle = 0;
    this.blips = [];
  }

  async init(engine, store) {
    super.init(engine, store);
    this.angle = 0;
    this.blips = [
      { r: 0.35, theta: 1.2, intensity: 1 },
      { r: 0.65, theta: 3.8, intensity: 0.8 },
      { r: 0.5, theta: 5.2, intensity: 0.9 },
      { r: 0.8, theta: 2.1, intensity: 0.7 }
    ];
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    // Deep black background
    ctx.fillStyle = '#050c05';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(cx, cy) * 0.85;

    // Outer and concentric range rings
    ctx.strokeStyle = '#00aa33';
    ctx.lineWidth = 1.5;

    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (maxRadius / 4) * i, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx - maxRadius, cy);
    ctx.lineTo(cx + maxRadius, cy);
    ctx.moveTo(cx, cy - maxRadius);
    ctx.lineTo(cx, cy + maxRadius);
    ctx.stroke();

    // Rotate sweep
    this.angle = (this.angle + dt * 1.8) % (Math.PI * 2);

    // Sweep line
    const sweepX = cx + Math.cos(this.angle) * maxRadius;
    const sweepY = cy + Math.sin(this.angle) * maxRadius;

    ctx.strokeStyle = '#33ff66';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sweepX, sweepY);
    ctx.stroke();

    // Phosphor sweep trail
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, maxRadius, this.angle - 0.45, this.angle);
    ctx.closePath();
    const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
    gradient.addColorStop(0, 'rgba(0, 255, 68, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 255, 68, 0.02)');
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.restore();

    // Render blips
    for (const b of this.blips) {
      const bx = cx + Math.cos(b.theta) * (maxRadius * b.r);
      const by = cy + Math.sin(b.theta) * (maxRadius * b.r);

      // Distance in angle
      const diff = (this.angle - b.theta + Math.PI * 2) % (Math.PI * 2);
      const alpha = diff < 0.6 ? 1 - diff / 0.6 : 0.15;

      ctx.fillStyle = `rgba(50, 255, 100, ${alpha})`;
      ctx.beginPath();
      ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring for fresh blip
      if (diff < 0.25) {
        ctx.strokeStyle = `rgba(150, 255, 180, ${1 - diff / 0.25})`;
        ctx.beginPath();
        ctx.arc(bx, by, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
}
