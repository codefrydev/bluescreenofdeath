// iPhone Disabled / Connect to iTunes Mode

import { BaseMode } from '../base-mode.js';

export class IosDisabledMode extends BaseMode {
  constructor() {
    super({
      id: 'ios_disabled',
      label: 'iPhone Disabled',
      category: 'apple',
      tags: ['apple', 'ios', 'iphone', 'disabled', 'lockout', 'prank']
    });
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();
    const elapsedTime = engine.getElapsedTime();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height * 0.45;
    const isMobile = width < 640;

    ctx.textAlign = 'center';

    // Lock icon / "iPhone is Disabled"
    ctx.fillStyle = '#ffffff';
    const titleSize = isMobile ? 24 : 32;
    ctx.font = `600 ${titleSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;
    ctx.fillText('iPhone is Disabled', centerX, centerY);

    // Try again in X minutes
    const remainingMins = Math.max(1, 15 - Math.floor(elapsedTime / 60));
    ctx.fillStyle = '#e5e7eb';
    const subSize = isMobile ? 16 : 20;
    ctx.font = `400 ${subSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
    ctx.fillText(`try again in ${remainingMins} minutes`, centerX, centerY + subSize * 2.2);

    // Emergency button at bottom
    ctx.fillStyle = '#3b82f6';
    ctx.font = `500 ${isMobile ? 16 : 18}px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;
    ctx.fillText('Emergency', centerX, height - (isMobile ? 50 : 80));
  }
}
