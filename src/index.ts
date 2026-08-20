import { generate, toCanvas, toDataURL, toSVG } from './generate';
import { SajiloError } from './errors';
import { DEFAULT_OPTIONS } from './options';
import type { ErrorCorrectionLevel, ResolvedSajiloOptions, SajiloOptions } from './types';

/**
 * Sajilo QR - Simple, predictable, and lightweight QR code generation.
 *
 * "Sajilo" (सजिलो) means "easy" or "simple" in Nepali.
 *
 * @example
 * ```ts
 * import { sajilo } from 'sajilo-qr';
 *
 * const qr = await sajilo.generate('https://example.com');
 * ```
 */
export const sajilo = {
  generate,
  toDataURL,
  toSVG,
  toCanvas,
} as const;

export { SajiloError, DEFAULT_OPTIONS };
export type { SajiloOptions, ErrorCorrectionLevel, ResolvedSajiloOptions };

export default sajilo;
