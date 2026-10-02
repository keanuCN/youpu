import assert from 'node:assert/strict';
import test from 'node:test';
import { selectSeedTargets, toSeedSpecs } from './seed-specs';

test('seed spec export preserves verified per-size rows alongside representative specs', () => {
  const sizeSpecs = [
    { size: '159', effectiveEdge: 1200, waistWidth: 269, setback: 35, stanceWidth: '550 mm (ref); 510–590 mm (range)' },
  ];
  const specs = { length: 159, effectiveEdge: 1200, price: 6899, year: 2026 };

  assert.deepEqual(toSeedSpecs(specs, ['carving'], sizeSpecs), {
    length: 159,
    effectiveEdge: 1200,
    scenes: ['carving'],
    sizeSpecs,
  });
});

test('seed export can target one product without rewriting unrelated YAMLs', () => {
  const products = [{ slug: 'one' }, { slug: 'two' }];

  assert.deepEqual(selectSeedTargets(products, 'two'), [{ slug: 'two' }]);
  assert.throws(() => selectSeedTargets(products, 'missing'), /No seed product matches/);
});
