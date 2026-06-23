'use client';

export default function FinalCTA() {
    return (
        <section className="py-12 md:py-20 px-5 sm:px-7">
            <div className="max-w-6xl mx-auto">
                <div className="bg-gradient-to-b from-[#020000] to-[#000000] text-[#FAF6EC] rounded-[28px] px-6 sm:px-10 md:px-12.5 py-12 md:py-16 text-center shadow-xl">
                    <h2 className="text-[clamp(28px,5vw,48px)] leading-tight font-serif font-bold text-[#FAF6EC] mb-4">
                        Stop guessing what it means.<br />
                        <span className="relative inline-block px-0.5 py-0">Just paste it.<span className="absolute inset-x-0 bottom-1/4 h-3 bg-[#FFD23F] -z-10 rounded-sm opacity-92" /></span>
                    </h2>

                    <p className="text-base md:text-lg text-[#C9C4B6] mt-3 md:mt-3.5">
                        Free to try. No signup. Your document is never stored.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4.5 mt-6 md:mt-7">
                        <a href="#trythese" className="bg-[#3548C9] text-white px-6 md:px-8 py-2.5 md:py-3 rounded-[11px] font-semibold text-sm hover:bg-[#222F95] transition transform hover:-translate-y-0.5 shadow-lg">
                            Try it free now
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
