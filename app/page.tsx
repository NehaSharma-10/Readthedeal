'use client';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import WhatsIt from '@/components/WhatsIt';
import HowItWorks from '@/components/HowItWorks';
import Examples from '@/components/Examples';
import WhenToUse from '@/components/WhenToUse';
import WhyNotChatGPT from '@/components/WhyNotChatGPT';
import Playground from '@/components/Playground';
import Trust from '@/components/Trust';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';

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
