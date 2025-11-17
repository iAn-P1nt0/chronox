/**
 * Constants for date/time calculations
 */

export const MILLISECONDS_IN_SECOND = 1000;
export const MILLISECONDS_IN_MINUTE = 60 * MILLISECONDS_IN_SECOND;
export const MILLISECONDS_IN_HOUR = 60 * MILLISECONDS_IN_MINUTE;
export const MILLISECONDS_IN_DAY = 24 * MILLISECONDS_IN_HOUR;
export const MILLISECONDS_IN_WEEK = 7 * MILLISECONDS_IN_DAY;

export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
export const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;

export const MINUTES_IN_HOUR = 60;
export const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

export const HOURS_IN_DAY = 24;
export const DAYS_IN_WEEK = 7;

/**
 * Common timezone offsets in minutes
 */
export const TIMEZONE_OFFSETS: Record<string, number> = {
  UTC: 0,
  GMT: 0,
  EST: -300, // UTC-5
  EDT: -240, // UTC-4
  CST: -360, // UTC-6
  CDT: -300, // UTC-5
  MST: -420, // UTC-7
  MDT: -360, // UTC-6
  PST: -480, // UTC-8
  PDT: -420, // UTC-7
  IST: 330, // UTC+5:30 (India)
  JST: 540, // UTC+9
  AEST: 600, // UTC+10
  AEDT: 660, // UTC+11
};

/**
 * Month names
 */
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Day names
 */
export const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
