'use client';

import { useState } from 'react';

export default function WhenToUse() {
  const [activeTab, setActiveTab] = useState<'contract' | 'message' | 'returns' | 'prescription' | 'meeting' | 'government' | 'warranty'>('contract');

  const scenarios = {
    contract: [
      'Gym or studio membership',
      'Apartment lease',
      'Freelance or contractor agreement',
      'Software subscription / free trial',
      'Job offer or NDA',
      'Literally any "I agree" button'
    ],
    message: [
      'Text or email claiming urgency',
      'Request to verify account/password',
      'Suspicious payment alerts',
      'Prize or reward notifications',
      'Links from unknown senders',
      'Impersonation of banks or services'
    ],
    returns: [
      'Before buying from a new store',
      'Checking return window timeframe',
      'Understanding restocking fees',
      'Evaluating buyer-friendliness',
      'Planning returns for defects',
      'Comparing store policies'
    ],
    prescription: [
      'After picking up medication',
      'Before changing dosage',
      'Understanding side effects',
      'Checking drug interactions',
      'Learning what "missed dose" means',
      'Knowing when to call the doctor'
    ],
    meeting: [
      'After any team meeting',
      'Extracting action items from notes',
      'Assigning owners and deadlines',
      'Clarifying decisions made',
      'Following up on commitments',
      'Tracking open questions'
    ],
    government: [
      'Tax forms or notices',
      'Government benefit applications',
      'Permit or license requirements',
      'Official deadline-driven notices',
      'Regulatory compliance documents',
      'Understanding document consequences'
    ],
    warranty: [
      'Before making a purchase',
      'Checking coverage period',
      'Understanding what voids warranty',
      'Learning claim process',
      'Evaluating manufacturer support',
      'Planning for future repairs'
    ]
  };

  const tabs = [
    { id: 'contract' as const, label: 'Contracts' },
    { id: 'message' as const, label: 'Messages' },
    { id: 'returns' as const, label: 'Returns' },
    { id: 'prescription' as const, label: 'Rx' },
    { id: 'meeting' as const, label: 'Meetings' },
    { id: 'government' as const, label: 'Gov' },
    { id: 'warranty' as const, label: 'Warranty' },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-7">
        <div className="mb-11">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[#222F95] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#FFD23F] shadow-[0_0_0_3px_#FBE7C6]" />
            When to use it
          </div>
          <h2 className="text-[clamp(26px,3vw,36px)] leading-tight font-serif font-bold text-[#211D17]">
            When it actually matters.
          </h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap transition flex-shrink-0 ${activeTab === tab.id
                ? 'bg-[#1F2D7F] text-white shadow-md'
                : 'bg-paper-deep text-ink hover:bg-white border border-paper-line opacity-60 hover:opacity-100'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex flex-wrap gap-3.5">
          {scenarios[activeTab].map((scenario, idx) => (
            <div key={idx} className="bg-white border border-[#E4DAC2] rounded-t-[10px] rounded-b-sm px-4.5 py-3.5 text-sm font-medium shadow-[0_2px_0_#E4DAC2] relative"
              style={{ paddingTop: '30px' }}>
              <div className="absolute -top-2 left-3.5 w-9 h-2 bg-white border border-[#E4DAC2] border-b-0 rounded-t-[5px]" />
              {scenario}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
