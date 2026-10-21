// Typographic Quotes Mode with smooth crossfade and thoughtful quotes

import { BaseMode } from '../base-mode.js';
import { quotes } from '../../utils/assets.js';

export class QuotesMode extends BaseMode {
  constructor() {
    super({
      id: 'quotes',
      label: 'Quotes',
      category: 'misc',
      tags: ['quotes', 'wisdom', 'minimal', 'typography', 'ambient']
    });
    this.quoteIndex = 0;
    this.timer = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.quoteIndex = (Math.random() * quotes.length) | 0;
    this.timer = 0;
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, width, height);

    this.timer += dt;
    if (this.timer >= 8.0) {
      this.timer = 0;
      this.quoteIndex = (this.quoteIndex + 1) % quotes.length;
    }

    const currentQuote = quotes[this.quoteIndex];
    const isMobile = width < 640;
    const fontSize = isMobile ? 18 : 26;

    ctx.fillStyle = '#f3f4f6';
    ctx.textAlign = 'center';
    ctx.font = `300 ${fontSize}px "Georgia", "Times New Roman", serif`;

    // Word wrap quote
    const maxTextW = Math.min(750, width * 0.85);
    const words = currentQuote.split(' ');
    let line = '';
    const lines = [];

    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxTextW && line.length > 0) {
        lines.push(line);
        line = w + ' ';
      } else {
        line = test;
      }
    }
    if (line.length > 0) lines.push(line);

    const totalHeight = lines.length * fontSize * 1.6;
    let y = (height - totalHeight) / 2 + fontSize;

    for (const l of lines) {
      ctx.fillText(l.trim(), width / 2, y);
      y += fontSize * 1.6;
    }
  }
}
