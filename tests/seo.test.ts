/**
 * Unit Tests for SEO Utilities
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Set up document mock before importing
const headMock = {
  appendChild: vi.fn(),
  querySelector: vi.fn(),
};

const mockElement = {
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
  remove: vi.fn(),
  textContent: '',
};

vi.stubGlobal('document', {
  title: '',
  head: headMock,
  createElement: vi.fn(() => ({ ...mockElement })),
  querySelector: vi.fn(() => null),
  getElementById: vi.fn(() => null),
});

import {
  setTitle,
  setMeta,
  setOpenGraph,
  setTwitterCard,
  setOrganizationSchema,
  setJobPostingSchema,
  setBreadcrumbSchema,
  setSEO,
  resetSEO,
  pageSEO,
} from '../src/lib/seo';

describe('SEO Utilities', () => {
  beforeEach(() => {
    document.title = '';
    vi.clearAllMocks();
    headMock.querySelector.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('setTitle', () => {
    it('sets the document title', () => {
      setTitle('Test Page Title');
      expect(document.title).toBe('Test Page Title');
    });
  });

  describe('setMeta', () => {
    it('sets basic meta tags', () => {
      setMeta({
        title: 'FairTradeWorker',
        description: 'Home services marketplace',
      });
      
      // Check that document.title was set
      expect(document.title).toBe('FairTradeWorker');
    });

    it('uses default values when not provided', () => {
      setMeta({});
      
      // Default title should be set
      expect(document.title).toBe('FairTradeWorker - Home Services Marketplace');
    });
  });

  describe('setOpenGraph', () => {
    it('sets Open Graph tags', () => {
      setOpenGraph({
        title: 'Test OG Title',
        description: 'Test OG Description',
        type: 'website',
      });
      
      // Should create meta elements
      expect(document.createElement).toHaveBeenCalledWith('meta');
    });
  });

  describe('setTwitterCard', () => {
    it('sets Twitter Card tags', () => {
      setTwitterCard({
        card: 'summary_large_image',
        title: 'Test Twitter Title',
        description: 'Test Twitter Description',
      });
      
      expect(document.createElement).toHaveBeenCalledWith('meta');
    });
  });

  describe('setSEO', () => {
    it('sets all SEO tags at once', () => {
      setSEO({
        meta: { title: 'Full SEO Test', description: 'Testing all SEO' },
        openGraph: { title: 'OG Test', description: 'OG Description' },
        twitter: { card: 'summary', title: 'Twitter Test' },
      });
      
      expect(document.title).toBe('Full SEO Test');
    });
  });

  describe('pageSEO', () => {
    it('has predefined SEO for home page', () => {
      expect(pageSEO.home).toBeDefined();
      expect(pageSEO.home.meta.title).toContain('FairTradeWorker');
    });

    it('has predefined SEO for territories page', () => {
      expect(pageSEO.territories).toBeDefined();
      expect(pageSEO.territories.meta.title).toContain('Territory');
    });

    it('has predefined SEO for jobs page', () => {
      expect(pageSEO.jobs).toBeDefined();
      expect(pageSEO.jobs.meta.title).toContain('Jobs');
    });

    it('has predefined SEO for contractors page', () => {
      expect(pageSEO.contractors).toBeDefined();
      expect(pageSEO.contractors.meta.title).toContain('Contractor');
    });

    it('has predefined SEO for API page', () => {
      expect(pageSEO.api).toBeDefined();
      expect(pageSEO.api.meta.title).toContain('API');
    });
  });

  describe('JSON-LD Structured Data', () => {
    it('setOrganizationSchema creates JSON-LD script', () => {
      setOrganizationSchema({
        name: 'FairTradeWorker',
        url: 'https://fairtradeworker.com',
        logo: 'https://fairtradeworker.com/logo.png',
        description: 'Home services marketplace',
      });
      
      expect(document.createElement).toHaveBeenCalledWith('script');
    });

    it('setJobPostingSchema creates job posting JSON-LD', () => {
      setJobPostingSchema({
        title: 'Plumber Needed',
        description: 'Need a plumber for kitchen faucet',
        datePosted: '2025-01-01',
        hiringOrganization: { name: 'FairTradeWorker' },
        jobLocation: {
          address: {
            addressLocality: 'Austin',
            addressRegion: 'TX',
            postalCode: '78701',
            addressCountry: 'US',
          },
        },
      });
      
      expect(document.createElement).toHaveBeenCalledWith('script');
    });

    it('setBreadcrumbSchema creates breadcrumb JSON-LD', () => {
      setBreadcrumbSchema([
        { name: 'Home', url: 'https://fairtradeworker.com/' },
        { name: 'Jobs', url: 'https://fairtradeworker.com/jobs' },
        { name: 'Plumbing', url: 'https://fairtradeworker.com/jobs/plumbing' },
      ]);
      
      expect(document.createElement).toHaveBeenCalledWith('script');
    });
  });
});
