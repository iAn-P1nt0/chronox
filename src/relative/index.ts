/**
 * Relative time formatting module
 * Human-readable relative time strings
 */

// Format distance (date-fns compatible)
export {
  formatDistanceToNow,
  formatDistance,
  type FormatDistanceOptions,
} from './formatDistance';

// Relative time formatting
export {
  formatRelativeTime,
  formatShortRelativeTime,
  type RelativeTimeOptions,
} from './formatRelative';
