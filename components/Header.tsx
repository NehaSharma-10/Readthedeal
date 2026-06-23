'use client';

import { useState } from 'react';

type AnalysisMode = 'contract' | 'message' | 'returns' | 'prescription' | 'meeting' | 'government' | 'warranty';

const TOOLS = [
    { id: 'contract' as const, label: 'Contracts' },
    { id: 'message' as const, label: 'Messages' },
    { id: 'returns' as const, label: 'Returns' },
    { id: 'prescription' as const, label: 'Prescriptions' },
    { id: 'meeting' as const, label: 'Meetings' },
    { id: 'government' as const, label: 'Gov Forms' },
    { id: 'warranty' as const, label: 'Warranty' },
];

import Image from 'next/image';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

    const selectTool = (modeId: AnalysisMode) => {
        window.dispatchEvent(new CustomEvent('selectAnalysisMode', { detail: modeId }));
        const element = document.getElementById('trythese');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
        setToolsDropdownOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-[rgba(250,246,236,0.82)] backdrop-blur-[10px] border-b border-[#E4DAC2]">
            <div className="flex items-center justify-between px-7  max-w-6xl mx-auto">
                {/* Logo */}
                <div>
                    <Image
                        src="/header-logo.png"
                        alt="Read the Deal"
                        height={60}
                        width={140}
                        priority
                       className='w-full'
                    />
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8 text-sm font-medium text-[#615A4C] items-center">
                    {/* Tools Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 hover:text-[#211D17] transition">
                            Tools
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute left-0 mt-0 w-48 bg-white border border-[#E4DAC2] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                            {TOOLS.map((tool) => (
                                <button
                                    key={tool.id}
                                    onClick={() => selectTool(tool.id)}
                                    className="w-full text-left px-4 py-2.5 hover:bg-[#F5F2ED] text-[#211D17] transition"
                                >
                                    {tool.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <a href="#how" className="hover:text-[#211D17] transition">How it works</a>
                    <a href="#examples" className="hover:text-[#211D17] transition">Examples</a>
                    <a href="#faq" className="hover:text-[#211D17] transition">FAQ</a>
                </nav>

                {/* Desktop CTA */}
                <a href="#trythese" className="hidden md:block bg-[#3548C9] text-white! px-6 py-3 rounded-[11px] font-semibold text-sm hover:bg-[#222F95] transition transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
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
                        {/* Mobile Tools Dropdown */}
                        <div>
                            <button
                                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                                className="w-full text-left px-4 py-2.5 hover:bg-[#F5F2ED] rounded-lg font-medium text-[#211D17] flex items-center justify-between transition"
                            >
                                <span>Tools</span>
                                <svg className={`w-4 h-4 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </button>

                            {/* Mobile Tools Submenu */}
                            {toolsDropdownOpen && (
                                <div className="mt-2 ml-4 space-y-1 border-l-2 border-[#E4DAC2] pl-4">
                                    {TOOLS.map((tool) => (
                                        <button
                                            key={tool.id}
                                            onClick={() => selectTool(tool.id)}
                                            className="w-full text-left px-3 py-2 hover:bg-[#F5F2ED] rounded text-[#211D17] text-sm transition"
                                        >
                                            {tool.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <a href="#how" className="block px-4 py-2.5 hover:bg-[#F5F2ED] rounded-lg text-[#211D17] transition">How it works</a>
                        <a href="#examples" className="block px-4 py-2.5 hover:bg-[#F5F2ED] rounded-lg text-[#211D17] transition">Examples</a>
                        <a href="#faq" className="block px-4 py-2.5 hover:bg-[#F5F2ED] rounded-lg text-[#211D17] transition">FAQ</a>

                        {/* Mobile CTA */}
                        <a href="#trythese" className="block bg-[#3548C9] text-white! px-6 py-3 rounded-[11px] font-semibold text-sm hover:bg-[#222F95] transition transform hover:-translate-y-0.5 shadow-lg text-center mt-4">
                            Try it free
                        </a>
                    </div>
                </div>
            )}
        </header>
    );
}
