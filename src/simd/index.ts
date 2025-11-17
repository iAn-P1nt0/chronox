/**
 * SIMD module entry point
 * Note: This module is optional and only provides performance benefits
 */

export { SIMD_SUPPORTED, shouldUseSIMD } from './detection';
export {
  addDurationBatch,
  formatBatch,
  compareBatch,
  filterInRangeBatch,
} from './batch';
