'use client';

export default function Trust() {
    const items = [
        'Your document is processed and discarded — never stored or used for anything else.',
        'Plain-English explanation, not legal advice — for high-stakes documents, use it as your first pass, then ask a real lawyer.',
        'No account needed to try it once. See if it\'s useful before you sign up for anything else.'
    ];

    return (
        <section className="py-20 bg-[#F1E9D6] border-t border-b border-[#E4DAC2]">
            <div className="max-w-6xl mx-auto px-7">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-4 p-6 bg-white rounded-lg border border-[#E4DAC2] hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2E9E6D] flex-shrink-0">
                                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-white">
                                    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M6 10l2.5 2.5L14 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className="m-0 text-base text-[#615A4C] leading-relaxed font-medium">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
