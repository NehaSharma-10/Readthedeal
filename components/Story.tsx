'use client';

import Image from 'next/image';

export default function Story() {
    return (
        <section className="py-20">
            <div className="max-w-6xl mx-auto px-7">
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-indigo-deep mb-6">
                    <span className="w-2 h-2 rounded-full bg-highlighter shadow-[0_0_0_3px_#FBE7C6]" />
                    The story
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-6">
                    <div className="rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(33,29,23,0.04),0_12px_28px_-14px_rgba(33,29,23,0.18)]">
                        <Image
                            src="/story-image.webp"
                            alt="A dense block of contract text"
                            width={500}
                            height={400}
                            className="w-full h-auto object-cover"
                            priority
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-[0_1px_2px_rgba(33,29,23,0.04),0_12px_28px_-14px_rgba(33,29,23,0.18)] border border-paper-line p-11 relative">
                        <p className="text-lg text-ink mb-4">
                            You signed up for a gym membership that said "cancel anytime." Turns out "anytime" means a written letter, mailed 60 days in advance, during business hours, to an address that isn't even the gym. You found out three charges later.
                        </p>

                        <p className="text-lg text-ink mb-4">
                            Or it was a lease that auto-renewed because you missed a 90-day notice window buried in paragraph 14. Or a freelance contract where "all rights" meant the client owns work you thought was yours to reuse.
                        </p>

                        <p className="text-lg text-ink">
                            None of this is because you weren't careful. These documents are written to be skimmed past — clear to a lawyer, invisible to everyone else. This exists so that next time, you know <span className="font-serif italic font-medium">before</span> you sign, not after it costs you.
                        </p>

                        <div className="absolute left-[-210px] top-[60px] w-[190px] bg-blue-tint rounded-[12px] p-4 font-mono text-[12.5px] text-indigo-deep leading-relaxed hidden lg:block">
                            <div className="absolute -right-2 top-[18px] w-3.5 h-3.5 bg-blue-tint transform rotate-45 rounded-0.5" />
                            ↙ this is the line nobody catches until it's too late
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
