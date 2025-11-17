/**
 * Date comparison and difference operations
 */

import type { ChronoDate, Unit } from '../types';
import {
  MILLISECONDS_IN_SECOND,
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_WEEK,
} from '../utils/constants';

/**
 * Check if date1 is before date2
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if date1 is before date2
 *
 * @example
 * ```typescript
 * const date1 = createDate('2025-01-15');
 * const date2 = createDate('2025-01-20');
 * isBefore(date1, date2); // true
 * ```
 */
export function isBefore(date1: ChronoDate, date2: ChronoDate): boolean {
  return date1.timestamp < date2.timestamp;
}

/**
 * Check if date1 is after date2
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @returns true if date1 is after date2
 */
export function isAfter(date1: ChronoDate, date2: ChronoDate): boolean {
  return date1.timestamp > date2.timestamp;
}

/**
 * Check if two dates are the same
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Optional unit to compare (default: millisecond)
 * @returns true if dates are the same
 *
 * @example
 * ```typescript
 * const date1 = createDate('2025-01-15T10:30:00Z');
 * const date2 = createDate('2025-01-15T14:30:00Z');
 * isSame(date1, date2, 'day'); // true
 * isSame(date1, date2, 'hour'); // false
 * ```
 */
export function isSame(
  date1: ChronoDate,
  date2: ChronoDate,
  unit: Unit = 'millisecond'
): boolean {
  switch (unit) {
    case 'year':
      return date1.year === date2.year;
    case 'month':
      return date1.year === date2.year && date1.month === date2.month;
    case 'day':
      return (
        date1.year === date2.year &&
        date1.month === date2.month &&
        date1.day === date2.day
      );
    case 'hour':
      return (
        date1.year === date2.year &&
        date1.month === date2.month &&
        date1.day === date2.day &&
        date1.hour === date2.hour
      );
    case 'minute':
      return (
        date1.year === date2.year &&
        date1.month === date2.month &&
        date1.day === date2.day &&
        date1.hour === date2.hour &&
        date1.minute === date2.minute
      );
    case 'second':
      return (
        date1.year === date2.year &&
        date1.month === date2.month &&
        date1.day === date2.day &&
        date1.hour === date2.hour &&
        date1.minute === date2.minute &&
        date1.second === date2.second
      );
    case 'millisecond':
      return date1.timestamp === date2.timestamp;
    case 'week': {
      const diff = Math.abs(date1.timestamp - date2.timestamp);
      const weeksDiff = Math.floor(diff / MILLISECONDS_IN_WEEK);
      return weeksDiff === 0;
    }
    default:
      return date1.timestamp === date2.timestamp;
  }
}

/**
 * Check if date1 is the same or before date2
 */
export function isSameOrBefore(date1: ChronoDate, date2: ChronoDate): boolean {
  return date1.timestamp <= date2.timestamp;
}

/**
 * Check if date1 is the same or after date2
 */
export function isSameOrAfter(date1: ChronoDate, date2: ChronoDate): boolean {
  return date1.timestamp >= date2.timestamp;
}

/**
 * Check if a date is between two other dates (inclusive)
 *
 * @param date - Date to check
 * @param start - Start date
 * @param end - End date
 * @returns true if date is between start and end
 */
export function isBetween(
  date: ChronoDate,
  start: ChronoDate,
  end: ChronoDate
): boolean {
  return (
    date.timestamp >= start.timestamp && date.timestamp <= end.timestamp
  );
}

/**
 * Calculate the difference between two dates in the specified unit
 *
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Unit to return the difference in
 * @returns Difference as a number (can be negative)
 *
 * @example
 * ```typescript
 * const date1 = createDate('2025-01-15');
 * const date2 = createDate('2025-01-20');
 * diff(date1, date2, 'day'); // 5
 * diff(date2, date1, 'day'); // -5
 * ```
 */
export function diff(
  date1: ChronoDate,
  date2: ChronoDate,
  unit: Unit = 'millisecond'
): number {
  const msDiff = date2.timestamp - date1.timestamp;

  switch (unit) {
    case 'millisecond':
      return msDiff;
    case 'second':
      return Math.floor(msDiff / MILLISECONDS_IN_SECOND);
    case 'minute':
      return Math.floor(msDiff / MILLISECONDS_IN_MINUTE);
    case 'hour':
      return Math.floor(msDiff / MILLISECONDS_IN_HOUR);
    case 'day':
      return Math.floor(msDiff / MILLISECONDS_IN_DAY);
    case 'week':
      return Math.floor(msDiff / MILLISECONDS_IN_WEEK);
    case 'month': {
      let months =
        (date2.year - date1.year) * 12 + (date2.month - date1.month);
      if (date2.day < date1.day) {
        months--;
      }
      return months;
    }
    case 'year': {
      let years = date2.year - date1.year;
      if (
        date2.month < date1.month ||
        (date2.month === date1.month && date2.day < date1.day)
      ) {
        years--;
      }
      return years;
    }
    default:
      return msDiff;
  }
}

/**
 * Get the absolute difference between two dates
 */
export function diffAbs(
  date1: ChronoDate,
  date2: ChronoDate,
  unit: Unit = 'millisecond'
): number {
  return Math.abs(diff(date1, date2, unit));
}

/**
 * Get the minimum (earliest) date from an array
 *
 * @param dates - Array of dates
 * @returns The earliest date
 * @throws Error if array is empty
 */
export function min(...dates: ChronoDate[]): ChronoDate {
  if (dates.length === 0) {
    throw new Error('Cannot find minimum of empty array');
  }

  return dates.reduce((earliest, current) =>
    isBefore(current, earliest) ? current : earliest
  );
}

/**
 * Get the maximum (latest) date from an array
 *
 * @param dates - Array of dates
 * @returns The latest date
 * @throws Error if array is empty
 */
export function max(...dates: ChronoDate[]): ChronoDate {
  if (dates.length === 0) {
    throw new Error('Cannot find maximum of empty array');
  }

  return dates.reduce((latest, current) =>
    isAfter(current, latest) ? current : latest
  );
}
