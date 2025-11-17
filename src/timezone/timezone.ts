/**
 * Timezone handling with lazy-loading support
 */

import type { ChronoDate, TimezoneInfo } from '../types';
import { TimezoneError } from '../types';
import { dateFromNative, cloneDate } from '../core/ChronoDate';
import { TIMEZONE_OFFSETS } from '../utils/constants';

/**
 * Get timezone offset in minutes for common timezones
 * This is a built-in implementation that doesn't require external data
 *
 * @param timezone - Timezone name or offset string
 * @returns Offset in minutes
 */
export function getTimezoneOffset(timezone: string): number {
  // Check if it's a known timezone abbreviation
  if (timezone in TIMEZONE_OFFSETS) {
    return TIMEZONE_OFFSETS[timezone];
  }

  // Check if it's an offset string (+HH:mm or -HH:mm)
  const offsetMatch = timezone.match(/^([+-])(\d{2}):(\d{2})$/);
  if (offsetMatch) {
    const sign = offsetMatch[1] === '+' ? 1 : -1;
    const hours = parseInt(offsetMatch[2], 10);
    const minutes = parseInt(offsetMatch[3], 10);
    return sign * (hours * 60 + minutes);
  }

  // For IANA timezone names, use Intl API if available
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      });

      // Get offset by comparing dates
      const date = new Date();
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
      const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);

      return Math.round(offset);
    } catch (error) {
      throw new TimezoneError(`Unknown timezone: ${timezone}`);
    }
  }

  throw new TimezoneError(`Timezone not supported: ${timezone}`);
}

/**
 * Convert a date to a different timezone
 * Note: This is async to support lazy-loading of timezone data in the future
 *
 * @param date - Date to convert
 * @param timezone - Target timezone
 * @returns Promise resolving to ChronoDate in the target timezone
 *
 * @example
 * ```typescript
 * const utcDate = createDate('2025-01-15T10:00:00Z');
 * const istDate = await toTimezone(utcDate, 'Asia/Kolkata');
 * const pstDate = await toTimezone(utcDate, 'PST');
 * const customDate = await toTimezone(utcDate, '+05:30');
 * ```
 */
export async function toTimezone(
  date: ChronoDate,
  timezone: string
): Promise<ChronoDate> {
  try {
    // Get the offset for the target timezone
    const offset = getTimezoneOffset(timezone);

    // Convert timestamp
    const timestamp = date.timestamp;
    const targetDate = new Date(timestamp);

    // Apply timezone offset
    // Note: The date components should reflect the local time in that timezone
    const native = date.toNative();

    // Use Intl API for accurate conversion if available
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const parts = formatter.formatToParts(native);
        const getValue = (type: string): string =>
          parts.find((p) => p.type === type)?.value || '0';

        const year = parseInt(getValue('year'), 10);
        const month = parseInt(getValue('month'), 10);
        const day = parseInt(getValue('day'), 10);
        const hour = parseInt(getValue('hour'), 10);
        const minute = parseInt(getValue('minute'), 10);
        const second = parseInt(getValue('second'), 10);

        return cloneDate(date, {
          year,
          month,
          day,
          hour,
          minute,
          second,
          timezone,
        });
      } catch {
        // Fallback to manual offset calculation
      }
    }

    // Fallback: manual offset calculation
    const offsetMs = offset * 60 * 1000;
    const localDate = new Date(timestamp + offsetMs);

    return dateFromNative(localDate, timezone);
  } catch (error) {
    throw new TimezoneError(
      `Failed to convert to timezone ${timezone}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Get timezone information
 *
 * @param timezone - Timezone name
 * @returns Timezone information object
 */
export function getTimezoneInfo(timezone: string): TimezoneInfo {
  const offset = getTimezoneOffset(timezone);

  // Try to get abbreviation
  let abbr = timezone;
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'short',
      });
      const parts = formatter.formatToParts(new Date());
      abbr = parts.find((p) => p.type === 'timeZoneName')?.value || timezone;
    } catch {
      // Use provided timezone name as fallback
    }
  }

  return {
    name: timezone,
    offset,
    abbr,
    isDST: false, // DST detection would require more complex logic
  };
}

/**
 * List of common IANA timezone identifiers
 * These are guaranteed to work without lazy-loading
 */
export const COMMON_TIMEZONES = Object.keys(TIMEZONE_OFFSETS);

/**
 * Convert a date from one timezone to another
 *
 * @param date - Source date
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns Promise resolving to converted date
 */
export async function convertTimezone(
  date: ChronoDate,
  fromTimezone: string,
  toTimezone: string
): Promise<ChronoDate> {
  // First convert to UTC if not already
  const utcDate = date.timezone === 'UTC' ? date : await toTimezone(date, 'UTC');

  // Then convert to target timezone
  return toTimezone(utcDate, toTimezone);
}
