import React from 'react';
import Layout from '@theme/Layout';

export default function BlogLayout({children, sidebar, toc, ...layoutProps}) {
  return (
    <Layout {...layoutProps}>
      <main id="main">{children}</main>
    </Layout>
  );
}
