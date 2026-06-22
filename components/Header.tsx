'use client';

import { useState } from 'react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-[rgba(250,246,236,0.82)] backdrop-blur-[10px] border-b border-[#E4DAC2]">
            <div className="flex items-center justify-between px-7 py-4 max-w-6xl mx-auto">
                <div className="font-serif text-3xl font-bold flex items-baseline gap-1">
                    Read<span className="relative inline-block">
                        the Deal
                        <span className="absolute -inset-0.75 bg-[#FFD23F] mix-blend-multiply rounded-sm -z-10"
                            style={{ bottom: '-30%', top: '55%' }} />
                    </span>
                </div>

                <nav className="hidden md:flex gap-8 text-sm font-medium text-[#615A4C]">
                    <a href="#how" className="hover:text-[#211D17] transition">How it works</a>
                    <a href="#examples" className="hover:text-[#211D17] transition">Examples</a>
                    <a href="#trythese" className="hover:text-[#211D17] transition">Try it</a>
                    <a href="#faq" className="hover:text-[#211D17] transition">FAQ</a>
                </nav>

                <a href="#trythese" className="bg-[#3548C9] text-white! px-6 py-3 rounded-[11px] font-semibold text-sm hover:bg-[#222F95] transition transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                    Try it free
                </a>
            </div>
        </header>
    );
}
