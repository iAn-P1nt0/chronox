/**
 * Temporal API compatibility layer
 * Provides Temporal-like API using chroncraft internally
 */

import type { ChronoDate } from '../types';
import { dateFromComponents } from '../core/ChronoDate';
import { createDate } from '../core/factory';

/**
 * Check if native Temporal API is available
 */
export function isNativeTemporalAvailable(): boolean {
  return typeof globalThis !== 'undefined' && 'Temporal' in globalThis;
}

/**
 * PlainDate - Temporal API compatible
 * Represents a calendar date without time
 */
export class PlainDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    Object.freeze(this);
  }

  /**
   * Create from ISO string
   */
  static from(input: string | { year: number; month: number; day: number }): PlainDate {
    if (typeof input === 'string') {
      const date = createDate(input);
      return new PlainDate(date.year, date.month, date.day);
    }
    return new PlainDate(input.year, input.month, input.day);
  }

  /**
   * Convert to ChronoDate
   */
  toChronoDate(): ChronoDate {
    return dateFromComponents(this.year, this.month, this.day);
  }

  /**
   * Convert to ISO string
   */
  toString(): string {
    return this.toChronoDate().toISOString().split('T')[0];
  }

  /**
   * Get the day of week (1 = Monday, 7 = Sunday)
   */
  get dayOfWeek(): number {
    const date = this.toChronoDate().toNative();
    const day = date.getUTCDay();
    return day === 0 ? 7 : day; // Temporal uses 1-7 with Monday = 1
  }

  /**
   * Get the day of year
   */
  get dayOfYear(): number {
    const start = dateFromComponents(this.year, 1, 1);
    const current = this.toChronoDate();
    const diff = current.timestamp - start.timestamp;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }
}

/**
 * PlainTime - Temporal API compatible
 * Represents a wall-clock time without date
 */
export class PlainTime {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;

  constructor(
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0
  ) {
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond;
    Object.freeze(this);
  }

  /**
   * Create from string or object
   */
  static from(
    input:
      | string
      | { hour: number; minute?: number; second?: number; millisecond?: number }
  ): PlainTime {
    if (typeof input === 'string') {
      const date = createDate(`1970-01-01T${input}`);
      return new PlainTime(
        date.hour,
        date.minute,
        date.second,
        date.millisecond
      );
    }
    return new PlainTime(
      input.hour,
      input.minute,
      input.second,
      input.millisecond
    );
  }

  /**
   * Convert to string
   */
  toString(): string {
    const h = String(this.hour).padStart(2, '0');
    const m = String(this.minute).padStart(2, '0');
    const s = String(this.second).padStart(2, '0');
    const ms = this.millisecond > 0 ? `.${String(this.millisecond).padStart(3, '0')}` : '';
    return `${h}:${m}:${s}${ms}`;
  }
}

/**
 * PlainDateTime - Temporal API compatible
 * Represents a date and time without timezone
 */
export class PlainDateTime {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;

  constructor(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0
  ) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond;
    Object.freeze(this);
  }

  /**
   * Create from ChronoDate
   */
  static fromChronoDate(date: ChronoDate): PlainDateTime {
    return new PlainDateTime(
      date.year,
      date.month,
      date.day,
      date.hour,
      date.minute,
      date.second,
      date.millisecond
    );
  }

  /**
   * Create from ISO string
   */
  static from(input: string): PlainDateTime {
    const date = createDate(input);
    return PlainDateTime.fromChronoDate(date);
  }

  /**
   * Convert to ChronoDate
   */
  toChronoDate(): ChronoDate {
    return dateFromComponents(
      this.year,
      this.month,
      this.day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond
    );
  }

  /**
   * Convert to ISO string
   */
  toString(): string {
    return this.toChronoDate().toISOString();
  }

  /**
   * Get PlainDate component
   */
  toPlainDate(): PlainDate {
    return new PlainDate(this.year, this.month, this.day);
  }

  /**
   * Get PlainTime component
   */
  toPlainTime(): PlainTime {
    return new PlainTime(this.hour, this.minute, this.second, this.millisecond);
  }
}

/**
 * Duration - Temporal API compatible
 */
export class Duration {
  readonly years: number;
  readonly months: number;
  readonly weeks: number;
  readonly days: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;

  constructor(
    years: number = 0,
    months: number = 0,
    weeks: number = 0,
    days: number = 0,
    hours: number = 0,
    minutes: number = 0,
    seconds: number = 0,
    milliseconds: number = 0
  ) {
    this.years = years;
    this.months = months;
    this.weeks = weeks;
    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.milliseconds = milliseconds;
    Object.freeze(this);
  }

  /**
   * Create from object
   */
  static from(input: Partial<Duration>): Duration {
    return new Duration(
      input.years,
      input.months,
      input.weeks,
      input.days,
      input.hours,
      input.minutes,
      input.seconds,
      input.milliseconds
    );
  }

  /**
   * Convert to chroncraft Duration type
   */
  toChronoDuration(): import('../types').Duration {
    return {
      years: this.years,
      months: this.months,
      weeks: this.weeks,
      days: this.days,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      milliseconds: this.milliseconds,
    };
  }
}

/**
 * Temporal namespace for compatibility
 */
export const TemporalCompat = {
  PlainDate,
  PlainTime,
  PlainDateTime,
  Duration,
  isNativeTemporalAvailable,
};
