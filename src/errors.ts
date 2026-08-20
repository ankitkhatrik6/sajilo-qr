/**
 * Custom error class thrown by Sajilo QR library operations.
 */
export class SajiloError extends Error {
  override readonly name = 'SajiloError';

  constructor(message: string) {
    super(message);
    // Ensure proper prototype chain for ES5/ES6 environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
