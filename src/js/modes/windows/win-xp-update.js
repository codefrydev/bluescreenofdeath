// Windows XP Update Screen with nostalgic royal blue theme and progress bar

import { BaseMode } from '../base-mode.js';
import { drawWinXPUpdate } from '../../utils/drawing.js';

export class WinXpUpdateMode extends BaseMode {
  constructor() {
    super({
      id: 'win_xp_upd',
      label: 'Windows XP Update',
      category: 'windows',
      tags: ['windows', 'xp', 'update', 'nostalgia', 'retro']
    });
    this.progress = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.progress = 0;
  }

  render(ctx, engine, dt) {
    this.progress = (this.progress + dt * 4) % 100;
    // Pass logical dimensions via an adapter object
    const canvasAdapter = {
      width: engine.getLogicalWidth(),
      height: engine.getLogicalHeight()
    };
    drawWinXPUpdate(ctx, canvasAdapter, this.progress);
  }
}
