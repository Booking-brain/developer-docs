import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

/* ============================================================
   SVG ICONS (inline, no emoji, no external dependencies)
   ============================================================ */

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00a67d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#7b61ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#e8912d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00a67d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#00a67d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ============================================================
   HERO SECTION
   ============================================================ */
function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroInner}>
        <div className={styles.heroLabel}>
          <span className={styles.heroLabelDot} />
          REST API v1 — Now Available
        </div>
        <Heading as="h1" className={styles.heroTitle}>
          Build with the{' '}
          <span className={styles.heroTitleAccent}>Booking Brain API</span>
        </Heading>
        <p className={styles.heroSubtitle}>
          Integrate property search, real-time availability, and secure booking
          into your website with a clean, well-documented REST API.
        </p>
        <div className={styles.heroButtons}>
          <Link className={clsx('button button--lg', styles.heroPrimary)} to="/docs/quick-start">
            Get Started
          </Link>
          <Link className={clsx('button button--lg', styles.heroSecondary)} to="/docs/api/booking-brain-developer-api">
            API Reference <IconArrowRight />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   FEATURE CARDS
   ============================================================ */
interface FeatureItem {
  icon: ReactNode;
  iconClass: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: <IconSearch />,
    iconClass: styles.featureIconBlue,
    title: 'Property Search',
    description:
      'Search and filter holiday properties by location, dates, guest capacity, amenities, and more. Powerful query parameters for precise results.',
  },
  {
    icon: <IconCalendar />,
    iconClass: styles.featureIconGreen,
    title: 'Real-Time Availability',
    description:
      'Check live availability and pricing across your entire property portfolio. Always up to date, always accurate.',
  },
  {
    icon: <IconShield />,
    iconClass: styles.featureIconPurple,
    title: 'Authentication & Security',
    description:
      'API key authentication with rate limiting. All endpoints served over HTTPS with comprehensive error handling.',
  },
  {
    icon: <IconCreditCard />,
    iconClass: styles.featureIconOrange,
    title: 'Secure Payments',
    description:
      'Process payments securely through our PCI-compliant integration. Handle deposits, balances, and refunds with ease.',
  },
  {
    icon: <IconZap />,
    iconClass: styles.featureIconBlue,
    title: 'Fast & Reliable',
    description:
      'Built for performance with low-latency responses, automatic retries, and 99.9% uptime SLA for production workloads.',
  },
  {
    icon: <IconBook />,
    iconClass: styles.featureIconGreen,
    title: 'Comprehensive Docs',
    description:
      'Interactive API reference with request/response examples, code samples in multiple languages, and detailed guides.',
  },
];

function FeatureCard({icon, iconClass, title, description}: FeatureItem) {
  return (
    <div className={styles.featureCard}>
      <div className={clsx(styles.featureIcon, iconClass)}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="text--center">
          <div className={styles.sectionLabel}>Capabilities</div>
          <Heading as="h2" className={styles.sectionTitle}>
            Everything you need to integrate
          </Heading>
          <p className={styles.sectionSubtitle}>
            A complete API for property management, from search to checkout.
            Built for developers who demand reliability.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CODE PREVIEW SECTION
   ============================================================ */
function CodePreviewSection() {
  return (
    <section className={styles.codePreview}>
      <div className="container">
        <div className={styles.codePreviewInner}>
          <div className={styles.codePreviewText}>
            <div className={styles.sectionLabel}>Quick Integration</div>
            <h2>Up and running in minutes</h2>
            <p>
              A single API call to search available properties. Clean JSON
              responses, predictable pagination, and detailed error messages.
            </p>
            <ul className={styles.codePreviewList}>
              <li>
                <span className={styles.checkIcon}><IconCheck /></span>
                RESTful endpoints with consistent response format
              </li>
              <li>
                <span className={styles.checkIcon}><IconCheck /></span>
                JSON request and response bodies throughout
              </li>
              <li>
                <span className={styles.checkIcon}><IconCheck /></span>
                Comprehensive error codes and messages
              </li>
              <li>
                <span className={styles.checkIcon}><IconCheck /></span>
                Interactive API explorer with try-it-now
              </li>
            </ul>
            <Link
              className={clsx('button button--lg', styles.ctaPrimary)}
              to="/docs/quick-start">
              Read the Quick Start Guide
            </Link>
          </div>
          <div className={styles.codeBlock}>
            <div className={styles.codeBlockHeader}>
              <span className={clsx(styles.codeBlockDot, styles.codeBlockDotRed)} />
              <span className={clsx(styles.codeBlockDot, styles.codeBlockDotYellow)} />
              <span className={clsx(styles.codeBlockDot, styles.codeBlockDotGreen)} />
              <span className={styles.codeBlockTitle}>search-properties.sh</span>
            </div>
            <pre className={styles.codeBlockBody}>
              <code>
                <span className={styles.codeComment}>{'# Search pet-friendly properties in Porlock\n'}</span>
                <span className={styles.codeFunction}>{'curl'}</span>
                {' '}
                <span className={styles.codeUrl}>{'\"https://app.bookingbrain.com/api/v1/developer/search?place=porlock&guests=4&pets=yes\"'}</span>
                {' \\\n'}
                {'  -H '}
                <span className={styles.codeString}>{'"X-API-Key: bb_sandbox_test_key..."'}</span>
                {'\n\n'}
                <span className={styles.codeComment}>{'# Response\n'}</span>
                <span className={styles.codePunctuation}>{'{\n'}</span>
                {'  '}
                <span className={styles.codeProperty}>{'"properties"'}</span>
                <span className={styles.codePunctuation}>{': ['}</span>
                {'\n'}
                {'    '}
                <span className={styles.codePunctuation}>{'{'}</span>
                {'\n'}
                {'      '}
                <span className={styles.codeProperty}>{'"id"'}</span>
                <span className={styles.codePunctuation}>{': '}</span>
                <span className={styles.codeNumber}>{'312'}</span>
                <span className={styles.codePunctuation}>{','}</span>
                {'\n'}
                {'      '}
                <span className={styles.codeProperty}>{'"title"'}</span>
                <span className={styles.codePunctuation}>{': '}</span>
                <span className={styles.codeString}>{'"Meadow Cottage"'}</span>
                <span className={styles.codePunctuation}>{','}</span>
                {'\n'}
                {'      '}
                <span className={styles.codeProperty}>{'"min_price"'}</span>
                <span className={styles.codePunctuation}>{': '}</span>
                <span className={styles.codeNumber}>{'595.00'}</span>
                <span className={styles.codePunctuation}>{','}</span>
                {'\n'}
                {'      '}
                <span className={styles.codeProperty}>{'"is_pets"'}</span>
                <span className={styles.codePunctuation}>{': '}</span>
                <span className={styles.codeKeyword}>{'true'}</span>
                {'\n'}
                {'    '}
                <span className={styles.codePunctuation}>{'}'}</span>
                {'\n'}
                {'  '}
                <span className={styles.codePunctuation}>{'],'}</span>
                {'\n'}
                {'  '}
                <span className={styles.codeProperty}>{'"total_property_on_search"'}</span>
                <span className={styles.codePunctuation}>{': '}</span>
                <span className={styles.codeNumber}>{'22'}</span>
                {'\n'}
                <span className={styles.codePunctuation}>{'}'}</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA SECTION
   ============================================================ */
function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className="container">
        <Heading as="h2" className={styles.ctaTitle}>
          Ready to start building?
        </Heading>
        <p className={styles.ctaSubtitle}>
          Get your API key and make your first request in under five minutes.
        </p>
        <div className={styles.ctaButtons}>
          <Link
            className={clsx('button button--lg', styles.ctaPrimary)}
            to="/docs/quick-start">
            Quick Start Guide
          </Link>
          <Link
            className={clsx('button button--lg', styles.ctaSecondary)}
            to="/docs/authentication">
            Authentication Docs
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE EXPORT
   ============================================================ */
export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Booking Brain Developer API - Integrate property search, booking, and payment into your website">
      <HomepageHeader />
      <main>
        <FeaturesSection />
        <CodePreviewSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
