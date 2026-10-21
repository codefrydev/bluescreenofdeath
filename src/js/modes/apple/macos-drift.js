// macOS Particle Drift Ambient Animation

import { BaseMode } from '../base-mode.js';

export class MacosDriftMode extends BaseMode {
  constructor() {
    super({
      id: 'macos_drift',
      label: 'macOS Drift',
      category: 'apple',
      tags: ['apple', 'mac', 'particles', 'ambient', 'drift', 'screensaver']
    });
    this.particles = [];
  }

  async init(engine, store) {
    super.init(engine, store);
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    this.particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 60,
      vy: (Math.random() - 0.5) * 60,
      size: Math.random() * 3 + 1.5,
      hue: Math.random() * 360
    }));
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      p.hue = (p.hue + dt * 20) % 360;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, 0.85)`;
      ctx.fill();
    }
  }
}
