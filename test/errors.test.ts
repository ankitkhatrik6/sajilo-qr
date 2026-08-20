import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SajiloError } from '../src/errors';

describe('SajiloError', () => {
  it('should create an instance with correct name and message', () => {
    const error = new SajiloError('Sajilo QR: Test error message');
    assert.strictEqual(error instanceof Error, true);
    assert.strictEqual(error instanceof SajiloError, true);
    assert.strictEqual(error.name, 'SajiloError');
    assert.strictEqual(error.message, 'Sajilo QR: Test error message');
  });

  it('should capture stack trace properly', () => {
    const error = new SajiloError('Sajilo QR: Stack test');
    assert.strictEqual(typeof error.stack, 'string');
    assert.strictEqual(error.stack?.includes('SajiloError'), true);
  });
});
