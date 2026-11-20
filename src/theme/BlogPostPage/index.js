import React, {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {BlogPostProvider, useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogLayout from '@theme/BlogLayout';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import BlogPostPageStructuredData from '@theme/BlogPostPage/StructuredData';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info';
import ContentVisibility from '@theme/ContentVisibility';
import TOCItems from '@theme/TOCItems';

function Contents({toc, frontMatter}) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(window.matchMedia('(min-width: 640px)').matches), []);

  return (
    <details className="toc" open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>Contents</summary>
      <TOCItems
        toc={toc}
        className="contents-list"
        minHeadingLevel={frontMatter.toc_min_heading_level}
        maxHeadingLevel={frontMatter.toc_max_heading_level}
      />
    </details>
  );
}

function Article({children}) {
  const {metadata, toc} = useBlogPost();
  const {title, tags, nextItem, prevItem, frontMatter} = metadata;

  return (
    <BlogLayout>
      <p className="back"><Link to="/">← All posts</Link></p>
      <ContentVisibility metadata={metadata} />
      <article>
        <header>
          <h1 className="article__title">{title}</h1>
          <BlogPostItemHeaderInfo className="meta" />
        </header>
        {!frontMatter.hide_table_of_contents && toc.length > 0 && (
          <Contents toc={toc} frontMatter={frontMatter} />
        )}
        <BlogPostItemContent className="prose">{children}</BlogPostItemContent>
        <footer className="article-end">
          {tags.length > 0 && (
            <p>Filed under: {tags.map((tag, index) => (
              <React.Fragment key={tag.permalink}>
                {index > 0 && ', '}
                <Link to={tag.permalink}>{tag.label}</Link>
              </React.Fragment>
            ))}</p>
          )}
          <nav className="article-neighbours" aria-label="Adjacent posts">
            {prevItem && <div className="article-end__older"><span className="label">Newer post</span><Link to={prevItem.permalink}>{prevItem.title}</Link></div>}
            {nextItem && <div className="article-end__older"><span className="label">Older post</span><Link to={nextItem.permalink}>{nextItem.title}</Link></div>}
          </nav>
          <p><Link to="/">← All posts</Link></p>
        </footer>
      </article>
    </BlogLayout>
  );
}

export default function BlogPostPage({content: Content}) {
  return (
    <BlogPostProvider content={Content} isBlogPostPage>
      <HtmlClassNameProvider className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogPostPage}`}>
        <BlogPostPageMetadata />
        <BlogPostPageStructuredData />
        <Article><Content /></Article>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}
