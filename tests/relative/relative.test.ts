import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDistanceToNow,
  formatDistance,
  formatRelativeTime,
  formatShortRelativeTime,
} from '../../src/relative/index';
import { createDate } from '../../src/core/factory';

describe('relative', () => {
  // Mock Date.now for consistent test results
  const NOW = new Date('2025-03-15T12:00:00Z').getTime();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDistanceToNow', () => {
    it('formats seconds ago', () => {
      const date = new Date(NOW - 45 * 1000);
      expect(formatDistanceToNow(date)).toBe('less than a minute ago');
    });

    it('formats seconds ago with includeSeconds', () => {
      const date = new Date(NOW - 8 * 1000);
      expect(formatDistanceToNow(date, { includeSeconds: true })).toBe('less than 10 seconds ago');
    });

    it('formats minutes ago', () => {
      const date = new Date(NOW - 5 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('5 minutes ago');
    });

    it('formats 1 minute ago', () => {
      const date = new Date(NOW - 90 * 1000);
      expect(formatDistanceToNow(date)).toBe('1 minute ago');
    });

    it('formats hours ago', () => {
      const date = new Date(NOW - 3 * 60 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('about 3 hours ago');
    });

    it('formats 1 hour ago', () => {
      const date = new Date(NOW - 90 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('about 1 hour ago');
    });

    it('formats days ago', () => {
      const date = new Date(NOW - 5 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('5 days ago');
    });

    it('formats 1 day ago', () => {
      const date = new Date(NOW - 36 * 60 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('1 day ago');
    });

    it('formats months ago', () => {
      const date = new Date(NOW - 60 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('about 2 months ago');
    });

    it('formats 1 month ago', () => {
      const date = new Date(NOW - 35 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('about 1 month ago');
    });

    it('formats years ago', () => {
      const date = new Date(NOW - 400 * 24 * 60 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('about 1 year ago');
    });

    it('formats future dates', () => {
      const date = new Date(NOW + 5 * 60 * 1000);
      expect(formatDistanceToNow(date)).toBe('in 5 minutes');
    });

    it('works without suffix', () => {
      const date = new Date(NOW - 5 * 60 * 1000);
      expect(formatDistanceToNow(date, { addSuffix: false })).toBe('5 minutes');
    });

    it('accepts string dates', () => {
      const date = new Date(NOW - 5 * 60 * 1000).toISOString();
      expect(formatDistanceToNow(date)).toBe('5 minutes ago');
    });

    it('accepts timestamp numbers', () => {
      const date = NOW - 5 * 60 * 1000;
      expect(formatDistanceToNow(date)).toBe('5 minutes ago');
    });

    it('accepts ChronoDate', () => {
      const date = createDate(new Date(NOW - 5 * 60 * 1000));
      expect(formatDistanceToNow(date)).toBe('5 minutes ago');
    });

    it('accepts custom base date', () => {
      const date = new Date('2025-03-10T12:00:00Z');
      const baseDate = new Date('2025-03-15T12:00:00Z');
      expect(formatDistanceToNow(date, { baseDate })).toBe('5 days ago');
    });
  });

  describe('formatDistance', () => {
    it('formats distance between two dates', () => {
      const date1 = new Date('2025-03-10T12:00:00Z');
      const date2 = new Date('2025-03-15T12:00:00Z');
      expect(formatDistance(date1, date2)).toBe('5 days ago');
    });

    it('formats future distance', () => {
      const date1 = new Date('2025-03-20T12:00:00Z');
      const date2 = new Date('2025-03-15T12:00:00Z');
      expect(formatDistance(date1, date2)).toBe('in 5 days');
    });

    it('works without suffix', () => {
      const date1 = new Date('2025-03-10T12:00:00Z');
      const date2 = new Date('2025-03-15T12:00:00Z');
      expect(formatDistance(date1, date2, { addSuffix: false })).toBe('5 days');
    });
  });

  describe('formatRelativeTime', () => {
    it('formats just now for recent dates', () => {
      const date = new Date(NOW - 30 * 1000);
      expect(formatRelativeTime(date)).toBe('just now');
    });

    it('formats minutes ago', () => {
      const date = new Date(NOW - 5 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });

    it('formats 1 minute ago', () => {
      const date = new Date(NOW - 90 * 1000);
      expect(formatRelativeTime(date)).toBe('1 minute ago');
    });

    it('formats hours ago', () => {
      const date = new Date(NOW - 3 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('3 hours ago');
    });

    it('formats 1 hour ago', () => {
      const date = new Date(NOW - 90 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('1 hour ago');
    });

    it('formats days ago', () => {
      const date = new Date(NOW - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('3 days ago');
    });

    it('formats 1 day ago', () => {
      const date = new Date(NOW - 36 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('1 day ago');
    });

    it('formats weeks ago', () => {
      const date = new Date(NOW - 14 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('2 weeks ago');
    });

    it('formats 1 week ago', () => {
      const date = new Date(NOW - 10 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('1 week ago');
    });

    it('formats months ago', () => {
      const date = new Date(NOW - 60 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('2 months ago');
    });

    it('formats 1 month ago', () => {
      const date = new Date(NOW - 35 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('1 month ago');
    });

    it('formats years ago', () => {
      const date = new Date(NOW - 800 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('2 years ago');
    });

    it('formats 1 year ago', () => {
      const date = new Date(NOW - 400 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(date)).toBe('1 year ago');
    });

    it('formats future dates as just now', () => {
      const date = new Date(NOW + 60 * 1000);
      expect(formatRelativeTime(date)).toBe('just now');
    });

    it('accepts custom base date', () => {
      const date = new Date('2025-03-10T12:00:00Z');
      const baseDate = new Date('2025-03-15T12:00:00Z');
      expect(formatRelativeTime(date, { baseDate })).toBe('5 days ago');
    });

    it('accepts timestamp numbers', () => {
      const date = NOW - 5 * 60 * 1000;
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });

    it('accepts ChronoDate', () => {
      const date = createDate(new Date(NOW - 5 * 60 * 1000));
      expect(formatRelativeTime(date)).toBe('5 minutes ago');
    });
  });

  describe('formatShortRelativeTime', () => {
    it('formats now for recent dates', () => {
      const date = new Date(NOW - 30 * 1000);
      expect(formatShortRelativeTime(date)).toBe('now');
    });

    it('formats minutes', () => {
      const date = new Date(NOW - 5 * 60 * 1000);
      expect(formatShortRelativeTime(date)).toBe('5m');
    });

    it('formats hours', () => {
      const date = new Date(NOW - 3 * 60 * 60 * 1000);
      expect(formatShortRelativeTime(date)).toBe('3h');
    });

    it('formats days', () => {
      const date = new Date(NOW - 3 * 24 * 60 * 60 * 1000);
      expect(formatShortRelativeTime(date)).toBe('3d');
    });

    it('formats weeks', () => {
      const date = new Date(NOW - 14 * 24 * 60 * 60 * 1000);
      expect(formatShortRelativeTime(date)).toBe('2w');
    });

    it('formats months', () => {
      const date = new Date(NOW - 60 * 24 * 60 * 60 * 1000);
      expect(formatShortRelativeTime(date)).toBe('2mo');
    });

    it('formats years', () => {
      const date = new Date(NOW - 400 * 24 * 60 * 60 * 1000);
      expect(formatShortRelativeTime(date)).toBe('1y');
    });

    it('formats future dates as now', () => {
      const date = new Date(NOW + 60 * 1000);
      expect(formatShortRelativeTime(date)).toBe('now');
    });

    it('accepts custom base date', () => {
      const date = new Date('2025-03-10T12:00:00Z');
      const baseDate = new Date('2025-03-15T12:00:00Z');
      expect(formatShortRelativeTime(date, { baseDate })).toBe('5d');
    });

    it('accepts timestamp numbers', () => {
      const date = NOW - 5 * 60 * 1000;
      expect(formatShortRelativeTime(date)).toBe('5m');
    });

    it('accepts ChronoDate', () => {
      const date = createDate(new Date(NOW - 5 * 60 * 1000));
      expect(formatShortRelativeTime(date)).toBe('5m');
    });
  });
});
