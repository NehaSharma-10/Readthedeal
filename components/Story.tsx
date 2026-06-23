'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const floatingItems = [
    {
        text: "Cancel anytime?\nActually 60 days notice",
        positionDesktop: "top-4 left-65",
        positionTablet: "top-2 left-32",
        positionMobile: "top-2 left-8",
        sizeDesktop: "w-40",
        sizeTablet: "w-36",
        sizeMobile: "w-28"
    },
    {
        text: "Is this email real?",
        positionDesktop: "top-8 right-30",
        positionTablet: "top-2 -right-12",
        positionMobile: "top-0 -right-12",
        sizeDesktop: "w-32",
        sizeTablet: "w-32",
        sizeMobile: "w-24"
    },
    {
        text: "What's actually covered?",
        positionDesktop: "top-1/3 left-0",
        positionTablet: "top-1/4 left-2",
        positionMobile: "top-1/4 left-0",
        sizeDesktop: "w-36",
        sizeTablet: "w-32",
        sizeMobile: "w-28"
    },
    {
        text: "Medical jargon everywhere",
        positionDesktop: "top-1/2 right-0",
        positionTablet: "top-1/2 -right-8",
        positionMobile: "top-1/3 -right-12",
        sizeDesktop: "w-40",
        sizeTablet: "w-36",
        sizeMobile: "w-28"
    },
    {
        text: "Who's doing what?",
        positionDesktop: "bottom-1/3 left-0",
        positionTablet: "bottom-1/4 left-2",
        positionMobile: "bottom-1/4 left-0",
        sizeDesktop: "w-32",
        sizeTablet: "w-32",
        sizeMobile: "w-24"
    },
    {
        text: "What's the deadline?",
        positionDesktop: "bottom-16 right-30",
        positionTablet: "bottom-1/4 -right-12",
        positionMobile: "bottom-1/4 -right-12",
        sizeDesktop: "w-36",
        sizeTablet: "w-32",
        sizeMobile: "w-28"
    },
    {
        text: "15% restocking fee?",
        positionDesktop: "bottom-10 left-30",
        positionTablet: "bottom-2 left-8",
        positionMobile: "bottom-0 left-4",
        sizeDesktop: "w-32",
        sizeTablet: "w-28",
        sizeMobile: "w-24"
    },
];

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export default function Story() {
    const [device, setDevice] = useState<DeviceType>('desktop');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setDevice('mobile');
            } else if (window.innerWidth < 1024) {
                setDevice('tablet');
            } else {
                setDevice('desktop');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getPosition = (item: typeof floatingItems[0]) => {
        if (device === 'mobile') return item.positionMobile;
        if (device === 'tablet') return item.positionTablet;
        return item.positionDesktop;
    };

    const getSize = (item: typeof floatingItems[0]) => {
        if (device === 'mobile') return item.sizeMobile;
        if (device === 'tablet') return item.sizeTablet;
        return item.sizeDesktop;
    };

    const maxWidth = device === 'mobile' ? '95%' : device === 'tablet' ? '85%' : '900px';
    const minHeight = device === 'mobile' ? '320px' : device === 'tablet' ? '380px' : '420px';
    const imageWidth = device === 'mobile' ? 'w-[90%]' : device === 'tablet' ? 'w-[85%]' : 'w-[82%]';
    const textSize = device === 'mobile' ? 'text-xs' : device === 'tablet' ? 'text-sm' : 'text-sm';
    const padding = device === 'mobile' ? 'py-8 px-4' : device === 'tablet' ? 'py-10 px-6' : 'py-12';

    return (
        <section className={`${padding} bg-white`}>
            <div className="max-w-7xl mx-auto px-7">
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-indigo-deep mb-6 md:mb-8">
                    <span className="w-2 h-2 rounded-full bg-highlighter shadow-[0_0_0_3px_#FBE7C6]" />
                    The story
                </div>

                {/* Main layout: Image with floating thought bubbles */}
                <div className="relative mx-auto" style={{ maxWidth, minHeight }}>
                    {/* Floating thought bubbles */}
                    {floatingItems.map((item, idx) => (
                        <div
                            key={idx}
                            className={`absolute ${getPosition(item)} ${getSize(item)} z-20`}
                        >
                            {/* Thought bubble with pointer */}
                            <div className="relative">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl px-2 py-1 md:px-3 md:py-2 shadow-md hover:shadow-lg transition-shadow">
                                    <p className={`${textSize} text-gray-700 font-semibold leading-tight whitespace-pre-line`}>
                                        {item.text}
                                    </p>
                                </div>
                                {/* Pointer tail */}
                                <div className="absolute -bottom-1 left-3 md:left-4 w-3 h-3 bg-gradient-to-br from-blue-50 to-blue-100 border-r-2 border-b-2 border-blue-200 rounded-sm transform rotate-45"></div>
                            </div>
                        </div>
                    ))}

                    {/* Central image */}
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 ${imageWidth}`}>
                        <div className="rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(33,29,23,0.04),0_12px_28px_-14px_rgba(33,29,23,0.18)]">
                            <Image
                                src="/story-image.webp"
                                alt="A dense block of confusing text"
                                width={700}
                                height={420}
                                className="w-full h-auto"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Conclusion */}
                <div className="text-center mt-8 md:mt-12">
                    <p className="text-base md:text-lg lg:text-xl text-ink italic font-medium max-w-3xl mx-auto px-4">
                        This exists so you never have to say "I wish I'd read that more carefully."
                    </p>
                </div>
            </div>
        </section>
    );
}
