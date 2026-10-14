import type { GearSizeSpec, GearSizeSpecValue } from '../types';

function validValue(value: unknown): value is GearSizeSpecValue {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(validValue);
  if (typeof value === 'object') return Object.values(value).every(validValue);
  return false;
}

export function sizeSpecsOf(value: unknown, fallback?: GearSizeSpec[]): GearSizeSpec[] | undefined {
  if (!Array.isArray(value)) return fallback;
  const rows = value.filter((row): row is Record<string, unknown> => Boolean(row && typeof row === 'object' && !Array.isArray(row)));
  if (rows.some(row => !Object.values(row).every(validValue))) return fallback;
  return rows as GearSizeSpec[];
}
