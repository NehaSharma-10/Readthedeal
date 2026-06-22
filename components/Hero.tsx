'use client';

import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative overflow-hidden py-12 md:py-20">
            {/* Background decorative elements - hidden on very small screens */}
            <div className="absolute w-[420px] h-[420px] rounded-full bg-[#E7ECFB] blur-[2px] -top-[180px] -left-[160px] z-0 hidden sm:block" />
            <div className="absolute w-[360px] h-[360px] rounded-full bg-[#FBE7C6] blur-[2px] opacity-90 -top-[120px] -right-[140px] z-0 hidden sm:block" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-7">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.35fr] gap-8 md:gap-16 items-center">
                    {/* Left Column */}
                    <div>
                        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[#222F95] mb-4 md:mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#FFD23F]" />
                            Understand before you sign
                        </div>

                        <h1 className="text-[clamp(28px,5vw,53px)] leading-tight font-serif font-bold text-[#211D17] mt-3 md:mt-4">
                            Know what you're<br />signing — <em className="italic text-[#3548C9]">before</em> it<br />costs you.
                        </h1>

                        <p className="text-base md:text-lg text-[#615A4C] max-w-sm mt-3 md:mt-4 leading-relaxed">
                            Paste any contract, lease, or membership agreement. Get the traps, deadlines, and hidden fees explained in plain English, in under 60 seconds.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-7 flex-wrap">
                            <a href="#trythese" className="bg-[#3548C9] text-white px-5 md:px-6 py-2.5 md:py-3 rounded-[11px] font-semibold text-sm hover:bg-[#222F95] transition transform hover:-translate-y-0.5 shadow-lg text-center">
                                Try it free — no signup
                            </a>
                            <a href="#examples" className="bg-transparent text-[#211D17] border border-[#E4DAC2] px-5 md:px-6 py-2.5 md:py-3 rounded-[11px] font-semibold text-sm hover:border-[#211D17] transition text-center">
                                See an example ↓
                            </a>
                        </div>

                        <p className="text-xs text-[#615A4C] font-mono mt-4 md:mt-5">your document is never stored.</p>
                    </div>

                    {/* Right Column - Hero Interface Image */}
                    <div className="rounded-xl overflow-hidden hidden sm:block">
                        <Image
                            src="/hero-1.png"
                            alt="Read the Deal contract analysis interface showing original clause and plain English translation side by side"
                            width={900}
                            height={650}
                            priority
                            loading="eager"
                            quality={85}
                            className="w-full h-auto"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
