import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

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
              Senior Software Engineer writing about the parts of software delivery
              that survive contact with production.
            </p>
          </div>
        </div>
        <h2 className="section-title">Currently</h2>
        <dl className="now-list">
          <div><dt>Building</dt><dd>TripForge</dd></div>
          <div><dt>Learning</dt><dd>Agentic systems</dd></div>
          <div><dt>Community</dt><dd><a href="https://www.meetup.com/software-crafters-manchester/">Software Crafters Manchester</a></dd></div>
          <div><dt>Reading</dt><dd>Designing Data-Intensive Applications</dd></div>
        </dl>
        <h2 className="section-title">What I write about</h2>
        <dl className="topic-list">
          <div><dt><Link to="/tags/ai-engineering/">AI engineering</Link></dt><dd>LLM systems and working with coding agents.</dd></div>
          <div><dt><Link to="/tags/architecture/">Architecture</Link></dt><dd>Boundaries, diagrams and design decisions.</dd></div>
          <div><dt><Link to="/tags/testing/">Testing</Link></dt><dd>TDD, feedback loops and architecture tests.</dd></div>
          <div><dt><Link to="/tags/observability/">Observability</Link></dt><dd>Traces, metrics and understanding system behaviour.</dd></div>
          <div><dt><Link to="/tags/developer-experience/">Developer experience</Link></dt><dd>Tools and workflows I use to develop software.</dd></div>
          <div><dt><Link to="/tags/software-delivery/">Software delivery</Link></dt><dd>Getting software running and working together to ship it.</dd></div>
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
