'use client';
import Image from "next/image";
export default function WhatsIt() {
    return (
        <section className="pt-20 bg-[#f4f2e3] border-t border-b border-[#E4DAC2] overflow-hidden">
            <div className="max-w-6xl mx-auto px-7 ">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_0.85fr] gap-12 items-start">
                    <div>
                        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[#222F95] mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#FFD23F] shadow-[0_0_0_3px_#FBE7C6]" />
                            What it is
                        </div>

                        <h2 className="text-[clamp(32px,4vw,48px)] leading-tight font-serif font-bold text-[#211D17] mt-3.5">
                            A fine-print reader for everyday life.
                        </h2>

                        <p className="text-lg text-[#615A4C] mt-4">
                            Give it any contract, agreement, or policy — a lease, a membership form, a freelance gig, a software subscription. It reads the whole thing and tells you what matters: how to cancel, what you're on the hook for, what deadlines to hit, and which clauses are unusually unfavorable. No legal degree required, no skimming twelve pages hoping you didn't miss anything.
                        </p>
                    </div>

                    <div className="flex flex-col justify-end h-full">
                        <p className="font-mono text-xs text-[#615A4C] mt-3 text-center tracking-widest">12 paragraphs → 1 sentence that matters</p>
                        <Image
                            width={400}
                            height={300}
                            className="w-full h-auto "
                            src="/whatisit.jpg"

                            alt="A dense block of grey contract text condensing down to one highlighted, readable line"
                        />

                    </div>
                </div>
            </div>
        </section>
    );
}
