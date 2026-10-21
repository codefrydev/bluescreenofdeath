// macOS Multi-Language Kernel Panic ("Gray Curtain") Simulation

import { BaseMode } from '../base-mode.js';

export class MacosPanicMode extends BaseMode {
  constructor() {
    super({
      id: 'macos_panic',
      label: 'Kernel Panic',
      category: 'apple',
      tags: ['apple', 'mac', 'kernel panic', 'crash', 'error']
    });
  }

  render(ctx, engine, dt) {
    const width = engine.getLogicalWidth();
    const height = engine.getLogicalHeight();

    // Dark charcoal translucent overlay
    ctx.fillStyle = 'rgba(28, 28, 30, 0.96)';
    ctx.fillRect(0, 0, width, height);

    // Power icon / box in center
    const isMobile = width < 640;
    const boxWidth = isMobile ? width * 0.9 : Math.min(680, width * 0.8);
    const boxHeight = isMobile ? height * 0.85 : 440;
    const boxX = (width - boxWidth) / 2;
    const boxY = Math.max(20, (height - boxHeight) / 2);

    ctx.fillStyle = '#0a0a0a';
    ctx.strokeStyle = '#444444';
    ctx.lineWidth = 1;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Power symbol at top of box
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    const powerX = width / 2;
    const powerY = boxY + 45;
    ctx.beginPath();
    ctx.arc(powerX, powerY, 16, -Math.PI * 0.7, Math.PI * 1.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(powerX, powerY - 22);
    ctx.lineTo(powerX, powerY - 4);
    ctx.stroke();

    // Multi-language restart messages
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    const fontSize = isMobile ? 10 : 12;
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`;

    const messages = [
      "You need to restart your computer. Hold down the Power button for several seconds or press the Restart button.",
      "Veuillez redémarrer votre ordinateur. Maintenez la touche de démarrage enfoncée pendant plusieurs secondes ou appuyez sur le bouton de réinitialisation.",
      "Sie müssen Ihren Computer neu starten. Halten Sie dazu die Einschalttaste einige Sekunden gedrückt oder drücken Sie die Neustart-Taste.",
      "Es necesario reiniciar el ordenador. Mantenga pulsado el botón de encendido durante unos segundos o pulse el botón de reinicio.",
      "コンピュータを再起動する必要があります。パワーボタンを数秒間押し続けるか、リセットボタンを押してください。"
    ];

    let textY = powerY + 40;
    const step = isMobile ? 48 : 55;

    for (const msg of messages) {
      if (textY > boxY + boxHeight - 20) break;
      ctx.fillText(msg, width / 2, textY, boxWidth - 30);
      textY += step;
    }
  }
}
