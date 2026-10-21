// Classic BIOS Boot Screen with memory counting animation

import { BaseMode } from '../base-mode.js';

export class WinBiosMode extends BaseMode {
  constructor() {
    super({
      id: 'win_bios',
      label: 'BIOS Boot',
      category: 'windows',
      tags: ['windows', 'bios', 'boot', 'retro', 'hardware', 'pc']
    });
    this.memCount = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.memCount = 0;
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#C0C0C0';
    ctx.textAlign = 'left';

    const isMobile = width < 640;
    const fontSize = isMobile ? 11 : 16;
    const lineHeight = fontSize * 1.45;
    ctx.font = `${fontSize}px "Courier New", monospace`;

    const startX = isMobile ? 16 : 40;
    let y = isMobile ? 24 : 45;

    // Fast memory counting up to 65536 KB (64MB RAM)
    if (this.memCount < 65536) {
      this.memCount += Math.floor(dt * 30000);
      if (this.memCount > 65536) this.memCount = 65536;
    }

    const lines = [
      "Award Modular BIOS v4.51PG, An Energy Star Ally",
      "Copyright (C) 1984-98, Award Software, Inc.",
      "",
      "PENTIUM II-MMX CPU at 400MHz",
      `Memory Test :  ${this.memCount}K OK`,
      "",
      "Award Plug and Play BIOS Extension v1.0A",
      "Initialize Plug and Play Cards...",
      "PNP Init Completed",
      "",
      "Detecting Primary Master    ... WDC AC310200R",
      "Detecting Primary Slave     ... None",
      "Detecting Secondary Master  ... ATAPI CD-ROM 48X",
      "Detecting Secondary Slave   ... None",
      "",
      "Press DEL to enter SETUP",
      "08/12/1998-i440BX-W977-2A69KD4FC-00"
    ];

    for (const line of lines) {
      ctx.fillText(line, startX, y);
      y += lineHeight;
    }

    // Energy Star Logo at top right
    if (!isMobile && width > 700) {
      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      ctx.strokeRect(width - 160, 30, 120, 80);
      ctx.fillStyle = '#00FF00';
      ctx.font = '10px "Courier New", monospace';
      ctx.fillText('energy', width - 128, 65);
      ctx.font = '8px "Courier New", monospace';
      ctx.fillText('EPA POLLUTION PREVENTER', width - 155, 95);
    }
  }
}
