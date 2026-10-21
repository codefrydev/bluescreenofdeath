// Windows 10 BSOD Mode with QR code, progress simulation, and customizer support

import { BaseMode } from '../base-mode.js';
import { drawQRCodePattern } from '../../utils/drawing.js';

export class Win10BsodMode extends BaseMode {
  constructor() {
    super({
      id: 'win_10_bsod_enhanced',
      label: 'Windows 10 BSOD',
      category: 'windows',
      tags: ['windows', 'bsod', 'blue screen', 'error', 'crash'],
      options: {
        stopCode: 'CRITICAL_PROCESS_DIED',
        qrUrl: 'https://windows.com/stopcode',
        speed: 1.0
      }
    });

    this.progress = 0;
    this.lastProgressTime = 0;
    this.nextProgressDelay = 1.0;
    this.blackScreenActive = false;
    this.blackScreenStartTime = 0;
  }

  async init(engine, store) {
    super.init(engine, store);
    this.progress = 0;
    this.lastProgressTime = engine.getElapsedTime();
    this.nextProgressDelay = 0.8;
    this.blackScreenActive = false;
    this.blackScreenStartTime = 0;
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    const elapsedTime = engine.getElapsedTime();

    // Check if black screen restart is triggered
    if (this.blackScreenActive) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      if (elapsedTime - this.blackScreenStartTime >= 4.0) {
        // Reset simulation
        this.progress = 0;
        this.blackScreenActive = false;
        this.lastProgressTime = elapsedTime;
        this.nextProgressDelay = 1.0;
      }
      return;
    }

    // Advance progress simulation
    if (this.progress < 100) {
      if (elapsedTime - this.lastProgressTime >= this.nextProgressDelay) {
        const remaining = 100 - this.progress;
        const jump = remaining > 30 ? Math.random() * 15 + 5 : Math.random() * 8 + 1;
        this.progress = Math.min(100, Math.floor(this.progress + jump));
        this.lastProgressTime = elapsedTime;
        this.nextProgressDelay = Math.random() * 1.5 + 0.6;

        if (this.progress >= 100) {
          this.reached100Time = elapsedTime;
        }
      }
    } else {
      if (elapsedTime - this.reached100Time >= 3.0) {
        this.blackScreenActive = true;
        this.blackScreenStartTime = elapsedTime;
        return;
      }
    }

    // Windows 10 Blue Screen background
    ctx.fillStyle = '#0078D7';
    ctx.fillRect(0, 0, width, height);

    // Responsive sizing
    const isMobile = width < 640;
    const baseSize = isMobile ? Math.min(width, height) * 0.9 : Math.min(width, 1000);
    const startX = isMobile ? 24 : Math.max(48, width * 0.12);
    let startY = isMobile ? 40 : Math.max(60, height * 0.16);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';

    // Frowny face :(
    const sadFaceSize = isMobile ? 80 : 120;
    ctx.font = `300 ${sadFaceSize}px "Segoe UI", sans-serif`;
    ctx.fillText(':(', startX, startY + sadFaceSize * 0.8);

    startY += sadFaceSize + (isMobile ? 24 : 40);

    // Main header text
    const mainFontSize = isMobile ? 18 : 26;
    ctx.font = `300 ${mainFontSize}px "Segoe UI Light", "Segoe UI", sans-serif`;
    const line1 = "Your PC ran into a problem and needs to restart. We're";
    const line2 = "just collecting some error info, and then we'll restart for you.";

    ctx.fillText(line1, startX, startY);
    ctx.fillText(line2, startX, startY + mainFontSize * 1.4);

    startY += mainFontSize * 3.2;

    // Progress percentage
    ctx.font = `300 ${mainFontSize}px "Segoe UI", sans-serif`;
    ctx.fillText(`${Math.floor(this.progress)}% complete`, startX, startY);

    startY += mainFontSize * 2.8;

    // QR Code and stop code footer
    const qrSize = isMobile ? 80 : 110;
    drawQRCodePattern(ctx, startX, startY, qrSize);

    const textX = startX + qrSize + (isMobile ? 16 : 24);
    let footerY = startY + 16;

    ctx.font = `300 ${isMobile ? 11 : 13}px "Segoe UI", sans-serif`;
    ctx.fillText('For more information about this issue and possible fixes, visit', textX, footerY);
    footerY += 20;

    const qrUrl = this.options.qrUrl || 'https://windows.com/stopcode';
    ctx.font = `400 ${isMobile ? 11 : 13}px "Segoe UI", sans-serif`;
    ctx.fillText(qrUrl, textX, footerY);
    footerY += 28;

    ctx.font = `300 ${isMobile ? 10 : 12}px "Segoe UI", sans-serif`;
    ctx.fillText('If you call a support person, give them this info:', textX, footerY);
    footerY += 18;

    const stopCode = this.options.stopCode || 'CRITICAL_PROCESS_DIED';
    ctx.fillText(`Stop code: ${stopCode}`, textX, footerY);
  }
}
