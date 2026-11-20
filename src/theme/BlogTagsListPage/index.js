import React from 'react';
import Link from '@docusaurus/Link';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';

export default function BlogTagsListPage({tags}) {
  return (
    <BlogLayout title="Tags" description="Browse Works in Prod by topic.">
      <SearchMetadata tag="blog_tags_list" />
      <h1 className="page-title">Tags</h1>
      <p className="intro">Browse the posts by topic.</p>
      <ul className="tag-cloud tags-page-list">
        {[...tags].sort((left, right) => left.label.localeCompare(right.label))
          .map((tag) => (
            <li key={tag.permalink}>
              <Link to={tag.permalink}>{tag.label}</Link> <span className="meta">({tag.count})</span>
            </li>
          ))}
      </ul>
    </BlogLayout>
  );
}
