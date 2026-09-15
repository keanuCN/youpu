import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchClient } from './search-client';

export const metadata: Metadata = {
  title: '搜索装备',
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchClient />
    </Suspense>
  );
}
