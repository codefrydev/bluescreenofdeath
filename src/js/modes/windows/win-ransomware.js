// Windows Security Alert / Ransomware Simulation Mode

import { BaseMode } from '../base-mode.js';
import { iframeManager } from '../../core/iframe-manager.js';

export class WinRansomwareMode extends BaseMode {
  constructor() {
    super({
      id: 'win_ransomware',
      label: 'Windows Security Alert',
      category: 'windows',
      type: 'iframe',
      tags: ['windows', 'security', 'alert', 'ransomware', 'prank', 'virus']
    });
  }

  async init(engine, store) {
    super.init(engine, store);
    await iframeManager.load('win_ransomware', 'src/templates/windows/win_ransomware.html', 'none');
  }

  cleanup(engine) {
    super.cleanup(engine);
    iframeManager.cleanup();
  }
}
