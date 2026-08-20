import { SajiloError } from './errors';
import type { ErrorCorrectionLevel, ResolvedSajiloOptions, SajiloOptions } from './types';

/**
 * Sensible, production-ready default options for QR code generation.
 */
export const DEFAULT_OPTIONS: ResolvedSajiloOptions = {
  size: 300,
  margin: 2,
  dark: '#000000',
  light: '#ffffff',
  errorCorrection: 'M',
};

const VALID_ERROR_CORRECTION_LEVELS: ReadonlySet<string> = new Set(['L', 'M', 'Q', 'H']);

/**
 * Validates and normalizes QR input data and configuration options.
 * Throws a clear, descriptive SajiloError upon invalid input.
 */
export function validateAndNormalize(
  data: unknown,
  options?: unknown
): { data: string; options: ResolvedSajiloOptions } {
  // 1. Data validation
  if (data === undefined || data === null) {
    throw new SajiloError('Sajilo QR: QR data is required.');
  }

  if (typeof data !== 'string') {
    throw new SajiloError('Sajilo QR: QR data must be a string.');
  }

  if (data.length === 0) {
    throw new SajiloError('Sajilo QR: QR data is required.');
  }

  // 2. Options container validation
  if (options !== undefined && options !== null) {
    if (typeof options !== 'object' || Array.isArray(options)) {
      throw new SajiloError('Sajilo QR: Options must be a configuration object.');
    }
  }

  const rawOptions = (options ?? {}) as SajiloOptions;
  const resolved: ResolvedSajiloOptions = { ...DEFAULT_OPTIONS };

  // 3. Size validation
  if (rawOptions.size !== undefined) {
    if (typeof rawOptions.size !== 'number' || !Number.isFinite(rawOptions.size) || rawOptions.size <= 0) {
      throw new SajiloError('Sajilo QR: "size" must be a positive number.');
    }
    resolved.size = Math.round(rawOptions.size);
  }

  // 4. Margin validation
  if (rawOptions.margin !== undefined) {
    if (typeof rawOptions.margin !== 'number' || !Number.isFinite(rawOptions.margin) || rawOptions.margin < 0) {
      throw new SajiloError('Sajilo QR: "margin" must be a non-negative number.');
    }
    resolved.margin = Math.round(rawOptions.margin);
  }

  // 5. Dark color validation
  if (rawOptions.dark !== undefined) {
    if (typeof rawOptions.dark !== 'string' || rawOptions.dark.trim().length === 0) {
      throw new SajiloError('Sajilo QR: "dark" must be a valid color string.');
    }
    resolved.dark = rawOptions.dark.trim();
  }

  // 6. Light color validation
  if (rawOptions.light !== undefined) {
    if (typeof rawOptions.light !== 'string' || rawOptions.light.trim().length === 0) {
      throw new SajiloError('Sajilo QR: "light" must be a valid color string.');
    }
    resolved.light = rawOptions.light.trim();
  }

  // 7. Error correction level validation
  if (rawOptions.errorCorrection !== undefined) {
    if (
      typeof rawOptions.errorCorrection !== 'string' ||
      !VALID_ERROR_CORRECTION_LEVELS.has(rawOptions.errorCorrection.toUpperCase())
    ) {
      throw new SajiloError('Sajilo QR: "errorCorrection" must be one of "L", "M", "Q", or "H".');
    }
    resolved.errorCorrection = rawOptions.errorCorrection.toUpperCase() as ErrorCorrectionLevel;
  }

  return {
    data,
    options: resolved,
  };
}
