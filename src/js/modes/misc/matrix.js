// Matrix Digital Rain with customizable color, speed, and glyph variety

import { BaseMode } from '../base-mode.js';
import { store } from '../../core/store.js';

export class MatrixMode extends BaseMode {
  constructor() {
    super({
      id: 'matrix',
      label: 'Matrix Rain',
      category: 'misc',
      tags: ['matrix', 'rain', 'code', 'cyberpunk', 'green', 'hacker', 'ambient'],
      options: {
        color: '#00ff66',
        speed: 1.0
      }
    });

    this.columns = [];
    this.glyphSet = "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEF$#@*";
    this.fontSize = 18;
  }

  async init(engine, storeRef) {
    super.init(engine, storeRef);
    const width = engine.getLogicalWidth();
    const cols = Math.floor(width / this.fontSize);
    this.columns = Array.from({ length: cols }, () => ({
      y: Math.random() * -600,
      speed: 160 + Math.random() * 220,
      length: 12 + Math.floor(Math.random() * 24),
      chars: []
    }));
  }

  resize(width, height, dpr) {
    const cols = Math.floor(width / this.fontSize);
    if (cols !== this.columns.length) {
      this.columns = Array.from({ length: cols }, () => ({
        y: Math.random() * -600,
        speed: 160 + Math.random() * 220,
        length: 12 + Math.floor(Math.random() * 24),
        chars: []
      }));
    }
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    const color = store.getModeOption('matrix', 'color', '#00ff66');

    // Fading background for phosphor trail effect
    ctx.fillStyle = 'rgba(0, 5, 2, 0.22)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${this.fontSize}px monospace`;
    ctx.textAlign = 'center';

    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];
      col.y += col.speed * dt;

      const x = i * this.fontSize + this.fontSize / 2;

      // Draw trail characters
      for (let j = 0; j < col.length; j++) {
        const charY = col.y - j * this.fontSize;
        if (charY < -this.fontSize || charY > height + this.fontSize) continue;

        // Pick random glyph occasionally
        if (!col.chars[j] || Math.random() < 0.05) {
          col.chars[j] = this.glyphSet[(Math.random() * this.glyphSet.length) | 0];
        }

        if (j === 0) {
          // Leading head character is bright white
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
        } else {
          // Trail fades out
          const alpha = Math.max(0.05, 1 - j / col.length);
          ctx.fillStyle = color;
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = 0;
        }

        ctx.fillText(col.chars[j], x, charY);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }

      // Reset when column falls off bottom
      if (col.y - col.length * this.fontSize > height) {
        col.y = Math.random() * -200;
        col.speed = 160 + Math.random() * 220;
      }
    }
  }
}
