import { describe, it, expect } from 'vitest';
import { parseTemplate } from '../../src/js/utils/template-loader.js';

describe('Template Loader & Parser', () => {
  it('should parse <canvas-template> structure with background and text elements', () => {
    const sampleHtml = `
      <canvas-template>
        <background color="#0078D7"/>
        <text x="100" y="200" font="24px sans-serif" color="#ffffff">Sample Text</text>
        <rect x="50" y="50" width="100" height="20" color="#ff0000"/>
      </canvas-template>
    `;

    const parsed = parseTemplate(sampleHtml);
    expect(parsed).toBeDefined();
    expect(parsed.background).toBeDefined();
    expect(parsed.background.color).toBe('#0078D7');

    expect(parsed.elements.length).toBe(2);
    expect(parsed.elements[0].type).toBe('text');
    expect(parsed.elements[0].content).toBe('Sample Text');
    expect(parsed.elements[1].type).toBe('rect');
    expect(parsed.elements[1].color).toBe('#ff0000');
  });

  it('should throw an error if root <canvas-template> is missing', () => {
    const invalidHtml = `<div><p>No template here</p></div>`;
    expect(() => parseTemplate(invalidHtml)).toThrow();
  });
});
