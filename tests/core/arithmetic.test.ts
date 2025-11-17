import { describe, it, expect } from 'vitest';
import {
  addDays,
  addMonths,
  addYears,
  addHours,
  addDuration,
  subtractDays,
} from '../../src/core/arithmetic';
import { createDate } from '../../src/core/factory';

describe('arithmetic', () => {
  const date = createDate('2025-01-15T10:00:00Z');

  describe('addDays', () => {
    it('adds positive days', () => {
      const result = addDays(date, 5);
      expect(result.day).toBe(20);
    });

    it('adds negative days', () => {
      const result = addDays(date, -5);
      expect(result.day).toBe(10);
    });

    it('handles month overflow', () => {
      const result = addDays(date, 20);
      expect(result.month).toBe(2);
      expect(result.day).toBe(4);
    });
  });

  describe('addMonths', () => {
    it('adds months', () => {
      const result = addMonths(date, 3);
      expect(result.month).toBe(4);
    });

    it('handles year overflow', () => {
      const result = addMonths(date, 12);
      expect(result.year).toBe(2026);
      expect(result.month).toBe(1);
    });

    it('handles month-end edge cases', () => {
      const jan31 = createDate('2025-01-31');
      const result = addMonths(jan31, 1);
      expect(result.month).toBe(2);
      // February doesn't have 31 days, should adjust
    });
  });

  describe('addYears', () => {
    it('adds years', () => {
      const result = addYears(date, 5);
      expect(result.year).toBe(2030);
    });
  });

  describe('addHours', () => {
    it('adds hours', () => {
      const result = addHours(date, 5);
      expect(result.hour).toBe(15);
    });

    it('handles day overflow', () => {
      const result = addHours(date, 20);
      expect(result.day).toBe(16);
      expect(result.hour).toBe(6);
    });
  });

  describe('addDuration', () => {
    it('adds complex duration', () => {
      const result = addDuration(date, {
        days: 5,
        hours: 3,
        minutes: 30,
      });

      expect(result.day).toBe(20);
      expect(result.hour).toBe(13);
      expect(result.minute).toBe(30);
    });
  });

  describe('subtractDays', () => {
    it('subtracts days', () => {
      const result = subtractDays(date, 5);
      expect(result.day).toBe(10);
    });
  });

  it('maintains immutability', () => {
    const original = createDate('2025-01-15');
    addDays(original, 5);
    expect(original.day).toBe(15);
  });
});
