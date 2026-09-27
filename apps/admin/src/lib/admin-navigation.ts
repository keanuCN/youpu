export type AdminSection =
  | 'dashboard'
  | 'analytics'
  | 'products'
  | 'brands'
  | 'categories'
  | 'import'
  | 'moderation'
  | 'audit'
  | 'accounts';

const editorSections: AdminSection[] = ['dashboard', 'analytics', 'products', 'brands', 'categories', 'import'];
const adminSections: AdminSection[] = [...editorSections, 'moderation', 'audit', 'accounts'];

export function visibleAdminSections(role: string): AdminSection[] {
  if (role === 'admin') return [...adminSections];
  if (role === 'editor') return [...editorSections];
  return [];
}
