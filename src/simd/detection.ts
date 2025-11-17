/**
 * SIMD feature detection and utilities
 */

/**
 * Check if WebAssembly SIMD is supported
 * This is done once at module initialization
 */
export const SIMD_SUPPORTED = (() => {
  try {
    // Check if WebAssembly is available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globalThis as any;
    if (typeof g.WebAssembly === 'undefined') {
      return false;
    }

    // Try to validate a minimal SIMD module
    // This is a simple WASM module that uses SIMD instructions
    const simdTestModule = new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10,
      1, 8, 0, 65, 0, 253, 17, 253, 186, 1, 11,
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return g.WebAssembly.validate(simdTestModule) as boolean;
  } catch {
    return false;
  }
})();

/**
 * Minimum array size to benefit from SIMD operations
 * Below this threshold, regular JavaScript is faster due to overhead
 */
export const SIMD_THRESHOLD = 4;

/**
 * Check if an operation should use SIMD
 *
 * @param arrayLength - Length of the array to process
 * @returns true if SIMD should be used
 */
export function shouldUseSIMD(arrayLength: number): boolean {
  return SIMD_SUPPORTED && arrayLength >= SIMD_THRESHOLD;
}
