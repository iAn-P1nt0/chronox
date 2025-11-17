import { describe, it, expect } from 'vitest';
import { format, FORMAT_PRESETS } from '../../src/format/index';
import { createDate } from '../../src/core/factory';

describe('format', () => {
  const date = createDate('2025-01-15T10:30:45.123Z');

  it('formats year tokens', () => {
    expect(format(date, 'YYYY')).toBe('2025');
    expect(format(date, 'YY')).toBe('25');
  });

  it('formats month tokens', () => {
    expect(format(date, 'MM')).toBe('01');
    expect(format(date, 'M')).toBe('1');
    expect(format(date, 'MMM')).toBe('Jan');
    expect(format(date, 'MMMM')).toBe('January');
  });

  it('formats day tokens', () => {
    expect(format(date, 'DD')).toBe('15');
    expect(format(date, 'D')).toBe('15');
  });

  it('formats hour tokens', () => {
    expect(format(date, 'HH')).toBe('10');
    expect(format(date, 'H')).toBe('10');
  });

  it('formats minute tokens', () => {
    expect(format(date, 'mm')).toBe('30');
    expect(format(date, 'm')).toBe('30');
  });

  it('formats second tokens', () => {
    expect(format(date, 'ss')).toBe('45');
    expect(format(date, 's')).toBe('45');
  });

  it('formats millisecond tokens', () => {
    expect(format(date, 'SSS')).toBe('123');
  });

  it('formats composite patterns', () => {
    expect(format(date, 'YYYY-MM-DD')).toBe('2025-01-15');
    expect(format(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2025-01-15 10:30:45');
  });

  it('handles literal text in brackets', () => {
    expect(format(date, '[Today is] YYYY-MM-DD')).toBe('Today is 2025-01-15');
    expect(format(date, 'YYYY [year] MM [month]')).toBe('2025 year 01 month');
  });

  it('uses format presets', () => {
    expect(format(date, 'ISO_DATE')).toBe('2025-01-15');
    expect(format(date, 'SHORT')).toBe('1/15/2025');
  });

  it('caches compiled formatters', () => {
    const date1 = createDate('2025-01-15');
    const date2 = createDate('2025-02-20');

    const result1 = format(date1, 'YYYY-MM-DD');
    const result2 = format(date2, 'YYYY-MM-DD');

    expect(result1).toBe('2025-01-15');
    expect(result2).toBe('2025-02-20');
  });
});
