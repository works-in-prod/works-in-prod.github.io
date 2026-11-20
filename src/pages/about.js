import React from 'react';
import Layout from '@theme/Layout';

export default function About() {
  return (
    <Layout title="About Danish Javed" description="About Danish Javed, software engineer and author of Works in Prod.">
      <main id="main">
        <div className="about-head">
          <img
            className="avatar"
            src="/img/danish-javed.jpg"
            alt=""
            width="96"
            height="96"
          />
          <div>
            <h1 className="page-title">Danish Javed</h1>
            <p className="about-lede">
              I’m Danish, a software engineer. I write about software design,
              testing, developer tools and getting things into production.
            </p>
          </div>
        </div>
        <h2 className="section-title">Currently</h2>
        <dl className="now-list">
          <div>
            <dt>Learning</dt>
            <dd>Piano at <a href="https://www.forsyths.co.uk/content/12-music-lessons">Forsyth</a>, Manchester</dd>
          </div>
          <div>
            <dt>Made</dt>
            <dd><a href="https://ambersariya.github.io/read-note-studio/">Note Studio</a>, my piano sight-reading app</dd>
          </div>
          <div><dt>Community</dt><dd><a href="https://www.meetup.com/software-crafters-manchester/">Software Crafters Manchester</a></dd></div>
          <div><dt>Reading</dt><dd>Jack Reacher books by Lee Child</dd></div>
        </dl>
        <h2 className="section-title">Elsewhere</h2>
        <ul className="link-row">
          <li><a href="https://github.com/ambersariya">GitHub</a></li>
          <li><a href="https://www.linkedin.com/in/danish-javed/">LinkedIn</a></li>
          <li><a href="/rss.xml">RSS feed</a></li>
        </ul>
      </main>
    </Layout>
  );
}
