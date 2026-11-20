import React from 'react';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import PaletteSelect from '@site/src/components/PaletteSelect';

export default function Footer() {
  const {setColorMode} = useColorMode();
  const {footer} = useThemeConfig();

  return (
    <footer className="site-footer">
      <span>{footer.copyright}</span>
      <ul>
        <li><a href="https://github.com/ambersariya">GitHub</a></li>
        <li><a href="https://www.linkedin.com/in/danish-javed/">LinkedIn</a></li>
        <li><a href="/rss.xml">RSS</a></li>
      </ul>
      <PaletteSelect onChange={setColorMode} />
    </footer>
  );
}
