/**
 * Format distance utilities - date-fns compatible relative time formatting
 */

import type { ChronoDate, DateInput } from '../types';
import { createDate, now } from '../core/factory';
import { diff } from '../core/comparison';

/**
 * Options for formatDistanceToNow
 */
export interface FormatDistanceOptions {
  /**
   * Add suffix "ago" or prefix "in" to the result
   * @default true
   */
  addSuffix?: boolean;

  /**
   * Include seconds in the output for very recent times
   * @default false
   */
  includeSeconds?: boolean;

  /**
   * Base date to calculate distance from (defaults to now)
   */
  baseDate?: DateInput;
}

/**
 * Format the distance between a date and now in human-readable form.
 * This is a ChronCraft equivalent of date-fns `formatDistanceToNow`.
 *
 * @param date - The date to format (Date, number timestamp, or string)
 * @param options - Formatting options
 * @returns Human-readable distance string (e.g., "5 minutes ago", "in 3 days")
 *
 * @example
 * ```typescript
 * // Basic usage
 * formatDistanceToNow(new Date('2025-01-01')); // "about 2 months ago"
 *
 * // Without suffix
 * formatDistanceToNow(someDate, { addSuffix: false }); // "5 minutes"
 *
 * // Include seconds for very recent times
 * formatDistanceToNow(recentDate, { includeSeconds: true }); // "45 seconds ago"
 *
 * // Custom base date
 * formatDistanceToNow(someDate, { baseDate: otherDate });
 * ```
 */
export function formatDistanceToNow(
  date: DateInput,
  options: FormatDistanceOptions = {}
): string {
  const { addSuffix = true, includeSeconds = false, baseDate } = options;

  // Normalize the target date
  const targetDate = normalizeToChronoDate(date);

  // Get base date (defaults to now)
  const base = baseDate ? normalizeToChronoDate(baseDate) : now();

  // Calculate total seconds difference (base - target)
  // Positive means target is in the past, negative means target is in the future
  const totalSeconds = diff(targetDate, base, 'second');
  const isPast = totalSeconds >= 0;
  const absSeconds = Math.abs(totalSeconds);

  // Format the distance string
  const result = formatDistanceString(absSeconds, includeSeconds);

  // Add suffix/prefix if requested
  if (addSuffix) {
    return isPast ? `${result} ago` : `in ${result}`;
  }

  return result;
}

/**
 * Format the distance between two dates in human-readable form.
 *
 * @param date - The date to compare
 * @param baseDate - The base date to compare against
 * @param options - Formatting options
 * @returns Human-readable distance string
 *
 * @example
 * ```typescript
 * const start = createDate('2025-01-01');
 * const end = createDate('2025-01-15');
 * formatDistance(start, end); // "14 days ago"
 * formatDistance(start, end, { addSuffix: false }); // "14 days"
 * ```
 */
export function formatDistance(
  date: DateInput,
  baseDate: DateInput,
  options: Omit<FormatDistanceOptions, 'baseDate'> = {}
): string {
  return formatDistanceToNow(date, { ...options, baseDate });
}

/**
 * Format seconds into a human-readable distance string
 */
function formatDistanceString(absSeconds: number, includeSeconds: boolean): string {
  // Less than 30 seconds
  if (absSeconds < 30) {
    if (includeSeconds) {
      if (absSeconds < 5) return 'less than 5 seconds';
      if (absSeconds < 10) return 'less than 10 seconds';
      if (absSeconds < 20) return 'less than 20 seconds';
      return 'half a minute';
    }
    return 'less than a minute';
  }

  // Less than 1 minute
  if (absSeconds < 60) {
    return includeSeconds ? 'less than a minute' : 'less than a minute';
  }

  // Less than 1 hour
  if (absSeconds < 3600) {
    const minutes = Math.floor(absSeconds / 60);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }

  // Less than 1 day
  if (absSeconds < 86400) {
    const hours = Math.floor(absSeconds / 3600);
    return hours === 1 ? 'about 1 hour' : `about ${hours} hours`;
  }

  // Less than 1 month (~30 days)
  if (absSeconds < 2592000) {
    const days = Math.floor(absSeconds / 86400);
    return days === 1 ? '1 day' : `${days} days`;
  }

  // Less than 1 year (~365 days)
  if (absSeconds < 31536000) {
    const months = Math.floor(absSeconds / 2592000);
    return months === 1 ? 'about 1 month' : `about ${months} months`;
  }

  // Years
  const years = Math.floor(absSeconds / 31536000);
  const remainingMonths = Math.floor((absSeconds % 31536000) / 2592000);

  if (remainingMonths < 3) {
    return years === 1 ? 'about 1 year' : `about ${years} years`;
  } else if (remainingMonths < 9) {
    return years === 1 ? 'over 1 year' : `over ${years} years`;
  } else {
    return `almost ${years + 1} years`;
  }
}

/**
 * Normalize various date input types to ChronoDate
 */
function normalizeToChronoDate(date: DateInput): ChronoDate {
  if (typeof date === 'string') {
    return createDate(new Date(date));
  }
  if (typeof date === 'number') {
    return createDate(new Date(date));
  }
  if (date instanceof Date) {
    return createDate(date);
  }
  // Already a ChronoDate
  return date as ChronoDate;
}
