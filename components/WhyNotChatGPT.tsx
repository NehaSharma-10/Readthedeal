'use client';

export default function WhyNotChatGPT() {
    return (
        <section className="py-20 bg-[#F1E9D6] border-t border-b border-[#E4DAC2]">
            <div className="max-w-6xl mx-auto px-7">
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-[#222F95] mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#FFD23F] shadow-[0_0_0_3px_#FBE7C6]" />
                    Why not just ChatGPT?
                </div>

                <div className="max-w-2xl mx-0 mt-5 border-l-[3px] border-[#FFD23F] pl-6">
                    <p className="text-base text-[#615A4C] m-0">
                        You could paste a contract into any general-purpose AI and ask for a summary. But this tool is optimized specifically for contracts — it hunts every time for the things that actually cost you: cancellation friction, auto-renewal traps, hidden fees, liability clauses, notice periods. Built for speed, too — use it in the moment you're about to sign, not as a research project later.
                    </p>
                </div>
            </div>
        </section>
    );
}
