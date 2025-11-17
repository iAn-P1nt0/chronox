/**
 * Format tokens - optimized with lookup tables for O(1) access
 */

import type { ChronoDate } from '../types';
import { padZero } from '../utils/validation';
import { MONTH_NAMES, MONTH_NAMES_SHORT, DAY_NAMES, DAY_NAMES_SHORT } from '../utils/constants';

/**
 * Token handler function type
 */
type TokenHandler = (date: ChronoDate) => string;

/**
 * Get day of week (0 = Sunday, 6 = Saturday)
 */
function getDayOfWeek(date: ChronoDate): number {
  return date.toNative().getUTCDay();
}

/**
 * Format token handlers - using object lookup for O(1) access
 */
export const TOKEN_HANDLERS: Record<string, TokenHandler> = {
  // Year
  YYYY: (date) => padZero(date.year, 4),
  YY: (date) => padZero(date.year % 100, 2),

  // Month
  MMMM: (date) => MONTH_NAMES[date.month - 1] || '',
  MMM: (date) => MONTH_NAMES_SHORT[date.month - 1] || '',
  MM: (date) => padZero(date.month, 2),
  M: (date) => date.month.toString(),

  // Day
  DD: (date) => padZero(date.day, 2),
  D: (date) => date.day.toString(),

  // Day of week
  dddd: (date) => DAY_NAMES[getDayOfWeek(date)] || '',
  ddd: (date) => DAY_NAMES_SHORT[getDayOfWeek(date)] || '',
  d: (date) => getDayOfWeek(date).toString(),

  // Hour
  HH: (date) => padZero(date.hour, 2),
  H: (date) => date.hour.toString(),
  hh: (date) => padZero(date.hour % 12 || 12, 2),
  h: (date) => (date.hour % 12 || 12).toString(),

  // Minute
  mm: (date) => padZero(date.minute, 2),
  m: (date) => date.minute.toString(),

  // Second
  ss: (date) => padZero(date.second, 2),
  s: (date) => date.second.toString(),

  // Millisecond
  SSS: (date) => padZero(date.millisecond, 3),
  SS: (date) => padZero(Math.floor(date.millisecond / 10), 2),
  S: (date) => Math.floor(date.millisecond / 100).toString(),

  // AM/PM
  A: (date) => (date.hour >= 12 ? 'PM' : 'AM'),
  a: (date) => (date.hour >= 12 ? 'pm' : 'am'),

  // Timezone
  Z: (date) => {
    if (date.timezone === 'UTC' || date.timezone === 'GMT') {
      return '+00:00';
    }
    return date.timezone;
  },
  ZZ: (date) => {
    if (date.timezone === 'UTC' || date.timezone === 'GMT') {
      return '+0000';
    }
    return date.timezone.replace(':', '');
  },

  // Unix timestamp
  X: (date) => Math.floor(date.timestamp / 1000).toString(),
  x: (date) => date.timestamp.toString(),
};

/**
 * Common format presets
 */
export const FORMAT_PRESETS: Record<string, string> = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  ISO_DATE: 'YYYY-MM-DD',
  ISO_TIME: 'HH:mm:ss',
  RFC2822: 'ddd, DD MMM YYYY HH:mm:ss Z',
  HTTP: 'ddd, DD MMM YYYY HH:mm:ss [GMT]',
  SQL: 'YYYY-MM-DD HH:mm:ss',
  SHORT: 'M/D/YYYY',
  MEDIUM: 'MMM D, YYYY',
  LONG: 'MMMM D, YYYY',
  FULL: 'dddd, MMMM D, YYYY',
  TIME: 'h:mm A',
  TIME_24: 'HH:mm',
  TIME_WITH_SECONDS: 'h:mm:ss A',
  DATETIME_SHORT: 'M/D/YYYY h:mm A',
  DATETIME_MEDIUM: 'MMM D, YYYY h:mm A',
  DATETIME_LONG: 'MMMM D, YYYY h:mm A',
};

/**
 * Token pattern regex - matches all possible tokens
 * Ordered by length to match longest first
 */
export const TOKEN_PATTERN = new RegExp(
  Object.keys(TOKEN_HANDLERS)
    .sort((a, b) => b.length - a.length)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'g'
);
