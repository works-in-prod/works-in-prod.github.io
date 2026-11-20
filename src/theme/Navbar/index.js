import React from 'react';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';

const NAVIGATION = [
  {to: '/', label: 'Home'},
  {to: '/archive/', label: 'Archive'},
  {to: '/about/', label: 'About'},
];

export default function Navbar() {
  const {pathname} = useLocation();

  return (
    <header className="masthead navbar">
      <Link className="brand" to="/">
        <span className="brand__mark" aria-hidden="true" />
        Works in Prod
      </Link>
      <nav className="nav" aria-label="Main">
        <ul>
          {NAVIGATION.map(({to, label}) => (
            <li key={to}>
              <Link to={to} aria-current={pathname === to ? 'page' : undefined}>
                {label}
              </Link>
            </li>
          ))}
          <li><a href="/rss.xml">RSS</a></li>
        </ul>
      </nav>
    </header>
  );
}
