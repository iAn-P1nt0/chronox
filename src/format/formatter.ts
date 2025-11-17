/**
 * Format engine with caching for optimal performance
 */

import type { ChronoDate, CompiledFormatter } from '../types';
import { FormatError } from '../types';
import { TOKEN_HANDLERS, TOKEN_PATTERN, FORMAT_PRESETS } from './tokens';

/**
 * Cache for compiled formatters using WeakMap for memory efficiency
 * Key: format string, Value: compiled formatter function
 */
const formatterCache = new Map<string, CompiledFormatter>();

/**
 * Compile a format string into an optimized formatter function
 * This is cached for subsequent uses
 *
 * @param formatStr - Format string with tokens
 * @returns Compiled formatter function
 */
function compileFormatter(formatStr: string): CompiledFormatter {
  // Check cache first
  const cached = formatterCache.get(formatStr);
  if (cached) {
    return cached;
  }

  // Check if it's a preset
  const preset = FORMAT_PRESETS[formatStr];
  if (preset) {
    return compileFormatter(preset);
  }

  // Build the formatter function
  const parts: Array<string | ((date: ChronoDate) => string)> = [];
  let lastIndex = 0;

  // Handle literal strings in square brackets [literal text]
  const literalPattern = /\[([^\]]+)\]/g;
  const literals: Array<{ index: number; text: string; length: number }> = [];

  let literalMatch;
  while ((literalMatch = literalPattern.exec(formatStr)) !== null) {
    literals.push({
      index: literalMatch.index,
      text: literalMatch[1],
      length: literalMatch[0].length,
    });
  }

  // Remove literals temporarily for token matching
  let workingStr = formatStr;
  let offset = 0;
  for (const literal of literals) {
    const before = workingStr.slice(0, literal.index - offset);
    const after = workingStr.slice(literal.index + literal.length - offset);
    workingStr = before + '\x00'.repeat(literal.length) + after;
  }

  // Match tokens
  TOKEN_PATTERN.lastIndex = 0;
  let match;

  while ((match = TOKEN_PATTERN.exec(workingStr)) !== null) {
    const token = match[0];

    // Skip if this is in a literal section
    if (token[0] === '\x00') {
      continue;
    }

    // Add any text before this token
    if (match.index > lastIndex) {
      const text = formatStr.slice(lastIndex, match.index);
      if (text) {
        parts.push(text);
      }
    }

    // Add the token handler
    const handler = TOKEN_HANDLERS[token];
    if (handler) {
      parts.push(handler);
    } else {
      parts.push(token); // Unknown token, keep as-is
    }

    lastIndex = match.index + token.length;
  }

  // Add any remaining text
  if (lastIndex < formatStr.length) {
    const remaining = formatStr.slice(lastIndex);
    if (remaining) {
      parts.push(remaining);
    }
  }

  // Restore literals
  for (let i = 0; i < parts.length; i++) {
    if (typeof parts[i] === 'string') {
      parts[i] = (parts[i] as string).replace(/\[([^\]]+)\]/g, '$1');
    }
  }

  // Create compiled formatter
  const compiled: CompiledFormatter = (date: ChronoDate): string => {
    let result = '';
    for (const part of parts) {
      if (typeof part === 'function') {
        result += part(date);
      } else {
        result += part;
      }
    }
    return result;
  };

  // Cache it
  formatterCache.set(formatStr, compiled);

  return compiled;
}

/**
 * Format a date according to the specified format string
 *
 * @param date - The date to format
 * @param formatStr - Format string (e.g., 'YYYY-MM-DD')
 * @returns Formatted date string
 * @throws {FormatError} If format string is invalid
 *
 * @example
 * ```typescript
 * const date = createDate('2025-01-15');
 * format(date, 'YYYY-MM-DD'); // '2025-01-15'
 * format(date, 'MMM DD, YYYY'); // 'Jan 15, 2025'
 * format(date, 'ISO'); // Uses ISO preset
 * format(date, '[Today is] MMMM D, YYYY'); // 'Today is January 15, 2025'
 * ```
 */
export function format(date: ChronoDate, formatStr: string): string {
  if (!date || typeof date !== 'object') {
    throw new FormatError('Invalid date object');
  }

  if (!formatStr || typeof formatStr !== 'string') {
    throw new FormatError('Invalid format string');
  }

  try {
    const formatter = compileFormatter(formatStr);
    return formatter(date);
  } catch (error) {
    throw new FormatError(
      `Format error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Clear the formatter cache (useful for memory management in long-running processes)
 */
export function clearFormatterCache(): void {
  formatterCache.clear();
}

/**
 * Get the size of the formatter cache
 */
export function getFormatterCacheSize(): number {
  return formatterCache.size;
}
