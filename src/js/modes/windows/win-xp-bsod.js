// Classic Windows XP Blue Screen of Death

import { BaseMode } from '../base-mode.js';

export class WinXpBsodMode extends BaseMode {
  constructor() {
    super({
      id: 'win_xp_bsod',
      label: 'Windows XP BSOD',
      category: 'windows',
      tags: ['windows', 'xp', 'retro', 'bsod', 'classic', 'crash']
    });
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    ctx.fillStyle = '#0000AA';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';

    const isMobile = width < 640;
    const fontSize = isMobile ? 10 : 15;
    const lineHeight = fontSize * 1.5;
    ctx.font = `${fontSize}px "Courier New", "Lucida Console", monospace`;

    const startX = isMobile ? 16 : Math.max(40, width * 0.08);
    let y = isMobile ? 24 : Math.max(40, height * 0.08);

    const lines = [
      "A problem has been detected and Windows has been shut down to prevent damage",
      "to your computer.",
      "",
      "DRIVER_IRQL_NOT_LESS_OR_EQUAL",
      "",
      "If this is the first time you've seen this Stop error screen,",
      "restart your computer. If this screen appears again, follow",
      "these steps:",
      "",
      "Check to make sure any new hardware or software is properly installed.",
      "If this is a new installation, ask your hardware or software manufacturer",
      "for any Windows updates you might need.",
      "",
      "If problems continue, disable or remove any newly installed hardware",
      "or software. Disable BIOS memory options such as caching or shadowing.",
      "If you need to use Safe Mode to remove or disable components, restart",
      "your computer, press F8 to select Advanced Startup Options, and then",
      "select Safe Mode.",
      "",
      "Technical information:",
      "",
      "*** STOP: 0x000000D1 (0x0000000C, 0x00000002, 0x00000000, 0xF86B5A89)",
      "",
      "*** gv3.sys - Address F86B5A89 base at F86B5000, DateStamp 3dd991eb",
      "",
      "Beginning dump of physical memory",
      "Physical memory dump complete.",
      "Contact your system administrator or technical support group for further",
      "assistance."
    ];

    for (const line of lines) {
      if (y > height - 20) break;
      ctx.fillText(line, startX, y);
      y += lineHeight;
    }
  }
}
