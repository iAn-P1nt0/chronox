/**
 * Relative time formatting utilities
 * Short and long form relative time strings
 */

import type { ChronoDate, DateInput } from '../types';
import { createDate, now } from '../core/factory';
import { diff } from '../core/comparison';

/**
 * Options for relative time formatting
 */
export interface RelativeTimeOptions {
  /**
   * Base date to calculate relative time from (defaults to now)
   */
  baseDate?: DateInput;
}

/**
 * Format a date as relative time with full words.
 * Returns strings like "2 hours ago", "3 days ago", "just now"
 *
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Human-readable relative time string
 *
 * @example
 * ```typescript
 * formatRelativeTime(new Date(Date.now() - 60000)); // "1 minute ago"
 * formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() - 86400000 * 3)); // "3 days ago"
 * ```
 */
export function formatRelativeTime(
  date: DateInput,
  options: RelativeTimeOptions = {}
): string {
  const { baseDate } = options;

  const targetDate = normalizeToChronoDate(date);
  const base = baseDate ? normalizeToChronoDate(baseDate) : now();
  // Calculate seconds ago (base - target = positive means past)
  const secondsAgo = diff(targetDate, base, 'second');

  // Future dates or very recent
  if (secondsAgo < 0) {
    return 'just now';
  }

  // Less than a minute
  if (secondsAgo < 60) {
    return 'just now';
  }

  // Less than an hour
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
  }

  // Less than a day
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
  }

  // Less than a week
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
  }

  // Less than a month
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;
  }

  // Less than a year
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
  }

  // Years
  const yearsAgo = Math.floor(monthsAgo / 12);
  return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
}

/**
 * Format a date as a short relative time string.
 * Returns compact strings like "2h", "3d", "1w", "now"
 *
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Short relative time string
 *
 * @example
 * ```typescript
 * formatShortRelativeTime(new Date(Date.now() - 60000)); // "1m"
 * formatShortRelativeTime(new Date(Date.now() - 3600000)); // "1h"
 * formatShortRelativeTime(new Date(Date.now() - 86400000 * 3)); // "3d"
 * formatShortRelativeTime(new Date(Date.now() - 86400000 * 14)); // "2w"
 * formatShortRelativeTime(new Date(Date.now() - 86400000 * 60)); // "2mo"
 * formatShortRelativeTime(new Date(Date.now() - 86400000 * 400)); // "1y"
 * ```
 */
export function formatShortRelativeTime(
  date: DateInput,
  options: RelativeTimeOptions = {}
): string {
  const { baseDate } = options;

  const targetDate = normalizeToChronoDate(date);
  const base = baseDate ? normalizeToChronoDate(baseDate) : now();
  // Calculate seconds ago (base - target = positive means past)
  const secondsAgo = diff(targetDate, base, 'second');

  // Future or very recent
  if (secondsAgo < 60) {
    return 'now';
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo}m`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo}h`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo}d`;
  }

  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return `${weeksAgo}w`;
  }

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo}mo`;
  }

  const yearsAgo = Math.floor(monthsAgo / 12);
  return `${yearsAgo}y`;
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
