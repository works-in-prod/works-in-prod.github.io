import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

const shortDate = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit', month: 'short', timeZone: 'UTC',
});

export default function BlogArchivePage({archive}) {
  const posts = archive.blogPosts.map((post) => post.metadata)
    .sort((left, right) => right.date.localeCompare(left.date));
  const years = new Map();
  const tags = new Map();

  for (const post of posts) {
    const year = post.date.slice(0, 4);
    if (!years.has(year)) years.set(year, []);
    years.get(year).push(post);
    for (const tag of post.tags) tags.set(tag.permalink, tag);
  }

  return (
    <Layout title="Archive" description="All posts from Works in Prod, grouped by year.">
      <main id="main">
        <h1 className="page-title">Archive</h1>
        <nav className="archive-years" aria-label="Archive years">
          <span>{posts.length} posts. Jump to:</span>
          {[...years.keys()].map((year) => <a key={year} href={`#a-${year}`}>{year}</a>)}
        </nav>
        {[...years].map(([year, yearPosts]) => (
          <section key={year} aria-labelledby={`a-${year}`}>
            <h2 className="year-heading" id={`a-${year}`}>
              {year}<span>{yearPosts.length} {yearPosts.length === 1 ? 'post' : 'posts'}</span>
            </h2>
            <ul className="archive-list">
              {yearPosts.map((post) => (
                <li className="archive-item" key={post.permalink}>
                  <time dateTime={post.date}>{shortDate.format(new Date(post.date))}</time>
                  <Link to={post.permalink}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <h2 className="section-title">Tags</h2>
        <ul className="tag-cloud">
          {[...tags.values()].sort((left, right) => left.label.localeCompare(right.label))
            .map((tag) => <li key={tag.permalink}><Link to={tag.permalink}>{tag.label}</Link></li>)}
        </ul>
      </main>
    </Layout>
  );
}
