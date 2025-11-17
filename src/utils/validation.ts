/**
 * Validation utilities
 */

/**
 * Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 2 && isLeapYear(year)) {
    return 29;
  }

  return daysInMonth[month - 1] || 0;
}

/**
 * Validate date components
 */
export function isValidDate(
  year: number,
  month: number,
  day: number
): boolean {
  if (month < 1 || month > 12) {
    return false;
  }

  if (day < 1) {
    return false;
  }

  return day <= getDaysInMonth(year, month);
}

/**
 * Validate time components
 */
export function isValidTime(
  hour: number,
  minute: number,
  second: number,
  millisecond: number
): boolean {
  return (
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59 &&
    second >= 0 &&
    second <= 59 &&
    millisecond >= 0 &&
    millisecond <= 999
  );
}

/**
 * Pad a number with leading zeros
 */
export function padZero(num: number, length: number): string {
  return num.toString().padStart(length, '0');
}

/**
 * Validate ISO 8601 date string format
 */
export function isValidISOString(str: string): boolean {
  // Basic ISO 8601 pattern
  const isoPattern =
    /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})?)?$/;
  return isoPattern.test(str);
}
