/**
 * ISO 8601 parser - optimized for performance
 */

import type { ChronoDate } from '../types';
import { ParseError } from '../types';
import { dateFromComponents } from '../core/ChronoDate';
import { isValidDate, isValidTime } from '../utils/validation';

/**
 * Parse ISO 8601 date string
 * Supports: YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, YYYY-MM-DDTHH:mm:ss.sss, with optional Z or timezone offset
 *
 * @param isoString - ISO 8601 formatted date string
 * @returns ChronoDate object
 * @throws ParseError if string is invalid
 *
 * @example
 * ```typescript
 * parseISO('2025-01-15'); // Date only
 * parseISO('2025-01-15T10:30:00Z'); // With time and UTC
 * parseISO('2025-01-15T10:30:00.123Z'); // With milliseconds
 * parseISO('2025-01-15T10:30:00+05:30'); // With timezone offset
 * ```
 */
export function parseISO(isoString: string): ChronoDate {
  if (!isoString || typeof isoString !== 'string') {
    throw new ParseError('Invalid input: expected ISO 8601 string');
  }

  // Split date and time parts
  const parts = isoString.split('T');
  if (parts.length === 0 || parts.length > 2) {
    throw new ParseError(`Invalid ISO 8601 format: ${isoString}`);
  }

  const datePart = parts[0];
  const timePart = parts[1] || '00:00:00';

  // Parse date (YYYY-MM-DD)
  const dateMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) {
    throw new ParseError(`Invalid date format: ${datePart}`);
  }

  const year = parseInt(dateMatch[1], 10);
  const month = parseInt(dateMatch[2], 10);
  const day = parseInt(dateMatch[3], 10);

  if (!isValidDate(year, month, day)) {
    throw new ParseError(`Invalid date: ${year}-${month}-${day}`);
  }

  // Parse time and timezone
  let timeStr = timePart;
  let timezone = 'UTC';

  // Extract timezone
  if (timeStr.endsWith('Z')) {
    timeStr = timeStr.slice(0, -1);
  } else {
    // Check for timezone offset (+HH:mm or -HH:mm)
    const tzMatch = timeStr.match(/([+-]\d{2}:\d{2})$/);
    if (tzMatch) {
      timezone = tzMatch[1];
      timeStr = timeStr.slice(0, -6);
    }
  }

  // Parse time (HH:mm:ss or HH:mm:ss.sss)
  const timeMatch = timeStr.match(/^(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/);
  if (!timeMatch) {
    throw new ParseError(`Invalid time format: ${timeStr}`);
  }

  const hour = parseInt(timeMatch[1], 10);
  const minute = parseInt(timeMatch[2], 10);
  const second = parseInt(timeMatch[3], 10);
  const millisecond = timeMatch[4] ? parseInt(timeMatch[4].padEnd(3, '0'), 10) : 0;

  if (!isValidTime(hour, minute, second, millisecond)) {
    throw new ParseError(
      `Invalid time: ${hour}:${minute}:${second}.${millisecond}`
    );
  }

  return dateFromComponents(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    timezone
  );
}

/**
 * Parse date string with custom format
 * Basic implementation - can be extended
 *
 * @param dateString - Date string to parse
 * @param formatStr - Format string (e.g., 'YYYY-MM-DD')
 * @returns ChronoDate object
 * @throws ParseError if parsing fails
 */
export function parse(dateString: string, formatStr: string): ChronoDate {
  // For now, delegate to native Date parser and ISO parser
  // This can be extended with a full token-based parser
  if (formatStr === 'YYYY-MM-DD' || formatStr === 'ISO') {
    return parseISO(dateString);
  }

  // Fallback to native parser
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new ParseError(`Unable to parse date: ${dateString}`);
    }

    return dateFromComponents(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    );
  } catch (error) {
    throw new ParseError(
      `Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
