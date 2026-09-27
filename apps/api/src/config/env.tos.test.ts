import assert from 'node:assert/strict';
import test from 'node:test';
import { loadEnv } from './env';

const tosKeys = [
  'TOS_REGION',
  'TOS_BUCKET',
  'TOS_ENDPOINT',
  'TOS_ACCESS_KEY',
  'TOS_SECRET_KEY',
  'TOS_PUBLIC_BASE_URL',
] as const;

function withTosEnvironment(values: Partial<Record<(typeof tosKeys)[number], string>>, run: () => void) {
  const previous = Object.fromEntries(tosKeys.map((key) => [key, process.env[key]]));
  for (const key of tosKeys) {
    if (values[key] === undefined) delete process.env[key];
    else process.env[key] = values[key];
  }
  try {
    run();
  } finally {
    for (const key of tosKeys) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('allows TOS settings to be omitted or left blank for local development', () => {
  withTosEnvironment({}, () => assert.equal(loadEnv().TOS_BUCKET, undefined));
  withTosEnvironment(Object.fromEntries(tosKeys.map((key) => [key, ''])), () => {
    assert.equal(loadEnv().TOS_ACCESS_KEY, undefined);
  });
});

test('rejects partial TOS settings so a misconfigured deployment fails clearly', () => {
  withTosEnvironment({ TOS_REGION: 'cn-beijing' }, () => {
    assert.throws(() => loadEnv(), /TOS 配置必须完整提供/);
  });
});
