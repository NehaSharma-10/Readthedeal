'use client';

import Image from 'next/image';

export default function Examples() {
    const examples = [
        {
            original: 'Gym membership ',
            image: '/gym mem.webp',
            imageAlt: 'Split-screen comparison of gym membership clause and plain English translation'
        },
        {
            original: 'Apartment lease ',
            image: '/apartment-lease.webp',
            imageAlt: 'Split-screen comparison of apartment lease auto-renewal clause and plain English translation'
        }
    ];

    return (
        <section id="examples" className="py-20 bg-paper-deep border-t border-b border-paper-line">
            <div className="max-w-full mx-auto px-7">
                <div className="mb-14 max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-indigo-deep mb-6">
                        <span className="w-2 h-2 rounded-full bg-highlighter shadow-[0_0_0_3px_peach-tint]" />
                        Before / after
                    </div>
                    <h2 className="text-[clamp(32px,4vw,48px)] leading-tight font-serif font-bold text-ink">
                        Two real examples, side by side.
                    </h2>
                    <p className="text-lg text-ink-soft mt-3.5">
                        This is the entire point of the tool — judge it on this.
                    </p>
                </div>

                {/* Desktop: Side by side full width */}
                <div className="hidden md:grid grid-cols-2 gap-9 overflow-x-hidden">
                    {examples.map((ex, idx) => (
                        <div key={idx} className="bg-white border border-paper-line rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-in fade-in duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                            <div className="relative w-full bg-paper-deep" style={{ height: '360px' }}>
                                <Image
                                    src={ex.image}
                                    alt={ex.imageAlt}
                                    fill
                                    className=""
                                    sizes="50vw"
                                />
                            </div>
                            <div className="px-6 py-4">
                                <span className="font-mono text-xs text-ink-soft/60 tracking-widest uppercase">{ex.original}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile: Stacked */}
                <div className="md:hidden space-y-9 overflow-x-hidden">
                    {examples.map((ex, idx) => (
                        <div key={idx} className="bg-white border border-paper-line rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative w-full aspect-video bg-paper-deep">
                                <Image
                                    src={ex.image}
                                    alt={ex.imageAlt}
                                    fill
                                    sizes="100vw"
                                />
                            </div>
                            <div className="px-6 py-4">
                                <span className="font-mono text-xs text-ink-soft/60 tracking-widest uppercase">{ex.original}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
