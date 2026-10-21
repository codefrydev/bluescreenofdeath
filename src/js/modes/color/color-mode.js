// Solid Color Display Mode

import { BaseMode } from '../base-mode.js';
import { store } from '../../core/store.js';

export class ColorMode extends BaseMode {
  constructor() {
    super({
      id: 'color',
      label: 'Solid Color',
      category: 'color',
      tags: ['color', 'solid', 'black', 'white', 'custom', 'screen test']
    });
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    const color = store.get('currentColor') || '#000000';

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  }
}
