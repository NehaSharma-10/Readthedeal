'use client';

import { useState } from 'react';

export default function FAQ() {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    const faqs = [
        {
            q: 'What can I analyze?',
            a: 'You can analyze contracts, leases, membership agreements, service terms, NDAs, and job offers for hidden fees, cancellation traps, and unfavorable terms. You can also check suspicious messages, emails, and texts for scam indicators and phishing attempts.'
        },
        {
            q: 'Is this legal advice?',
            a: 'No — it\'s a plain-English explanation to help you understand what you\'re agreeing to. For high-stakes contracts, use it as your first pass, then talk to a lawyer about anything important.'
        },
        {
            q: 'How fast is the analysis?',
            a: 'Most documents are analyzed in 30-60 seconds. Longer documents may take a bit more time, but you\'ll always get your results quickly without needing to wait.'
        },
        {
            q: 'Is my data safe?',
            a: 'Yes. Documents and messages are processed only to generate your explanation. They are never stored, shared, or reused. Your privacy is guaranteed.'
        },
        {
            q: 'Do I need an account?',
            a: 'No account needed. Try it free immediately — just paste your document or message and start analyzing. No signup required.'
        },
        {
            q: 'What if my contract is too long?',
            a: 'Most contracts work fine. Very long documents (50+ pages) may take longer to process. If a document won\'t work, try breaking it into sections or focusing on the most important clauses.'
        }
    ];

    return (
        <section id="faq" className="py-16 md:py-20 px-5 sm:px-7">
            <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-indigo-deep mb-6">
                    <span className="w-2 h-2 rounded-full bg-highlighter" />
                    Questions
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-8">
                    Common questions
                </h2>

                <div className="space-y-0">
                    {faqs.map((faq, idx) => (
                        <details
                            key={idx}
                            open={openIdx === idx}
                            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                            className="border-b border-paper-line py-4 md:py-5 cursor-pointer group hover:bg-paper transition-colors"
                        >
                            <summary className="flex justify-between items-start gap-4 font-semibold text-base md:text-lg list-none text-ink">
                                <span className="text-left">{faq.q}</span>
                                <span className="font-mono text-xl text-indigo flex-shrink-0 transition transform group-open:rotate-45">+</span>
                            </summary>
                            <p className="text-sm md:text-base text-ink-soft mt-3 md:mt-4 leading-relaxed">
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
