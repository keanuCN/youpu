import assert from 'node:assert/strict';
import test from 'node:test';
import { SNOWBOARD } from './categories';

test('snowboard spec template exposes official multi-radius sidecut text', () => {
  const fields = SNOWBOARD.specTemplate.flatMap((group) => group.fields);
  const field = fields.find((candidate) => candidate.key === 'sidecutRadii');

  assert.deepEqual(field, {
    key: 'sidecutRadii',
    label: '多段侧切半径原文',
    type: 'text',
    direction: null,
  });
});
