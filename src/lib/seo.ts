/**
 * SEO Utilities and Meta Tag Management
 * 
 * This module provides SEO optimization utilities including
 * meta tags, Open Graph, Twitter cards, and structured data.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Meta tag configuration
 */
export interface MetaConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  robots?: string;
  author?: string;
  viewport?: string;
}

/**
 * Open Graph configuration
 */
export interface OpenGraphConfig {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'profile' | 'product';
  url?: string;
  image?: string;
  imageAlt?: string;
  siteName?: string;
  locale?: string;
}

/**
 * Twitter card configuration
 */
export interface TwitterCardConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

/**
 * Structured data for jobs (JSON-LD)
 */
export interface JobPostingSchema {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  hiringOrganization: {
    name: string;
    sameAs?: string;
  };
  jobLocation: {
    address: {
      streetAddress?: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  baseSalary?: {
    currency: string;
    value: {
      minValue: number;
      maxValue: number;
      unitText: string;
    };
  };
}

/**
 * Structured data for organization (JSON-LD)
 */
export interface OrganizationSchema {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    type: string;
    telephone?: string;
    email?: string;
    contactType: string;
  };
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_META: MetaConfig = {
  title: 'FairTradeWorker - Home Services Marketplace',
  description: 'Revolutionary home services marketplace with zero fees for contractors. AI-powered job analysis, instant quotes, and territory-based operations.',
  keywords: [
    'home services',
    'contractors',
    'home repair',
    'renovation',
    'zero fees',
    'AI quotes',
    'territory operator',
  ],
  author: 'FairTradeWorker',
  viewport: 'width=device-width, initial-scale=1.0',
};

const DEFAULT_OG: OpenGraphConfig = {
  title: 'FairTradeWorker - Death of the Middleman',
  description: 'Zero fees for contractors. AI-powered job scope generation. Territory-based operations.',
  type: 'website',
  siteName: 'FairTradeWorker',
  locale: 'en_US',
  image: 'https://fairtradeworker.com/og-image.png',
  imageAlt: 'FairTradeWorker Platform',
};

const DEFAULT_TWITTER: TwitterCardConfig = {
  card: 'summary_large_image',
  site: '@FairTradeWorker',
  creator: '@FairTradeWorker',
};

// ============================================================================
// Meta Tag Management
// ============================================================================

/**
 * Set a meta tag
 */
function setMetaTag(name: string, content: string, isProperty: boolean = false): void {
  const attrName = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attrName}="${name}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
}

/**
 * Remove a meta tag
 */
function removeMetaTag(name: string, isProperty: boolean = false): void {
  const attrName = isProperty ? 'property' : 'name';
  const element = document.querySelector(`meta[${attrName}="${name}"]`);
  if (element) {
    element.remove();
  }
}

/**
 * Set page title
 */
export function setTitle(title: string): void {
  document.title = title;
}

/**
 * Set basic meta tags
 */
export function setMeta(config: Partial<MetaConfig>): void {
  const meta = { ...DEFAULT_META, ...config };
  
  setTitle(meta.title);
  setMetaTag('description', meta.description);
  
  if (meta.keywords?.length) {
    setMetaTag('keywords', meta.keywords.join(', '));
  }
  
  if (meta.canonical) {
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = meta.canonical;
  }
  
  if (meta.robots) {
    setMetaTag('robots', meta.robots);
  }
  
  if (meta.author) {
    setMetaTag('author', meta.author);
  }
  
  if (meta.viewport) {
    setMetaTag('viewport', meta.viewport);
  }
}

/**
 * Set Open Graph tags
 */
export function setOpenGraph(config: Partial<OpenGraphConfig>): void {
  const og = { ...DEFAULT_OG, ...config };
  
  setMetaTag('og:title', og.title, true);
  setMetaTag('og:description', og.description, true);
  setMetaTag('og:type', og.type || 'website', true);
  
  if (og.url) {
    setMetaTag('og:url', og.url, true);
  }
  
  if (og.image) {
    setMetaTag('og:image', og.image, true);
    if (og.imageAlt) {
      setMetaTag('og:image:alt', og.imageAlt, true);
    }
  }
  
  if (og.siteName) {
    setMetaTag('og:site_name', og.siteName, true);
  }
  
  if (og.locale) {
    setMetaTag('og:locale', og.locale, true);
  }
}

/**
 * Set Twitter Card tags
 */
export function setTwitterCard(config: Partial<TwitterCardConfig>): void {
  const twitter = { ...DEFAULT_TWITTER, ...config };
  
  setMetaTag('twitter:card', twitter.card || 'summary_large_image');
  
  if (twitter.site) {
    setMetaTag('twitter:site', twitter.site);
  }
  
  if (twitter.creator) {
    setMetaTag('twitter:creator', twitter.creator);
  }
  
  if (twitter.title) {
    setMetaTag('twitter:title', twitter.title);
  }
  
  if (twitter.description) {
    setMetaTag('twitter:description', twitter.description);
  }
  
  if (twitter.image) {
    setMetaTag('twitter:image', twitter.image);
    if (twitter.imageAlt) {
      setMetaTag('twitter:image:alt', twitter.imageAlt);
    }
  }
}

// ============================================================================
// Structured Data (JSON-LD)
// ============================================================================

/**
 * Set JSON-LD structured data
 */
function setJsonLd(data: Record<string, unknown>, id?: string): void {
  const scriptId = id || 'json-ld-' + Math.random().toString(36).substr(2, 9);
  let script = document.getElementById(scriptId) as HTMLScriptElement;
  
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  
  script.textContent = JSON.stringify(data);
}

/**
 * Set organization structured data
 */
export function setOrganizationSchema(config?: Partial<OrganizationSchema>): void {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config?.name || 'FairTradeWorker',
    url: config?.url || 'https://fairtradeworker.com',
    logo: config?.logo || 'https://fairtradeworker.com/logo.png',
    description: config?.description || DEFAULT_META.description,
    sameAs: config?.sameAs || [
      'https://twitter.com/FairTradeWorker',
      'https://linkedin.com/company/fairtradeworker',
    ],
    contactPoint: config?.contactPoint || {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@fairtradeworker.com',
    },
  };
  
  setJsonLd(data, 'json-ld-organization');
}

/**
 * Set job posting structured data
 */
export function setJobPostingSchema(job: JobPostingSchema): void {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    validThrough: job.validThrough,
    employmentType: job.employmentType || 'CONTRACTOR',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.hiringOrganization.name,
      sameAs: job.hiringOrganization.sameAs,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...job.jobLocation.address,
      },
    },
    ...(job.baseSalary && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.baseSalary.currency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.baseSalary.value.minValue,
          maxValue: job.baseSalary.value.maxValue,
          unitText: job.baseSalary.value.unitText,
        },
      },
    }),
  };
  
  setJsonLd(data, 'json-ld-job-posting');
}

/**
 * Set breadcrumb structured data
 */
export function setBreadcrumbSchema(items: BreadcrumbItem[]): void {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  
  setJsonLd(data, 'json-ld-breadcrumb');
}

/**
 * Set FAQ structured data
 */
export function setFAQSchema(faqs: Array<{ question: string; answer: string }>): void {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  
  setJsonLd(data, 'json-ld-faq');
}

// ============================================================================
// Combined SEO Setup
// ============================================================================

/**
 * Set all SEO tags for a page
 */
export function setSEO(config: {
  meta?: Partial<MetaConfig>;
  openGraph?: Partial<OpenGraphConfig>;
  twitter?: Partial<TwitterCardConfig>;
}): void {
  if (config.meta) {
    setMeta(config.meta);
  }
  
  if (config.openGraph) {
    setOpenGraph(config.openGraph);
  }
  
  if (config.twitter) {
    setTwitterCard(config.twitter);
  }
}

/**
 * Reset SEO to defaults
 */
export function resetSEO(): void {
  setMeta(DEFAULT_META);
  setOpenGraph(DEFAULT_OG);
  setTwitterCard(DEFAULT_TWITTER);
}

// ============================================================================
// Page-specific SEO configurations
// ============================================================================

/**
 * SEO configurations for different pages
 */
export const pageSEO = {
  home: {
    meta: {
      title: 'FairTradeWorker - Zero Fee Home Services Marketplace',
      description: 'Revolutionary home services marketplace. Contractors keep 100% of earnings. AI-powered job scope generation. Territory-based operations.',
    },
    openGraph: {
      title: 'FairTradeWorker - Death of the Middleman',
      description: 'Zero fees for contractors. AI-powered quotes. Territory operations.',
    },
  },
  territories: {
    meta: {
      title: 'Claim Your Territory - FairTradeWorker',
      description: 'First 10 territories FREE. Exclusive lead rights in your area. Build your contractor network.',
    },
    openGraph: {
      title: 'Own Your Territory - FairTradeWorker',
      description: 'First 10 territories FREE. $500+ for additional territories.',
    },
  },
  jobs: {
    meta: {
      title: 'Browse Jobs - FairTradeWorker',
      description: 'Find home improvement jobs in your area. Submit bids. Keep 100% of your earnings.',
    },
  },
  contractors: {
    meta: {
      title: 'Find Contractors - FairTradeWorker',
      description: 'Browse verified contractors. Check ratings and reviews. Get competitive bids.',
    },
  },
  api: {
    meta: {
      title: 'Intelligence API - FairTradeWorker',
      description: 'Self-learning APIs for home services. AI Scope, Instant Quote, Contractor Match, Demand Heatmap.',
    },
  },
};

export default {
  setTitle,
  setMeta,
  setOpenGraph,
  setTwitterCard,
  setOrganizationSchema,
  setJobPostingSchema,
  setBreadcrumbSchema,
  setFAQSchema,
  setSEO,
  resetSEO,
  pageSEO,
};
