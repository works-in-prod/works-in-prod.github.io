import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {PageMetadata, HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import PostList from '@site/src/components/PostList';

export default function BlogListPage(props) {
  const {siteConfig} = useDocusaurusContext();
  const {metadata, items} = props;
  const firstPage = !metadata.previousPage;

  return (
    <HtmlClassNameProvider className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogListPage}`}>
      <PageMetadata title={siteConfig.title} description="Notes from Danish Javed on software, AI engineering and developer tools." />
      <SearchMetadata tag="blog_posts_list" />
      <BlogListPageStructuredData {...props} />
      <BlogLayout>
        {firstPage && <p className="intro">Notes from Danish Javed on AI engineering, architecture, testing, observability and developer tools.</p>}
        <h1 className="label post-list-heading">{firstPage ? 'Latest posts' : 'Older posts'}</h1>
        <PostList items={items} />
        <BlogListPaginator metadata={metadata} />
        <p className="small-note">Find every post in the <Link to="/archive/">archive</Link>, or <Link to="/tags/">browse by tag</Link>.</p>
      </BlogLayout>
    </HtmlClassNameProvider>
  );
}
