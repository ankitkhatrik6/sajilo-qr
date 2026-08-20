/**
 * Error correction level for QR code generation.
 * - 'L': Low (~7% recovery)
 * - 'M': Medium (~15% recovery) - Default
 * - 'Q': Quartile (~25% recovery)
 * - 'H': High (~30% recovery)
 */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * Configuration options for Sajilo QR code generation.
 */
export interface SajiloOptions {
  /**
   * Output dimension (width and height in pixels).
   * Must be a positive finite number.
   * @default 300
   */
  size?: number;

  /**
   * Margin around the QR code in modules (quiet zone).
   * Must be a non-negative number.
   * @default 2
   */
  margin?: number;

  /**
   * Color of the dark modules (hex, RGB, HSL, or CSS color string).
   * @default "#000000"
   */
  dark?: string;

  /**
   * Color of the light modules / background (hex, RGB, HSL, or CSS color string).
   * @default "#ffffff"
   */
  light?: string;

  /**
   * Error correction level ('L' | 'M' | 'Q' | 'H').
   * @default "M"
   */
  errorCorrection?: ErrorCorrectionLevel;
}

/**
 * Normalized options with all defaults fully resolved.
 */
export interface ResolvedSajiloOptions {
  size: number;
  margin: number;
  dark: string;
  light: string;
  errorCorrection: ErrorCorrectionLevel;
}
