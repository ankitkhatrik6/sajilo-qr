import { describe, it } from 'node:test';
import assert from 'node:assert';
import { sajilo, SajiloError } from '../src/index';

describe('sajilo.generate and output methods', () => {
  it('should generate a valid data URL with default options', async () => {
    const qr = await sajilo.generate('https://example.com');
    assert.strictEqual(typeof qr, 'string');
    assert.strictEqual(qr.startsWith('data:image/png;base64,'), true);
    assert.strictEqual(qr.length > 50, true);
  });

  it('should generate a valid data URL with custom options', async () => {
    const qr = await sajilo.generate('Hello Nepal', {
      size: 400,
      margin: 4,
      dark: '#1e293b',
      light: '#f8fafc',
      errorCorrection: 'H',
    });
    assert.strictEqual(typeof qr, 'string');
    assert.strictEqual(qr.startsWith('data:image/png;base64,'), true);
  });

  it('should generate valid data URL via sajilo.toDataURL', async () => {
    const qr = await sajilo.toDataURL('https://sajilo.dev');
    assert.strictEqual(typeof qr, 'string');
    assert.strictEqual(qr.startsWith('data:image/png;base64,'), true);
  });

  it('should generate valid SVG content via sajilo.toSVG', async () => {
    const svg = await sajilo.toSVG('https://example.com/nepal');
    assert.strictEqual(typeof svg, 'string');
    assert.strictEqual(svg.includes('<svg'), true);
    assert.strictEqual(svg.includes('xmlns="http://www.w3.org/2000/svg"'), true);
    assert.strictEqual(svg.includes('</svg>'), true);
  });

  it('should generate custom colored SVG via sajilo.toSVG', async () => {
    const svg = await sajilo.toSVG('Test SVG', {
      dark: '#ff0000',
      light: '#ffffff',
    });
    assert.strictEqual(typeof svg, 'string');
    assert.strictEqual(svg.includes('#ff0000'), true);
  });

  it('should reject invalid canvas parameter on toCanvas', async () => {
    await assert.rejects(
      async () => {
        await sajilo.toCanvas(null, 'https://example.com');
      },
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: Target canvas element is required.';
      }
    );

    await assert.rejects(
      async () => {
        await sajilo.toCanvas('not-a-canvas', 'https://example.com');
      },
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: Target must be a valid HTMLCanvasElement.';
      }
    );
  });

  it('should reject empty or missing data across all methods', async () => {
    await assert.rejects(
      async () => {
        await sajilo.generate('');
      },
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: QR data is required.'
    );

    await assert.rejects(
      async () => {
        await sajilo.toSVG('');
      },
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: QR data is required.'
    );

    await assert.rejects(
      async () => {
        await sajilo.toDataURL(undefined as unknown as string);
      },
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: QR data is required.'
    );
  });
});
