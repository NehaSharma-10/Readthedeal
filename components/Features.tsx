'use client';

const FEATURES = [
    {
        title: 'Contracts',
        description: 'Spot hidden fees, cancellation traps, auto-renewal clauses, and unfavorable terms before you sign.',
    },
    {
        title: 'Messages & Emails',
        description: 'Detect financial scams, phishing attempts, credential theft, and impersonation in suspicious messages.',
    },
    {
        title: 'Return Policies',
        description: 'Understand return windows, conditions, exclusions, costs, and if the policy is buyer-friendly.',
    },
    {
        title: 'Prescriptions',
        description: 'Know your dosage, warnings, side effects, interactions, and when to call a doctor. Medical disclaimer always shown.',
    },
    {
        title: 'Meeting Notes',
        description: 'Extract decisions, action items with owners/deadlines, open questions, and key discussion points.',
    },
    {
        title: 'Gov Forms',
        description: 'Understand what you need to do, required documents, deadlines with consequences, and fees.',
    },
    {
        title: 'Warranties',
        description: 'See what\'s covered, what voids the warranty, claim process, documents needed, and strength of coverage.',
    },
];

export default function Features() {
    return (
        <section className="py-16 md:py-20 px-7 bg-gradient-to-b from-white to-paper">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink mb-3">
                        Seven modes. One place.
                    </h2>
                    <p className="text-lg text-ink-soft max-w-2xl mx-auto">
                        Any document. Any message. Paste it once, understand it completely.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.slice(0, 6).map((feature, index) => (
                        <div
                            key={index}
                            className="p-5 bg-white rounded-lg border border-paper-line hover:border-indigo/30 hover:shadow-md transition-all duration-300"
                        >
                            <h3 className="font-semibold text-ink mb-2 text-lg">{feature.title}</h3>
                            <p className="text-sm text-ink-soft leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Last card centered */}
                <div className="flex justify-center mt-5">
                    <div className="p-5 bg-white rounded-lg border border-paper-line hover:border-indigo/30 hover:shadow-md transition-all duration-300 w-full lg:w-1/3">
                        <h3 className="font-semibold text-ink mb-2 text-lg">{FEATURES[6].title}</h3>
                        <p className="text-sm text-ink-soft leading-relaxed">{FEATURES[6].description}</p>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <a
                        href="#trythese"
                        className="inline-block bg-indigo hover:bg-indigo-deep text-white px-8 py-3 rounded-lg font-semibold transition transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                    >
                        Try all 7 modes free →
                    </a>
                </div>
            </div>
        </section>
    );
}
