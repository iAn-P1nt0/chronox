import { describe, it, expect } from 'vitest';
import {
  isBefore,
  isAfter,
  isSame,
  isBetween,
  diff,
  min,
  max,
} from '../../src/core/comparison';
import { createDate } from '../../src/core/factory';

describe('comparison', () => {
  const date1 = createDate('2025-01-15T10:00:00Z');
  const date2 = createDate('2025-01-20T10:00:00Z');
  const date3 = createDate('2025-01-15T14:00:00Z');

  describe('isBefore', () => {
    it('returns true when date1 is before date2', () => {
      expect(isBefore(date1, date2)).toBe(true);
    });

    it('returns false when date1 is after date2', () => {
      expect(isBefore(date2, date1)).toBe(false);
    });
  });

  describe('isAfter', () => {
    it('returns true when date1 is after date2', () => {
      expect(isAfter(date2, date1)).toBe(true);
    });

    it('returns false when date1 is before date2', () => {
      expect(isAfter(date1, date2)).toBe(false);
    });
  });

  describe('isSame', () => {
    it('compares by day', () => {
      expect(isSame(date1, date3, 'day')).toBe(true);
      expect(isSame(date1, date2, 'day')).toBe(false);
    });

    it('compares by hour', () => {
      expect(isSame(date1, date3, 'hour')).toBe(false);
    });

    it('compares by millisecond by default', () => {
      expect(isSame(date1, date1)).toBe(true);
      expect(isSame(date1, date3)).toBe(false);
    });
  });

  describe('isBetween', () => {
    it('returns true when date is between', () => {
      const middle = createDate('2025-01-17');
      expect(isBetween(middle, date1, date2)).toBe(true);
    });

    it('returns false when date is outside', () => {
      const outside = createDate('2025-01-25');
      expect(isBetween(outside, date1, date2)).toBe(false);
    });

    it('includes boundaries', () => {
      expect(isBetween(date1, date1, date2)).toBe(true);
      expect(isBetween(date2, date1, date2)).toBe(true);
    });
  });

  describe('diff', () => {
    it('calculates difference in days', () => {
      expect(diff(date1, date2, 'day')).toBe(5);
      expect(diff(date2, date1, 'day')).toBe(-5);
    });

    it('calculates difference in hours', () => {
      expect(diff(date1, date3, 'hour')).toBe(4);
    });

    it('calculates difference in milliseconds by default', () => {
      const result = diff(date1, date2);
      expect(result).toBe(5 * 24 * 60 * 60 * 1000);
    });
  });

  describe('min', () => {
    it('returns earliest date', () => {
      const result = min(date2, date1, date3);
      expect(result.timestamp).toBe(date1.timestamp);
    });

    it('throws on empty array', () => {
      expect(() => min()).toThrow();
    });
  });

  describe('max', () => {
    it('returns latest date', () => {
      const result = max(date1, date2, date3);
      expect(result.timestamp).toBe(date2.timestamp);
    });

    it('throws on empty array', () => {
      expect(() => max()).toThrow();
    });
  });
});
