import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FairTradeWorker - AI APIs That Learn | $97/mo',
  description: 'Self-learning Intelligence APIs for home services. 50+ endpoints for job analysis, pricing, contractor matching, and market intelligence. Built for fair trade.',
  keywords: 'AI API, home services, contractor API, job analysis, pricing API, machine learning, fair trade',
  authors: [{ name: 'FairTradeWorker' }],
  openGraph: {
    title: 'FairTradeWorker - AI APIs That Learn',
    description: 'Self-learning Intelligence APIs for home services. $97/mo for 50+ endpoints.',
    url: 'https://fairtradeworker.com',
    siteName: 'FairTradeWorker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FairTradeWorker - AI APIs That Learn',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FairTradeWorker - AI APIs That Learn',
    description: 'Self-learning Intelligence APIs for home services. $97/mo for 50+ endpoints.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
