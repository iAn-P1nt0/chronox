import { describe, it, expect } from 'vitest';
import { parseISO } from '../../src/parse/iso';

describe('parseISO', () => {
  it('parses date only format', () => {
    const date = parseISO('2025-01-15');
    expect(date.year).toBe(2025);
    expect(date.month).toBe(1);
    expect(date.day).toBe(15);
    expect(date.hour).toBe(0);
    expect(date.minute).toBe(0);
  });

  it('parses date with time', () => {
    const date = parseISO('2025-01-15T10:30:45Z');
    expect(date.year).toBe(2025);
    expect(date.month).toBe(1);
    expect(date.day).toBe(15);
    expect(date.hour).toBe(10);
    expect(date.minute).toBe(30);
    expect(date.second).toBe(45);
  });

  it('parses date with milliseconds', () => {
    const date = parseISO('2025-01-15T10:30:45.123Z');
    expect(date.millisecond).toBe(123);
  });

  it('parses date with timezone offset', () => {
    const date = parseISO('2025-01-15T10:30:00+05:30');
    expect(date.timezone).toBe('+05:30');
  });

  it('handles leap year dates', () => {
    const date = parseISO('2024-02-29');
    expect(date.day).toBe(29);
    expect(date.month).toBe(2);
  });

  it('throws on invalid leap year date', () => {
    expect(() => parseISO('2023-02-29')).toThrow();
  });

  it('throws on invalid format', () => {
    expect(() => parseISO('invalid')).toThrow();
    expect(() => parseISO('2025-13-01')).toThrow();
    expect(() => parseISO('2025-01-32')).toThrow();
  });
});
