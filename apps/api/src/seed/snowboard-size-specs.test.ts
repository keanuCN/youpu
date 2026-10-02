import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { parse as parseYaml } from 'yaml';
import { parseSpecSchema, validateSpecs } from '@youpu/schema';

const categories = parseYaml(readFileSync(resolve(process.cwd(), '../../data/categories.yaml'), 'utf8')) as Array<{
  slug: string;
  spec_schema?: unknown;
}>;
const snowboard = categories.find((category) => category.slug === 'snowboard');
assert.ok(snowboard?.spec_schema);
const snowboardSchema = parseSpecSchema(snowboard.spec_schema);

test('snowboard schema validates wide size variants and official sizeSpecs rows', () => {
  const result = validateSpecs(snowboardSchema, {
    widthVariant: 'wide',
    sizeSpecs: [
      {
        size: '38',
        waistWidth: 230,
        effectiveEdge: 1100,
        sidecutRadii: '7400/6600/7400',
        stanceWidth: '460–540',
        setback: 0,
      },
    ],
  });

  assert.equal(result.ok, true, result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; '));
});

test('snowboard schema validates exact multi-radius sidecut text without coercing it to a scalar', () => {
  const result = validateSpecs(snowboardSchema, {
    sidecutRadii: 'heel 7.8 m / toe 8.2 m',
  });

  assert.equal(result.ok, true, result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; '));
});
