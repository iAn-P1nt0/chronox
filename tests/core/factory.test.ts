import { describe, it, expect } from 'vitest';
import { createDate, now, isValid, startOfDay, endOfDay } from '../../src/core/factory';

describe('createDate', () => {
  it('creates date from ISO string', () => {
    const date = createDate('2025-01-15T10:30:00Z');
    expect(date.year).toBe(2025);
    expect(date.month).toBe(1);
    expect(date.day).toBe(15);
    expect(date.hour).toBe(10);
    expect(date.minute).toBe(30);
  });

  it('creates date from timestamp', () => {
    const timestamp = Date.UTC(2025, 0, 15, 10, 30, 0);
    const date = createDate(timestamp);
    expect(date.year).toBe(2025);
    expect(date.month).toBe(1);
    expect(date.day).toBe(15);
  });

  it('creates date from native Date', () => {
    const native = new Date('2025-01-15T10:30:00Z');
    const date = createDate(native);
    expect(date.year).toBe(2025);
    expect(date.month).toBe(1);
    expect(date.day).toBe(15);
  });

  it('creates current date when no input', () => {
    const date = createDate();
    const native = new Date();
    expect(date.year).toBe(native.getUTCFullYear());
  });

  it('throws on invalid string', () => {
    expect(() => createDate('invalid')).toThrow();
  });
});

describe('now', () => {
  it('returns current date', () => {
    const date = now();
    const native = new Date();
    expect(date.year).toBe(native.getUTCFullYear());
    expect(date.month).toBe(native.getUTCMonth() + 1);
  });
});

describe('isValid', () => {
  it('validates ISO string', () => {
    expect(isValid('2025-01-15')).toBe(true);
    expect(isValid('invalid')).toBe(false);
  });

  it('validates timestamp', () => {
    expect(isValid(1705334400000)).toBe(true);
    expect(isValid(NaN)).toBe(false);
  });

  it('validates native Date', () => {
    expect(isValid(new Date())).toBe(true);
    expect(isValid(new Date('invalid'))).toBe(false);
  });
});

describe('startOfDay', () => {
  it('sets time to 00:00:00.000', () => {
    const date = startOfDay('2025-01-15T14:30:45.123Z');
    expect(date.hour).toBe(0);
    expect(date.minute).toBe(0);
    expect(date.second).toBe(0);
    expect(date.millisecond).toBe(0);
    expect(date.day).toBe(15);
  });
});

describe('endOfDay', () => {
  it('sets time to 23:59:59.999', () => {
    const date = endOfDay('2025-01-15T14:30:45.123Z');
    expect(date.hour).toBe(23);
    expect(date.minute).toBe(59);
    expect(date.second).toBe(59);
    expect(date.millisecond).toBe(999);
    expect(date.day).toBe(15);
  });
});
