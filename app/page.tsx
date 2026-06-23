'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import WhatsIt from '@/components/WhatsIt';

// Lazy load components below the fold
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), { loading: () => <div className="py-28" /> });
const Examples = dynamic(() => import('@/components/Examples'), { loading: () => <div className="py-20" /> });
const WhenToUse = dynamic(() => import('@/components/WhenToUse'), { loading: () => <div className="py-20" /> });
const WhyNotChatGPT = dynamic(() => import('@/components/WhyNotChatGPT'), { loading: () => <div className="py-20" /> });
const Playground = dynamic(() => import('@/components/Playground'), { loading: () => <div className="py-20" /> });
const Trust = dynamic(() => import('@/components/Trust'), { loading: () => <div className="py-16" /> });
const FAQ = dynamic(() => import('@/components/FAQ'), { loading: () => <div className="py-20" /> });
const FinalCTA = dynamic(() => import('@/components/FinalCTA'), { loading: () => <div className="py-20" /> });

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Read the Deal',
  applicationCategory: 'BusinessApplication',
  url: 'https://readthedeal.com',
  description: 'Free contract and message analyzer. Understand agreements, detect scams, and spot hidden fees instantly.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  operatingSystem: 'Web',
  author: {
    '@type': 'Organization',
    name: 'Read the Deal',
  },
  features: [
    'Contract analysis',
    'Scam detection',
    'Hidden fees identification',
    'Plain English explanations',
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <Story />
      <WhatsIt />
      <HowItWorks />
      <Examples />
      <WhenToUse />
      <WhyNotChatGPT />
      <Playground />
      <Trust />
      <FAQ />
      <FinalCTA />
      <footer className="py-10 px-7 text-center text-ink-soft text-sm">
        © 2026 Read the Deal — Not a substitute for legal advice.
      </footer>
    </>
  );
}
