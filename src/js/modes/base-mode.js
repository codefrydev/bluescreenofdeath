// Abstract Base Mode class for all screen simulations and games

export class BaseMode {
  constructor(config = {}) {
    this.id = config.id || 'unnamed';
    this.label = config.label || 'Unnamed Simulation';
    this.category = config.category || 'misc';
    this.type = config.type || 'canvas'; // 'canvas' | 'iframe' | 'custom'
    this.tags = config.tags || [];
    this.options = config.options || {};
    this.isInitialized = false;
  }

  /**
   * Called once when the mode is switched to.
   * Can be async for template or asset loading.
   * @param {import('../core/engine.js').Engine} engine
   * @param {import('../core/store.js').store} store
   */
  async init(engine, store) {
    this.isInitialized = true;
  }

  /**
   * Frame render cycle.
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('../core/engine.js').Engine} engine
   * @param {number} dt Delta-time in seconds
   */
  render(ctx, engine, dt) {
    // Override in subclass
  }

  /**
   * Viewport resize callback.
   * @param {number} width CSS logical width
   * @param {number} height CSS logical height
   * @param {number} dpr Device pixel ratio
   */
  resize(width, height, dpr) {
    // Override in subclass if needed
  }

  /**
   * Teardown and cleanup when switching away.
   * @param {import('../core/engine.js').Engine} engine
   */
  cleanup(engine) {
    this.isInitialized = false;
  }

  /**
   * Optional user input handler (keys, clicks, taps).
   * @param {KeyboardEvent | MouseEvent | TouchEvent} event
   */
  onInput(event) {
    // Override in subclass if interactive
  }
}
