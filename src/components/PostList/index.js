import React from 'react';
import Link from '@docusaurus/Link';

export default function PostList({items}) {
  return (
    <ol className="post-list">
      {items.map(({content: {metadata: post}}) => {
        const tag = post.tags[0];
        const date = post.date.slice(0, 10);

        return (
          <li className="post-item" key={post.permalink}>
            <div className="post-item__meta">
              <time dateTime={post.date}>{date}</time>
              {tag && (
                <Link className="post-item__tag" to={tag.permalink}>
                  #{tag.label}
                </Link>
              )}
            </div>
            <div>
              <h2 className="post-item__title">
                <Link to={post.permalink}>{post.title}</Link>
              </h2>
              {post.description && <p className="post-item__excerpt">{post.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
