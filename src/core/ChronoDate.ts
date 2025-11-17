/**
 * Immutable ChronoDate implementation
 */

import type { ChronoDate as IChronoDate } from '../types';
import { ChronoError } from '../types';
import { isValidDate, isValidTime, padZero } from '../utils/validation';

/**
 * Internal immutable date class
 */
class ChronoDateImpl implements IChronoDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly timestamp: number;
  readonly timezone: string;

  constructor(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
    timezone: string = 'UTC'
  ) {
    // Validate date components
    if (!isValidDate(year, month, day)) {
      throw new ChronoError(
        `Invalid date: ${year}-${month}-${day}`
      );
    }

    if (!isValidTime(hour, minute, second, millisecond)) {
      throw new ChronoError(
        `Invalid time: ${hour}:${minute}:${second}.${millisecond}`
      );
    }

    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond;
    this.timezone = timezone;

    // Calculate timestamp (UTC)
    const date = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond)
    );
    this.timestamp = date.getTime();

    // Freeze the object to ensure immutability
    Object.freeze(this);
  }

  toNative(): Date {
    return new Date(this.timestamp);
  }

  toISOString(): string {
    const date = `${padZero(this.year, 4)}-${padZero(this.month, 2)}-${padZero(this.day, 2)}`;
    const time = `${padZero(this.hour, 2)}:${padZero(this.minute, 2)}:${padZero(this.second, 2)}`;
    const ms = this.millisecond > 0 ? `.${padZero(this.millisecond, 3)}` : '';
    return `${date}T${time}${ms}Z`;
  }
}

/**
 * Create a ChronoDate from native Date object
 */
export function dateFromNative(date: Date, timezone: string = 'UTC'): IChronoDate {
  return new ChronoDateImpl(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds(),
    timezone
  );
}

/**
 * Create a ChronoDate from timestamp
 */
export function dateFromTimestamp(
  timestamp: number,
  timezone: string = 'UTC'
): IChronoDate {
  return dateFromNative(new Date(timestamp), timezone);
}

/**
 * Create a ChronoDate from components
 */
export function dateFromComponents(
  year: number,
  month: number,
  day: number,
  hour: number = 0,
  minute: number = 0,
  second: number = 0,
  millisecond: number = 0,
  timezone: string = 'UTC'
): IChronoDate {
  return new ChronoDateImpl(
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
 * Clone a ChronoDate with optional modifications
 */
export function cloneDate(
  date: IChronoDate,
  modifications?: Partial<Omit<IChronoDate, 'timestamp' | 'toNative' | 'toISOString'>>
): IChronoDate {
  return new ChronoDateImpl(
    modifications?.year ?? date.year,
    modifications?.month ?? date.month,
    modifications?.day ?? date.day,
    modifications?.hour ?? date.hour,
    modifications?.minute ?? date.minute,
    modifications?.second ?? date.second,
    modifications?.millisecond ?? date.millisecond,
    modifications?.timezone ?? date.timezone
  );
}
