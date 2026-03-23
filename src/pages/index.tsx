import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import {
  Search,
  CalendarCheck,
  ShieldCheck,
  CreditCard,
  Zap,
  BookOpen,
  Check,
  ArrowRight,
} from 'lucide-react';

/* ============================================================
   HERO SECTION
   ============================================================ */
function HomepageHeader() {
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroInner}>
        <div className={styles.heroLabel}>
          <span className={styles.heroLabelDot} />
          REST API v2 — Now Available
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
          <Link className={clsx('button button--lg', styles.heroPrimary)} to="/quick-start">
            Get Started
          </Link>
          <Link className={clsx('button button--lg', styles.heroSecondary)} to="/api/booking-brain-developer-api">
            API Reference <ArrowRight size={16} strokeWidth={2} />
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
    icon: <Search size={28} strokeWidth={2} color="#015A9C" />,
    iconClass: styles.featureIconBlue,
    title: 'Property Search',
    description:
      'Search and filter holiday properties by location, dates, guest capacity, amenities, and more. Powerful query parameters for precise results.',
  },
  {
    icon: <CalendarCheck size={28} strokeWidth={2} color="#00a67d" />,
    iconClass: styles.featureIconGreen,
    title: 'Real-Time Availability',
    description:
      'Check live availability and pricing across your entire property portfolio. Always up to date, always accurate.',
  },
  {
    icon: <ShieldCheck size={28} strokeWidth={2} color="#7b61ff" />,
    iconClass: styles.featureIconPurple,
    title: 'Authentication & Security',
    description:
      'API key authentication with rate limiting. All endpoints served over HTTPS with comprehensive error handling.',
  },
  {
    icon: <CreditCard size={28} strokeWidth={2} color="#e8912d" />,
    iconClass: styles.featureIconOrange,
    title: 'Secure Payments',
    description:
      'Process payments securely through our PCI-compliant integration. Handle deposits, balances, and refunds with ease.',
  },
  {
    icon: <Zap size={28} strokeWidth={2} color="#015A9C" />,
    iconClass: styles.featureIconBlue,
    title: 'Fast & Reliable',
    description:
      'Built for performance with low-latency responses, automatic retries, and 99.9% uptime SLA for production workloads.',
  },
  {
    icon: <BookOpen size={28} strokeWidth={2} color="#00a67d" />,
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
                <span className={styles.checkIcon}><Check size={12} strokeWidth={3} color="#00a67d" /></span>
                RESTful endpoints with consistent response format
              </li>
              <li>
                <span className={styles.checkIcon}><Check size={12} strokeWidth={3} color="#00a67d" /></span>
                JSON request and response bodies throughout
              </li>
              <li>
                <span className={styles.checkIcon}><Check size={12} strokeWidth={3} color="#00a67d" /></span>
                Comprehensive error codes and messages
              </li>
              <li>
                <span className={styles.checkIcon}><Check size={12} strokeWidth={3} color="#00a67d" /></span>
                Interactive API explorer with try-it-now
              </li>
            </ul>
            <Link
              className={clsx('button button--lg', styles.ctaPrimary)}
              to="/quick-start">
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
                <span className={styles.codeUrl}>{'\"https://app.bookingbrain.com/api/v2/developer/search?place=porlock&guests=4&pets=yes\"'}</span>
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
            to="/quick-start">
            Quick Start Guide
          </Link>
          <Link
            className={clsx('button button--lg', styles.ctaSecondary)}
            to="/authentication">
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
      title="Developer API Documentation"
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
