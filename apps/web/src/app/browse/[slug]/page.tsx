import { BrowseClient } from "./browse-client";

export default function BrowsePage({ params }: { params: { slug: string } }) {
  return <BrowseClient slug={params.slug} />;
}
