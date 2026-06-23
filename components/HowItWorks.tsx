'use client';

import Image from 'next/image';

export default function HowItWorks() {
    const steps = [
        {
            num: '01',
            title: 'Get the text in',
            desc: 'Paste it directly, drop in a PDF, or snap a photo of a printed page.',
            image: '/upload.jpg',
            imageAlt: 'Upload interface showing drag-and-drop area with PDF icon'
        },
        {
            num: '02',
            title: 'Wait a few seconds',
            desc: 'No forms, no account required to try it once. It just reads.',
            image: '/process.jpg',
            imageAlt: 'Processing state with animated loading dots and progress bar'
        },
        {
            num: '03',
            title: 'Read the breakdown',
            desc: 'A plain-English summary, the things to watch for, and exactly which clause each one came from.',
            image: '/result.jpg',
            imageAlt: 'Results display showing original clause and plain English translation'
        }
    ];

    return (
        <section id="how" className="py-28 bg-paper">
            <div className="max-w-7xl mx-auto px-7">
                <div className="mb-20">
                    <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-indigo-deep mb-6">
                        <span className="w-2 h-2 rounded-full bg-highlighter" />
                        How it works
                    </div>
                    <h2 className="text-[clamp(40px,6vw,56px)] leading-tight font-serif font-bold text-ink mb-4">
                        Three steps. About a minute.
                    </h2>
                    <p className="text-ink-soft text-base max-w-lg">Get your document analyzed in seconds with our simple three-step process.</p>
                </div>

                {/* Desktop: 3-column grid layout */}
                <div className="hidden md:grid grid-cols-3 gap-10">
                    {steps.map((step) => (
                        <div key={step.num} className="flex flex-col items-center text-center">
                            {/* Image */}
                            <div className="relative w-60 h-60 aspect-square bg-paper-deep rounded-xl overflow-hidden mb-8 border border-paper-line hover:shadow-md transition-shadow">
                                <Image
                                    src={step.image}
                                    alt={step.imageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="33vw"
                                    unoptimized
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col items-center mb-3">
                                <div className="w-12 h-12 rounded-full bg-indigo flex items-center justify-center font-serif font-bold text-xl text-white shrink-0 shadow-sm mb-3">
                                    {step.num}
                                </div>
                                <h3 className="text-lg font-serif font-bold text-ink">
                                    {step.title}
                                </h3>
                            </div>
                            <p className="text-sm text-ink-soft leading-relaxed px-4">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Mobile: Vertical stack */}
                <div className="md:hidden space-y-10">
                    {steps.map((step) => (
                        <div key={step.num} className="flex flex-col gap-4">
                            {/* Image - Full width */}
                            <div className="relative w-60 h-60 aspect-video bg-paper-deep rounded-lg overflow-hidden border border-paper-line">
                                <Image
                                    src={step.image}
                                    alt={step.imageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    unoptimized
                                />
                            </div>

                            {/* Step indicator + title */}
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo text-white flex items-center justify-center font-serif font-bold text-lg shrink-0 mt-0.5">
                                    {step.num}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-serif font-bold text-ink mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-ink-soft leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
