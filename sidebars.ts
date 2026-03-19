import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import apiSidebar from './docs/api/sidebar';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'quick-start',
    'authentication',
    'errors',
    'booking-flow',
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/node-sdk',
        'guides/ai-integration',
      ],
    },
  ],
  apiSidebar: apiSidebar,
};

export default sidebars;
