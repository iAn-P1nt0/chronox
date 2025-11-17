/**
 * Core type definitions for ChronoX
 */

/**
 * Immutable date representation
 */
export interface ChronoDate {
  readonly year: number;
  readonly month: number; // 1-12
  readonly day: number; // 1-31
  readonly hour: number; // 0-23
  readonly minute: number; // 0-59
  readonly second: number; // 0-59
  readonly millisecond: number; // 0-999
  readonly timestamp: number; // Unix timestamp in milliseconds
  readonly timezone: string; // IANA timezone name or offset (e.g., "UTC", "America/New_York", "+05:30")
  toNative(): Date;
  toISOString(): string;
}

/**
 * Duration for date arithmetic
 */
export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

/**
 * Time units for comparison and arithmetic
 */
export type Unit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond';

/**
 * Date input types
 */
export type DateInput = Date | string | number | ChronoDate;

/**
 * Format options
 */
export interface FormatOptions {
  timezone?: string;
  locale?: string;
}

/**
 * Format token mapping
 */
export interface FormatToken {
  pattern: string;
  handler: (date: ChronoDate) => string;
}

/**
 * Compiled format function for caching
 */
export type CompiledFormatter = (date: ChronoDate) => string;

/**
 * Timezone information
 */
export interface TimezoneInfo {
  name: string;
  offset: number; // in minutes
  abbr: string;
  isDST: boolean;
}

/**
 * Common timezone identifiers
 */
export type CommonTimezone =
  | 'UTC'
  | 'GMT'
  | 'EST'
  | 'PST'
  | 'CST'
  | 'MST'
  | 'IST'
  | 'JST'
  | 'AEST';

/**
 * Error types
 */
export class ChronoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChronoError';
  }
}

export class ParseError extends ChronoError {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

export class FormatError extends ChronoError {
  constructor(message: string) {
    super(message);
    this.name = 'FormatError';
  }
}

export class TimezoneError extends ChronoError {
  constructor(message: string) {
    super(message);
    this.name = 'TimezoneError';
  }
}
