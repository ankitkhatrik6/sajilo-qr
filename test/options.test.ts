import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateAndNormalize, DEFAULT_OPTIONS } from '../src/options';
import { SajiloError } from '../src/errors';

describe('validateAndNormalize options', () => {
  it('should use default options when none are provided', () => {
    const result = validateAndNormalize('https://example.com');
    assert.strictEqual(result.data, 'https://example.com');
    assert.deepStrictEqual(result.options, DEFAULT_OPTIONS);
    assert.strictEqual(result.options.size, 300);
    assert.strictEqual(result.options.margin, 2);
    assert.strictEqual(result.options.dark, '#000000');
    assert.strictEqual(result.options.light, '#ffffff');
    assert.strictEqual(result.options.errorCorrection, 'M');
  });

  it('should reject missing or undefined data', () => {
    assert.throws(
      () => validateAndNormalize(undefined as unknown as string),
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: QR data is required.';
      }
    );
  });

  it('should reject null data', () => {
    assert.throws(
      () => validateAndNormalize(null as unknown as string),
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: QR data is required.';
      }
    );
  });

  it('should reject non-string data', () => {
    assert.throws(
      () => validateAndNormalize(12345 as unknown as string),
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: QR data must be a string.';
      }
    );
  });

  it('should reject empty string data', () => {
    assert.throws(
      () => validateAndNormalize(''),
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: QR data is required.';
      }
    );
  });

  it('should reject non-object options', () => {
    assert.throws(
      () => validateAndNormalize('test', 'not-an-object' as unknown as object),
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: Options must be a configuration object.';
      }
    );

    assert.throws(
      () => validateAndNormalize('test', [1, 2, 3] as unknown as object),
      (err: unknown) => {
        return err instanceof SajiloError && err.message === 'Sajilo QR: Options must be a configuration object.';
      }
    );
  });

  it('should validate size properly', () => {
    // Valid positive size
    const valid = validateAndNormalize('test', { size: 500 });
    assert.strictEqual(valid.options.size, 500);

    // Negative size
    assert.throws(
      () => validateAndNormalize('test', { size: -50 }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "size" must be a positive number.'
    );

    // Zero size
    assert.throws(
      () => validateAndNormalize('test', { size: 0 }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "size" must be a positive number.'
    );

    // NaN / string size
    assert.throws(
      () => validateAndNormalize('test', { size: NaN }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "size" must be a positive number.'
    );

    assert.throws(
      () => validateAndNormalize('test', { size: '300' as unknown as number }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "size" must be a positive number.'
    );
  });

  it('should validate margin properly', () => {
    // Valid margin 0 (allowed)
    const validZero = validateAndNormalize('test', { margin: 0 });
    assert.strictEqual(validZero.options.margin, 0);

    // Valid margin 4
    const validFour = validateAndNormalize('test', { margin: 4 });
    assert.strictEqual(validFour.options.margin, 4);

    // Negative margin
    assert.throws(
      () => validateAndNormalize('test', { margin: -1 }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "margin" must be a non-negative number.'
    );

    // NaN margin
    assert.throws(
      () => validateAndNormalize('test', { margin: NaN }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "margin" must be a non-negative number.'
    );
  });

  it('should validate colors properly', () => {
    // Valid colors
    const valid = validateAndNormalize('test', { dark: '#112233', light: '#ffeeaa' });
    assert.strictEqual(valid.options.dark, '#112233');
    assert.strictEqual(valid.options.light, '#ffeeaa');

    // Invalid dark color
    assert.throws(
      () => validateAndNormalize('test', { dark: '' }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "dark" must be a valid color string.'
    );

    assert.throws(
      () => validateAndNormalize('test', { dark: 123 as unknown as string }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "dark" must be a valid color string.'
    );

    // Invalid light color
    assert.throws(
      () => validateAndNormalize('test', { light: '   ' }),
      (err: unknown) => err instanceof SajiloError && err.message === 'Sajilo QR: "light" must be a valid color string.'
    );
  });

  it('should validate and normalize errorCorrection levels', () => {
    // Valid levels
    assert.strictEqual(validateAndNormalize('test', { errorCorrection: 'L' }).options.errorCorrection, 'L');
    assert.strictEqual(validateAndNormalize('test', { errorCorrection: 'M' }).options.errorCorrection, 'M');
    assert.strictEqual(validateAndNormalize('test', { errorCorrection: 'Q' }).options.errorCorrection, 'Q');
    assert.strictEqual(validateAndNormalize('test', { errorCorrection: 'H' }).options.errorCorrection, 'H');

    // Case-insensitive normalization
    assert.strictEqual(validateAndNormalize('test', { errorCorrection: 'h' as unknown as 'H' }).options.errorCorrection, 'H');

    // Invalid level
    assert.throws(
      () => validateAndNormalize('test', { errorCorrection: 'X' as unknown as 'H' }),
      (err: unknown) =>
        err instanceof SajiloError &&
        err.message === 'Sajilo QR: "errorCorrection" must be one of "L", "M", "Q", or "H".'
    );
  });
});
