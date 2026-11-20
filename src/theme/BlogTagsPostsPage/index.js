import React from 'react';
import Link from '@docusaurus/Link';
import {PageMetadata} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import PostList from '@site/src/components/PostList';
import Unlisted from '@theme/ContentVisibility/Unlisted';

export default function BlogTagsPostsPage({tag, items, listMetadata}) {
  return (
    <BlogLayout>
      <PageMetadata title={`Posts tagged ${tag.label}`} description={tag.description} />
      <SearchMetadata tag="blog_tags_posts" />
      {tag.unlisted && <Unlisted />}
      <p className="back"><Link to="/tags/">← All tags</Link></p>
      <h1 className="page-title">#{tag.label}</h1>
      {tag.description && <p className="intro">{tag.description}</p>}
      <PostList items={items} />
      <BlogListPaginator metadata={listMetadata} />
    </BlogLayout>
  );
}
