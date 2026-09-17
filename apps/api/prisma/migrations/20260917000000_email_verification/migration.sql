-- 邮箱验证码注册 / 重置密码后记录邮箱已验证时间
ALTER TABLE account ADD COLUMN email_verified_at timestamptz;
