'use client';

import { useState } from 'react';

type AnalysisMode = 'contract' | 'message';

interface AnalysisResult {
    summary?: string;
    obligations?: string[];
    deadlines?: string[];
    costs?: string[];
    risks?: string[];
    keyPhrases?: string[];
    verdict?: 'clean' | 'uncertain' | 'scam_likely';
    redFlags?: string[];
    reasoning?: string;
    urls?: Array<{ url: string; reputation: 'safe' | 'suspicious' | 'dangerous'; reason: string }>;
    cached?: boolean;
}

interface QuotaInfo {
    limit: number;
    remaining: number;
    resetsInMinutes: number;
}

export default function Playground() {
    const [mode, setMode] = useState<AnalysisMode>('contract');
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);

    const handleAnalyze = async () => {
        if (!inputText.trim()) {
            setError('Please paste a ' + (mode === 'contract' ? 'contract' : 'message') + ' to analyze');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/analyze-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...(mode === 'contract' ? { contractText: inputText } : { messageText: inputText }),
                    mode
                }),
            });

            const data = await response.json();

            if (data.quotaInfo) {
                setQuotaInfo(data.quotaInfo);
            }

            if (!response.ok) {
                setError(data.error || 'Failed to analyze');
                return;
            }

            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="trythese" className="py-20 px-7 bg-white text-ink">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl font-serif font-bold mb-3 text-center">Try it free</h2>
                    <p className="text-center text-ink-soft mb-8">
                        {mode === 'contract'
                            ? 'Paste any contract and instantly spot hidden fees, cancellation traps, and unfavorable terms before you sign'
                            : 'Paste a suspicious message, email, or text to check for scam indicators, phishing attempts, and dangerous links'}
                    </p>

                    {/* Mode Toggle */}
                    <div className="flex gap-3 mb-8 justify-center flex-wrap">
                        <button
                            onClick={() => { setMode('contract'); setInputText(''); setResult(null); }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${mode === 'contract'
                                ? 'bg-indigo text-white shadow-md'
                                : 'bg-paper-deep text-ink hover:bg-paper-line'
                                }`}
                        >
                            📄 Analyze Contract
                        </button>
                        <button
                            onClick={() => { setMode('message'); setInputText(''); setResult(null); }}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition ${mode === 'message'
                                ? 'bg-indigo text-white shadow-md'
                                : 'bg-paper-deep text-ink hover:bg-paper-line'
                                }`}
                        >
                            ⚠️ Check Message
                        </button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Input */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-3 text-ink">
                            {mode === 'contract' ? 'Paste your contract:' : 'Paste the message or email:'}
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={mode === 'contract'
                                ? 'Paste the contract text here...'
                                : 'Paste the suspicious message, email, or text here...'}
                            className="flex-1 p-4 border border-paper-line rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo resize-none min-h-96 text-sm"
                            disabled={loading}
                        />

                        {quotaInfo && (
                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                                <p className="text-blue-900">
                                    Free: <strong>{quotaInfo.remaining}/{quotaInfo.limit}</strong> remaining
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={loading}
                            className="mt-4 bg-indigo hover:bg-indigo-deep disabled:bg-paper-line text-white font-semibold py-3 rounded-lg transition-colors"
                        >
                            {loading ? 'Analyzing...' : (mode === 'contract' ? 'Analyze Contract' : 'Check Message')}
                        </button>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-xs">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Results */}
                    <div className="flex flex-col bg-paper p-6 rounded-lg border border-paper-line min-h-96">
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-paper-line rounded w-3/4"></div>
                                <div className="h-3 bg-paper-line rounded w-full"></div>
                                <div className="h-3 bg-paper-line rounded w-5/6"></div>
                            </div>
                        ) : result ? (
                            <div className="space-y-4 text-sm">
                                {result?.summary && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Summary</h3>
                                        <p className="text-ink-soft text-xs leading-relaxed">{result.summary}</p>
                                    </div>
                                )}
                                {result?.cached && (
                                    <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                                        ✓ Cached result
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-center">
                                <p className="text-sm text-ink-soft">Analysis results appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
