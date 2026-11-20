import React from 'react';
import Link from '@docusaurus/Link';

export default function BlogListPaginator({metadata}) {
  return (
    <nav className="list-pagination" aria-label="Post list pages">
      {metadata.previousPage && <Link to={metadata.previousPage}>← Newer posts</Link>}
      {metadata.nextPage && <Link to={metadata.nextPage}>Older posts →</Link>}
    </nav>
  );
}
