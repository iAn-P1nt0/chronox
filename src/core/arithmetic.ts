/**
 * Date arithmetic operations
 */

import type { ChronoDate, Duration } from '../types';
import { dateFromNative } from './ChronoDate';
import {
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_SECOND,
} from '../utils/constants';

/**
 * Add days to a date
 * @param date - The date to add to
 * @param days - Number of days to add (can be negative)
 * @returns New ChronoDate with days added
 *
 * @example
 * ```typescript
 * const date = createDate('2025-01-15');
 * const future = addDays(date, 5); // 2025-01-20
 * const past = addDays(date, -5); // 2025-01-10
 * ```
 */
export function addDays(date: ChronoDate, days: number): ChronoDate {
  const native = date.toNative();
  native.setUTCDate(native.getUTCDate() + days);
  return dateFromNative(native, date.timezone);
}

/**
 * Add months to a date
 * Handles edge cases like month-end dates
 *
 * @param date - The date to add to
 * @param months - Number of months to add (can be negative)
 * @returns New ChronoDate with months added
 *
 * @example
 * ```typescript
 * const date = createDate('2025-01-31');
 * const next = addMonths(date, 1); // 2025-02-28 (or 02-29 in leap year)
 * ```
 */
export function addMonths(date: ChronoDate, months: number): ChronoDate {
  const native = date.toNative();
  native.setUTCMonth(native.getUTCMonth() + months);
  return dateFromNative(native, date.timezone);
}

/**
 * Add years to a date
 *
 * @param date - The date to add to
 * @param years - Number of years to add (can be negative)
 * @returns New ChronoDate with years added
 *
 * @example
 * ```typescript
 * const date = createDate('2025-01-15');
 * const future = addYears(date, 5); // 2030-01-15
 * ```
 */
export function addYears(date: ChronoDate, years: number): ChronoDate {
  const native = date.toNative();
  native.setUTCFullYear(native.getUTCFullYear() + years);
  return dateFromNative(native, date.timezone);
}

/**
 * Add hours to a date
 *
 * @param date - The date to add to
 * @param hours - Number of hours to add (can be negative)
 * @returns New ChronoDate with hours added
 */
export function addHours(date: ChronoDate, hours: number): ChronoDate {
  const timestamp = date.timestamp + hours * MILLISECONDS_IN_HOUR;
  return dateFromNative(new Date(timestamp), date.timezone);
}

/**
 * Add minutes to a date
 *
 * @param date - The date to add to
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New ChronoDate with minutes added
 */
export function addMinutes(date: ChronoDate, minutes: number): ChronoDate {
  const timestamp = date.timestamp + minutes * MILLISECONDS_IN_MINUTE;
  return dateFromNative(new Date(timestamp), date.timezone);
}

/**
 * Add seconds to a date
 *
 * @param date - The date to add to
 * @param seconds - Number of seconds to add (can be negative)
 * @returns New ChronoDate with seconds added
 */
export function addSeconds(date: ChronoDate, seconds: number): ChronoDate {
  const timestamp = date.timestamp + seconds * MILLISECONDS_IN_SECOND;
  return dateFromNative(new Date(timestamp), date.timezone);
}

/**
 * Add milliseconds to a date
 *
 * @param date - The date to add to
 * @param milliseconds - Number of milliseconds to add (can be negative)
 * @returns New ChronoDate with milliseconds added
 */
export function addMilliseconds(
  date: ChronoDate,
  milliseconds: number
): ChronoDate {
  const timestamp = date.timestamp + milliseconds;
  return dateFromNative(new Date(timestamp), date.timezone);
}

/**
 * Add weeks to a date
 *
 * @param date - The date to add to
 * @param weeks - Number of weeks to add (can be negative)
 * @returns New ChronoDate with weeks added
 */
export function addWeeks(date: ChronoDate, weeks: number): ChronoDate {
  return addDays(date, weeks * 7);
}

/**
 * Add a duration to a date
 *
 * @param date - The date to add to
 * @param duration - Duration object with multiple units
 * @returns New ChronoDate with duration added
 *
 * @example
 * ```typescript
 * const date = createDate('2025-01-15T10:00:00Z');
 * const result = addDuration(date, {
 *   days: 5,
 *   hours: 2,
 *   minutes: 30
 * }); // 2025-01-20T12:30:00Z
 * ```
 */
export function addDuration(date: ChronoDate, duration: Duration): ChronoDate {
  let result = date;

  if (duration.years) {
    result = addYears(result, duration.years);
  }
  if (duration.months) {
    result = addMonths(result, duration.months);
  }
  if (duration.weeks) {
    result = addWeeks(result, duration.weeks);
  }
  if (duration.days) {
    result = addDays(result, duration.days);
  }
  if (duration.hours) {
    result = addHours(result, duration.hours);
  }
  if (duration.minutes) {
    result = addMinutes(result, duration.minutes);
  }
  if (duration.seconds) {
    result = addSeconds(result, duration.seconds);
  }
  if (duration.milliseconds) {
    result = addMilliseconds(result, duration.milliseconds);
  }

  return result;
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: ChronoDate, days: number): ChronoDate {
  return addDays(date, -days);
}

/**
 * Subtract months from a date
 */
export function subtractMonths(date: ChronoDate, months: number): ChronoDate {
  return addMonths(date, -months);
}

/**
 * Subtract years from a date
 */
export function subtractYears(date: ChronoDate, years: number): ChronoDate {
  return addYears(date, -years);
}

/**
 * Subtract a duration from a date
 */
export function subtractDuration(
  date: ChronoDate,
  duration: Duration
): ChronoDate {
  const negated: Duration = {
    years: duration.years ? -duration.years : undefined,
    months: duration.months ? -duration.months : undefined,
    weeks: duration.weeks ? -duration.weeks : undefined,
    days: duration.days ? -duration.days : undefined,
    hours: duration.hours ? -duration.hours : undefined,
    minutes: duration.minutes ? -duration.minutes : undefined,
    seconds: duration.seconds ? -duration.seconds : undefined,
    milliseconds: duration.milliseconds ? -duration.milliseconds : undefined,
  };
  return addDuration(date, negated);
}
