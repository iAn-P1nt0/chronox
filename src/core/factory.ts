/**
 * Factory functions for creating ChronoDate objects
 */

import type { ChronoDate, DateInput } from '../types';
import { dateFromNative, dateFromTimestamp } from './ChronoDate';

/**
 * Creates an immutable ChronoDate from various inputs
 * @param input - Date, string, number, or existing ChronoDate
 * @returns Immutable date object
 * @throws Error if input is invalid
 *
 * @example
 * ```typescript
 * createDate(); // Current date/time
 * createDate('2025-01-15'); // From ISO string
 * createDate(1705334400000); // From timestamp
 * createDate(new Date()); // From native Date
 * ```
 */
export function createDate(input?: DateInput): ChronoDate {
  if (!input) {
    return dateFromNative(new Date());
  }

  if (typeof input === 'string') {
    // Will be implemented by parse module
    const date = new Date(input);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${input}`);
    }
    return dateFromNative(date);
  }

  if (typeof input === 'number') {
    return dateFromTimestamp(input);
  }

  if (input instanceof Date) {
    return dateFromNative(input);
  }

  // Already ChronoDate
  return input;
}

/**
 * Creates a ChronoDate representing the current date and time
 * @returns ChronoDate with current timestamp
 *
 * @example
 * ```typescript
 * const now = now();
 * ```
 */
export function now(): ChronoDate {
  return dateFromNative(new Date());
}

/**
 * Checks if a value is a valid date
 * @param input - Any value to check
 * @returns true if the input can be converted to a valid date
 *
 * @example
 * ```typescript
 * isValid('2025-01-15'); // true
 * isValid('invalid'); // false
 * isValid(new Date()); // true
 * ```
 */
export function isValid(input: unknown): boolean {
  try {
    if (!input) {
      return false;
    }

    if (typeof input === 'string') {
      const date = new Date(input);
      return !isNaN(date.getTime());
    }

    if (typeof input === 'number') {
      return !isNaN(input) && isFinite(input);
    }

    if (input instanceof Date) {
      return !isNaN(input.getTime());
    }

    // Check if it's a ChronoDate
    if (
      typeof input === 'object' &&
      input !== null &&
      'timestamp' in input &&
      'toNative' in input
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Creates a ChronoDate set to the start of the day (00:00:00.000)
 * @param input - Date input
 * @returns ChronoDate at start of day
 *
 * @example
 * ```typescript
 * const startOfDay = startOfDay('2025-01-15T14:30:00Z');
 * // Returns: 2025-01-15T00:00:00.000Z
 * ```
 */
export function startOfDay(input: DateInput): ChronoDate {
  const date = createDate(input);
  const native = date.toNative();
  native.setUTCHours(0, 0, 0, 0);
  return dateFromNative(native, date.timezone);
}

/**
 * Creates a ChronoDate set to the end of the day (23:59:59.999)
 * @param input - Date input
 * @returns ChronoDate at end of day
 *
 * @example
 * ```typescript
 * const endOfDay = endOfDay('2025-01-15T14:30:00Z');
 * // Returns: 2025-01-15T23:59:59.999Z
 * ```
 */
export function endOfDay(input: DateInput): ChronoDate {
  const date = createDate(input);
  const native = date.toNative();
  native.setUTCHours(23, 59, 59, 999);
  return dateFromNative(native, date.timezone);
}
