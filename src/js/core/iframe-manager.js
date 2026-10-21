// Unified Iframe Manager for Games and HTML Simulation Modes

import { loadTemplate } from '../utils/template-loader.js';

class IframeManager {
  constructor() {
    this.container = null;
    this.iframe = null;
    this.currentMode = null;
    this.pollInterval = null;
  }

  ensureContainer() {
    if (!this.container) {
      let existing = document.getElementById('app-iframe-container');
      if (!existing) {
        existing = document.createElement('div');
        existing.id = 'app-iframe-container';
        existing.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          background: #000;
          display: none;
        `;
        document.body.appendChild(existing);
      }
      this.container = existing;
    }
    return this.container;
  }

  async load(modeId, templatePath, autoStartType = 'default') {
    this.cleanup();
    this.currentMode = modeId;

    const container = this.ensureContainer();
    container.style.display = 'block';

    const canvas = document.getElementById('colorCanvas');
    if (canvas) canvas.style.display = 'none';

    const iframe = document.createElement('iframe');
    iframe.id = `${modeId}-iframe`;
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: #000;
      display: block;
    `;
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms';

    try {
      const template = await loadTemplate(modeId);
      if (template && template.html) {
        iframe.srcdoc = template.html;
      } else {
        iframe.src = templatePath;
      }
    } catch (e) {
      iframe.src = templatePath;
    }

    container.appendChild(iframe);
    this.iframe = iframe;

    this.setupAutoStart(iframe, autoStartType);

    // Focus iframe window once loaded so keyboard inputs work immediately
    iframe.addEventListener('load', () => {
      try {
        iframe.contentWindow?.focus();
      } catch (e) {
        // cross-origin safety
      }
    }, { once: true });
  }

  setupAutoStart(iframe, autoStartType) {
    let attempts = 0;
    const maxAttempts = 30;

    const tryStart = () => {
      attempts++;
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) {
          if (attempts < maxAttempts) {
            this.pollInterval = setTimeout(tryStart, 120);
          }
          return;
        }

        if (autoStartType === 'chess') {
          const btn = doc.getElementById('mode-cvc') || doc.querySelector('.btn-primary');
          if (btn) {
            btn.click();
            return;
          }
        } else if (autoStartType !== 'none') {
          const btn = doc.getElementById('start-btn') || doc.querySelector('.start-btn');
          if (btn) {
            btn.click();
            return;
          }
        }

        if (attempts < maxAttempts) {
          this.pollInterval = setTimeout(tryStart, 120);
        }
      } catch (e) {
        // ignore cross-origin error
      }
    };

    if (iframe.contentDocument) {
      tryStart();
    } else {
      iframe.addEventListener('load', tryStart, { once: true });
    }
  }

  cleanup() {
    if (this.pollInterval) {
      clearTimeout(this.pollInterval);
      this.pollInterval = null;
    }

    if (this.iframe) {
      try {
        this.iframe.src = 'about:blank';
      } catch (e) {}
      this.iframe.remove();
      this.iframe = null;
    }

    if (this.container) {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
    }

    const canvas = document.getElementById('colorCanvas');
    if (canvas && document.body.classList.contains('canvas-view')) {
      canvas.style.display = 'block';
    }

    this.currentMode = null;
  }
}

export const iframeManager = new IframeManager();
