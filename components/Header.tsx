'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-[rgba(250,246,236,0.82)] backdrop-blur-[10px] border-b border-[#E4DAC2]">
            <div className="flex items-center justify-between px-7 py-1 max-w-7xl mx-auto">
                {/* Logo */}
                <div>
                    <Image
                        src="/header-logo.png"
                        alt="Read the Deal"
                        height={75}
                        width={175}
                        priority
                        style={{ width: 'auto', height: '75px' }}
                    />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-10 items-center justify-center flex-1">
                    <a href="#how" className="text-[#211D17] font-medium text-sm hover:text-[#1F2D7F] transition">How it works</a>
                    <a href="#examples" className="text-[#211D17] font-medium text-sm hover:text-[#1F2D7F] transition">Examples</a>
                    <a href="#faq" className="text-[#211D17] font-medium text-sm hover:text-[#1F2D7F] transition">FAQ</a>
                </nav>

                {/* Desktop CTA */}
                <a href="#trythese" className="hidden md:block bg-[#1F2D7F] text-white! px-7 py-2.5 rounded-[11px] font-medium text-sm hover:bg-[#152047] transition transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl whitespace-nowrap">
                    Try it free
                </a>

                {/* Mobile Hamburger Menu */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-[#F5F2ED] rounded-lg transition"
                >
                    <svg className="w-6 h-6 text-[#615A4C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-[#E4DAC2] bg-white">
                    <div className="px-7 py-4 space-y-3">
                        <a href="#how" className="block px-4 py-2.5 hover:bg-[#F5F2ED] rounded-lg text-[#211D17] transition">How it works</a>
                        <a href="#examples" className="block px-4 py-2.5 hover:bg-[#F5F2ED] rounded-lg text-[#211D17] transition">Examples</a>
                        <a href="#faq" className="block px-4 py-2.5 hover:bg-[#F5F2ED] rounded-lg text-[#211D17] transition">FAQ</a>

                        {/* Mobile CTA */}
                        <a href="#trythese" className="block bg-[#1F2D7F] text-white! px-6 py-3 rounded-[11px] font-semibold text-sm hover:bg-[#152047] transition transform hover:-translate-y-0.5 shadow-lg text-center mt-4">
                            Try it free
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
