import test from 'node:test';
import assert from 'node:assert/strict';
import { formatSpecValue, parseSpecSchema } from './spec-schema';

test('formats small measurements without rounding meaningful precision to zero', () => {
  const field = parseSpecSchema({
    fields: [{ key: 'precision', label: '精度', type: 'number', unit: 'mm' }],
  }).fields[0]!;

  assert.equal(formatSpecValue(field, 0.001), '0.001mm');
  assert.equal(formatSpecValue(field, 0.005), '0.005mm');
  assert.equal(formatSpecValue(field, 1.234), '1.23mm');
});
