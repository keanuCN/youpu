import assert from 'node:assert/strict';
import test from 'node:test';
import { visibleAdminSections } from './admin-navigation';

test('editors only see the dashboard, analytics, and catalog maintenance sections', () => {
  assert.deepEqual(visibleAdminSections('editor'), [
    'dashboard',
    'analytics',
    'products',
    'brands',
    'categories',
    'import',
  ]);
});

test('administrators see all administration sections including account management', () => {
  assert.deepEqual(visibleAdminSections('admin'), [
    'dashboard',
    'analytics',
    'products',
    'brands',
    'categories',
    'import',
    'moderation',
    'audit',
    'accounts',
  ]);
});

test('unknown roles see no administration sections', () => {
  assert.deepEqual(visibleAdminSections('user'), []);
});
