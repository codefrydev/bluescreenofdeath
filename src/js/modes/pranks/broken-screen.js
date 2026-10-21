// Realistic Broken Screen Prank with Fractures, Glitches, and Dead Pixels

import { BaseMode } from '../base-mode.js';
import { drawBrokenScreen } from '../../utils/drawing.js';

export class BrokenScreenMode extends BaseMode {
  constructor() {
    super({
      id: 'broken_screen',
      label: 'Broken Screen',
      category: 'pranks',
      tags: ['prank', 'crack', 'broken', 'shattered', 'glitch', 'glass']
    });
    this.crackLines = [];
  }

  async init(engine, store) {
    super.init(engine, store);
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    this.crackLines = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      angle: Math.random() * Math.PI * 2,
      length: 120 + Math.random() * 450
    }));
  }

  render(ctx, engine, dt) {
    const canvasAdapter = {
      width: engine.getLogicalWidth(),
      height: engine.getLogicalHeight()
    };
    drawBrokenScreen(ctx, canvasAdapter, this.crackLines);
  }
}
