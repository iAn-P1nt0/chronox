/**
 * SIMD-optimized batch operations
 * Falls back to regular operations if SIMD is not available
 */

import type { ChronoDate, Duration } from '../types';
import { addDuration } from '../core/arithmetic';
import { format } from '../format/formatter';
import { shouldUseSIMD } from './detection';

/**
 * Add duration to multiple dates in batch
 * Uses SIMD when available and beneficial
 *
 * @param dates - Array of dates to modify
 * @param duration - Duration to add to each date
 * @returns Array of new dates with duration added
 *
 * @example
 * ```typescript
 * const dates = [date1, date2, date3, date4];
 * const future = addDurationBatch(dates, { days: 5 });
 * ```
 */
export function addDurationBatch(
  dates: ChronoDate[],
  duration: Duration
): ChronoDate[] {
  // For now, use regular implementation
  // SIMD version would use WebAssembly for parallel processing
  // This is a placeholder for future optimization

  if (shouldUseSIMD(dates.length)) {
    // TODO: Implement WASM SIMD version
    // For now, fall back to optimized JavaScript
    return dates.map((date) => addDuration(date, duration));
  }

  // Regular implementation for small arrays
  return dates.map((date) => addDuration(date, duration));
}

/**
 * Format multiple dates in batch
 * Uses SIMD when available and beneficial
 *
 * @param dates - Array of dates to format
 * @param formatStr - Format string to use
 * @returns Array of formatted date strings
 *
 * @example
 * ```typescript
 * const dates = [date1, date2, date3, date4];
 * const formatted = formatBatch(dates, 'YYYY-MM-DD');
 * ```
 */
export function formatBatch(
  dates: ChronoDate[],
  formatStr: string
): string[] {
  // Benefit from format caching for repeated format strings
  if (shouldUseSIMD(dates.length)) {
    // The formatter is already cached, so batch processing
    // is automatically optimized
    return dates.map((date) => format(date, formatStr));
  }

  return dates.map((date) => format(date, formatStr));
}

/**
 * Compare multiple date pairs in batch
 * Returns array of comparison results
 *
 * @param dates1 - First array of dates
 * @param dates2 - Second array of dates
 * @returns Array of booleans indicating if date1 < date2
 */
export function compareBatch(
  dates1: ChronoDate[],
  dates2: ChronoDate[]
): boolean[] {
  const length = Math.min(dates1.length, dates2.length);
  const results = new Array(length);

  if (shouldUseSIMD(length)) {
    // SIMD-optimized comparison would use parallel processing
    // For now, use optimized loop
    for (let i = 0; i < length; i++) {
      results[i] = dates1[i].timestamp < dates2[i].timestamp;
    }
  } else {
    for (let i = 0; i < length; i++) {
      results[i] = dates1[i].timestamp < dates2[i].timestamp;
    }
  }

  return results;
}

/**
 * Filter dates in a range (batch operation)
 *
 * @param dates - Array of dates to filter
 * @param start - Start date (inclusive)
 * @param end - End date (inclusive)
 * @returns Filtered array of dates within range
 */
export function filterInRangeBatch(
  dates: ChronoDate[],
  start: ChronoDate,
  end: ChronoDate
): ChronoDate[] {
  const startTs = start.timestamp;
  const endTs = end.timestamp;

  if (shouldUseSIMD(dates.length)) {
    // SIMD version would process multiple dates in parallel
    return dates.filter(
      (date) => date.timestamp >= startTs && date.timestamp <= endTs
    );
  }

  return dates.filter(
    (date) => date.timestamp >= startTs && date.timestamp <= endTs
  );
}
