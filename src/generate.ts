import QRCode from 'qrcode';
import { SajiloError } from './errors';
import { validateAndNormalize } from './options';
import type { SajiloOptions } from './types';

/**
 * Generates a QR code from the provided data and returns it as a Data URL (image/png).
 *
 * When called without an `options` object, it applies sensible production defaults:
 * - `size`: `300` (width & height in pixels)
 * - `margin`: `2` (quiet zone modules around QR code)
 * - `dark`: `"#000000"` (dark module color)
 * - `light`: `"#ffffff"` (background / light module color)
 * - `errorCorrection`: `"M"` (~15% recovery level)
 *
 * @param data - The required text or URL string to encode into the QR code. Must be a non-empty string.
 * @param options - Optional configuration options for customizing size, margin, colors, and error correction.
 * @returns A Promise resolving to a PNG Data URL string (e.g. `data:image/png;base64,...`).
 * @throws {SajiloError} If `data` is missing, empty, or not a string, or if any option is invalid.
 *
 * @example
 * ```ts
 * import { sajilo } from 'sajilo-qr';
 *
 * // 1. Basic zero-config usage (uses size 300, margin 2, default colors)
 * const dataUrl = await sajilo.generate('https://example.com');
 *
 * // 2. Custom configuration
 * const customDataUrl = await sajilo.generate('https://example.com', {
 *   size: 400,
 *   margin: 4,
 *   dark: '#1e293b',
 *   light: '#f8fafc',
 *   errorCorrection: 'H'
 * });
 * ```
 */
export async function generate(data: string, options?: SajiloOptions): Promise<string> {
  return toDataURL(data, options);
}

/**
 * Generates a QR code as a standard Data URL (PNG format).
 * Suitable for directly setting as `<img src="...">`.
 *
 * @example
 * ```ts
 * import { sajilo } from 'sajilo-qr';
 *
 * const dataUrl = await sajilo.toDataURL('https://example.com', {
 *   size: 300,
 *   margin: 2,
 *   dark: '#000000',
 *   light: '#ffffff',
 *   errorCorrection: 'M'
 * });
 * ```
 */
export async function toDataURL(data: string, options?: SajiloOptions): Promise<string> {
  const normalized = validateAndNormalize(data, options);

  try {
    const result = await QRCode.toDataURL(normalized.data, {
      width: normalized.options.size,
      margin: normalized.options.margin,
      color: {
        dark: normalized.options.dark,
        light: normalized.options.light,
      },
      errorCorrectionLevel: normalized.options.errorCorrection,
    });
    return result;
  } catch (err: unknown) {
    if (err instanceof SajiloError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new SajiloError(`Sajilo QR: Failed to generate QR Data URL - ${message}`);
  }
}

/**
 * Generates a QR code as raw, scalable SVG markup string.
 *
 * @example
 * ```ts
 * import { sajilo } from 'sajilo-qr';
 *
 * const svgString = await sajilo.toSVG('https://example.com');
 * ```
 */
export async function toSVG(data: string, options?: SajiloOptions): Promise<string> {
  const normalized = validateAndNormalize(data, options);

  try {
    const svgResult = await QRCode.toString(normalized.data, {
      type: 'svg',
      width: normalized.options.size,
      margin: normalized.options.margin,
      color: {
        dark: normalized.options.dark,
        light: normalized.options.light,
      },
      errorCorrectionLevel: normalized.options.errorCorrection,
    });
    return svgResult;
  } catch (err: unknown) {
    if (err instanceof SajiloError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new SajiloError(`Sajilo QR: Failed to generate QR SVG - ${message}`);
  }
}

/**
 * Renders a QR code onto an existing HTML `<canvas>` element in supported browser environments.
 *
 * @example
 * ```ts
 * import { sajilo } from 'sajilo-qr';
 *
 * const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
 * await sajilo.toCanvas(canvas, 'https://example.com');
 * ```
 */
export async function toCanvas(
  canvas: unknown,
  data: string,
  options?: SajiloOptions
): Promise<HTMLCanvasElement | void> {
  if (canvas === undefined || canvas === null) {
    throw new SajiloError('Sajilo QR: Target canvas element is required.');
  }

  // Check if canvas looks like a valid canvas element or has a 2D context
  const isCanvasLike =
    typeof canvas === 'object' &&
    canvas !== null &&
    'getContext' in canvas &&
    typeof (canvas as { getContext?: unknown }).getContext === 'function';

  if (!isCanvasLike) {
    throw new SajiloError('Sajilo QR: Target must be a valid HTMLCanvasElement.');
  }

  const normalized = validateAndNormalize(data, options);

  try {
    return await QRCode.toCanvas(canvas as HTMLCanvasElement, normalized.data, {
      width: normalized.options.size,
      margin: normalized.options.margin,
      color: {
        dark: normalized.options.dark,
        light: normalized.options.light,
      },
      errorCorrectionLevel: normalized.options.errorCorrection,
    });
  } catch (err: unknown) {
    if (err instanceof SajiloError) {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new SajiloError(`Sajilo QR: Failed to render QR to canvas - ${message}`);
  }
}
