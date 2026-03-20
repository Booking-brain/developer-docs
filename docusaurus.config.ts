import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';

const config: Config = {
  title: 'Booking Brain Developer API',
  tagline: 'Integrate property search, booking, and payment into your website',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.bookingbrain.com',
  baseUrl: '/',

  organizationName: 'Booking-brain',
  projectName: 'developer-docs',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  clientModules: [
    './src/clientModules/langUrlSync.js',
    './src/clientModules/bugReportWidget.js',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          docItemComponent: '@theme/ApiItem',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    function polyfillPlugin() {
      return {
        name: 'polyfill-node-modules',
        configureWebpack() {
          return {
            resolve: {
              fallback: {
                path: require.resolve('path-browserify'),
              },
            },
          };
        },
      };
    },
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'default',
        config: {
          bookingbrain: {
            specPath: '../openapi.yaml',
            outputDir: 'docs/api',
            sidebarOptions: {
              groupPathsBy: 'tag',
              categoryLinkSource: 'tag',
            },
          } satisfies OpenApiPlugin.Options,
        },
      },
    ],
  ],

  themes: [
    'docusaurus-theme-openapi-docs',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['en'],
        indexBlog: false,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'},
    },
    {
      tagName: 'meta',
      attributes: {name: 'theme-color', content: '#80a675'},
    },
    {
      tagName: 'script',
      attributes: {type: 'application/ld+json'},
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Booking Brain Developer API',
        url: 'https://docs.bookingbrain.com',
        description: 'REST API documentation for Booking Brain — property search, availability, pricing, booking, and payment processing.',
        publisher: {
          '@type': 'Organization',
          name: 'Booking Brain Ltd',
          url: 'https://www.bookingbrain.com',
        },
      }),
    },
  ],

  themeConfig: {
    metadata: [
      {name: 'keywords', content: 'booking API, property API, holiday rental API, REST API, developer documentation, Booking Brain'},
      {name: 'og:type', content: 'website'},
      {name: 'twitter:card', content: 'summary_large_image'},
    ],
    image: 'img/bookingbrain-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Booking Brain',
      logo: {
        alt: 'Booking Brain Logo',
        src: 'img/booking-brain-logo.png',
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/docs/api/booking-brain-developer-api',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/docs/changelog',
          label: 'Changelog',
          position: 'left',
        },
        {
          href: 'https://github.com/Booking-brain/developer-docs/issues',
          label: 'Feedback',
          position: 'right',
        },
        {
          href: 'https://github.com/Booking-brain',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Authentication',
              to: '/docs/authentication',
            },
            {
              label: 'Quick Start',
              to: '/docs/quick-start',
            },
          ],
        },
        {
          title: 'API',
          items: [
            {
              label: 'API Reference',
              to: '/docs/api/booking-brain-developer-api',
            },
            {
              label: 'Changelog',
              to: '/docs/changelog',
            },
            {
              label: 'Versioning',
              to: '/docs/versioning',
            },
          ],
        },
        {
          title: 'Booking Brain',
          items: [
            {
              label: 'Website',
              href: 'https://www.bookingbrain.com',
            },
            {
              label: 'Support',
              href: 'mailto:support@bookingbrain.co.uk',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Booking-brain',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Booking Brain Ltd. All rights reserved.`,
    },
    languageTabs: [
      {
        highlight: 'bash',
        language: 'curl',
        codeSampleLanguage: 'cURL',
        logoClass: 'curl',
        variant: 'cURL',
        variants: ['cURL'],
      },
      {
        highlight: 'javascript',
        language: 'nodejs',
        codeSampleLanguage: 'JavaScript',
        logoClass: 'nodejs',
        variant: 'Axios',
        variants: ['Axios', 'Native'],
      },
      {
        highlight: 'python',
        language: 'python',
        codeSampleLanguage: 'Python',
        logoClass: 'python',
        variant: 'Requests',
        variants: ['Requests', 'http.client'],
      },
      {
        highlight: 'php',
        language: 'php',
        codeSampleLanguage: 'PHP',
        logoClass: 'php',
        variant: 'cURL',
        variants: ['cURL', 'Guzzle'],
      },
      {
        highlight: 'ruby',
        language: 'ruby',
        codeSampleLanguage: 'Ruby',
        logoClass: 'ruby',
        variant: 'Net::HTTP',
        variants: ['Net::HTTP'],
      },
      {
        highlight: 'go',
        language: 'go',
        codeSampleLanguage: 'Go',
        logoClass: 'go',
        variant: 'Native',
        variants: ['Native'],
      },
    ],
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'php', 'python', 'ruby', 'go'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
