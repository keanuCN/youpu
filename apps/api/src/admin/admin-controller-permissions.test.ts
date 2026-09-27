import 'reflect-metadata';
import assert from 'node:assert/strict';
import test from 'node:test';
import { GUARDS_METADATA, METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { AdminController } from './admin.controller';
import { AdminGuard } from './admin.guard';
import { ADMIN_ROLES_METADATA } from './admin-roles.decorator';

test('moderation and audit handlers require the admin role', () => {
  const prototype = AdminController.prototype;

  assert.deepEqual(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.auditLogs), ['admin']);
  assert.deepEqual(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.reports), ['admin']);
  assert.deepEqual(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.updateReport), ['admin']);
  assert.deepEqual(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.moderationRatings), ['admin']);
  assert.deepEqual(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.updateRatingStatus), ['admin']);
  assert.deepEqual(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.accounts), ['admin']);
  assert.deepEqual(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.updateAccount), ['admin']);
});

test('catalog editing handlers remain available to editors', () => {
  const prototype = AdminController.prototype;

  assert.equal(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.dashboard), undefined);
  assert.equal(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.analytics), undefined);
  assert.equal(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.createProduct), undefined);
  assert.equal(Reflect.getMetadata(ADMIN_ROLES_METADATA, prototype.updateProduct), undefined);
});

test('product image upload is a POST route covered by the controller admin guard', () => {
  const prototype = AdminController.prototype;

  assert.equal(Reflect.getMetadata(PATH_METADATA, prototype.uploadProductImage), 'product-images');
  assert.equal(Reflect.getMetadata(METHOD_METADATA, prototype.uploadProductImage), 1);
  assert.deepEqual(Reflect.getMetadata(GUARDS_METADATA, AdminController), [AdminGuard]);
});
