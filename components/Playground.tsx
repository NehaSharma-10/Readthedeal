'use client';

import { useState, useEffect } from 'react';

type AnalysisMode = 'contract' | 'message' | 'returns' | 'prescription' | 'meeting' | 'government' | 'warranty' | 'auto';

interface AnalysisResult {
    [key: string]: any;
}

interface QuotaInfo {
    limit: number;
    remaining: number;
    resetsInMinutes: number;
}

const DROPDOWN_OPTIONS = [
    { value: 'contract', label: 'Contract or Agreement' },
    { value: 'message', label: 'Suspicious Message' },
    { value: 'returns', label: 'Return / Refund Policy' },
    { value: 'prescription', label: 'Prescription or Medicine Label' },
    { value: 'meeting', label: 'Meeting Notes' },
    { value: 'government', label: 'Government Form or Notice' },
    { value: 'warranty', label: 'Warranty Document' },
    { value: 'auto', label: 'Not sure — figure it out' },
] as const;

const PLACEHOLDERS: Record<AnalysisMode, string> = {
    contract: 'Paste your contract, lease, or membership agreement...',
    message: 'Paste the suspicious text, email, or DM...',
    returns: 'Paste the store\'s return or refund policy...',
    prescription: 'Paste your prescription or medicine label text...',
    meeting: 'Paste your raw meeting notes or transcript...',
    government: 'Paste the government form, notice, or letter...',
    warranty: 'Paste your warranty document...',
    auto: 'Paste anything confusing — we\'ll figure out what it is...',
};

export default function Playground() {
    const [mode, setMode] = useState<AnalysisMode>('auto');
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quotaInfo, setQuotaInfo] = useState<QuotaInfo | null>(null);
    const [detectedMode, setDetectedMode] = useState<string | null>(null);
    const [localQuotaExpiry, setLocalQuotaExpiry] = useState<number | null>(null);

    // Load quota expiry from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('quotaResetTime');
            if (stored) {
                const resetTime = parseInt(stored, 10);
                if (resetTime > Date.now()) {
                    setLocalQuotaExpiry(resetTime);
                } else {
                    localStorage.removeItem('quotaResetTime');
                }
            }
        }
    }, []);

    const handleAnalyze = async () => {
        // Check local quota expiry first
        if (localQuotaExpiry && Date.now() < localQuotaExpiry) {
            if (quotaInfo && quotaInfo.remaining <= 0) {
                setError(`Daily limit reached. Quota resets in ${quotaInfo.resetsInMinutes} minutes.`);
                return;
            }
        }

        // Validation
        if (!inputText.trim()) {
            setError('Please paste something first.');
            return;
        }

        if (inputText.trim().length < 20) {
            setError('Too short to analyze — paste the full document.');
            return;
        }

        if (inputText.trim().length > 100000) {
            setError('Document too large. Maximum 100,000 characters. You pasted ' + inputText.trim().length + ' characters.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);
        setDetectedMode(null);

        // Show a message for long texts
        const textLength = inputText.trim().length;
        if (textLength > 10000) {
            setError('Processing large document... This may take up to 90 seconds.');
        }

        try {
            const response = await fetch('/api/analyze-contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText, mode }),
            });

            const data = await response.json();

            if (data.quotaInfo) {
                setQuotaInfo(data.quotaInfo);
                // Store the quota reset time in localStorage
                if (data.quotaInfo.resetsInMinutes && typeof window !== 'undefined') {
                    const resetTime = Date.now() + (data.quotaInfo.resetsInMinutes * 60 * 1000);
                    localStorage.setItem('quotaResetTime', resetTime.toString());
                    setLocalQuotaExpiry(resetTime);
                }
            }

            if (!response.ok) {
                setError(data.error || 'Failed to analyze');
                return;
            }

            setResult(data);
            if (data.detectedMode) {
                setDetectedMode(data.detectedMode);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const copyActionItems = () => {
        if (!result?.actionItems) return;
        const text = result.actionItems
            .map((item: any) => `${item.task} | ${item.owner} | ${item.deadline} | ${item.priority}`)
            .join('\n');
        navigator.clipboard.writeText(text);
    };

    const getVerdictStyle = (verdict: string) => {
        const greenVerdicts = ['clean', 'buyer_friendly', 'strong'];
        const yellowVerdicts = ['uncertain', 'neutral', 'standard'];
        const redVerdicts = ['scam_likely', 'buyer_unfriendly', 'weak'];

        if (greenVerdicts.includes(verdict)) {
            return { container: 'bg-green-50 border border-green-200', text: 'text-green-900' };
        } else if (yellowVerdicts.includes(verdict)) {
            return { container: 'bg-yellow-50 border border-yellow-200', text: 'text-yellow-900' };
        } else if (redVerdicts.includes(verdict)) {
            return { container: 'bg-red-50 border border-red-200', text: 'text-red-900' };
        }
        return { container: 'bg-gray-50 border border-gray-200', text: 'text-gray-900' };
    };

    const getVerdictLabel = (verdict: string) => {
        const labels: Record<string, string> = {
            clean: '✓ Clean',
            scam_likely: '🚨 Scam Likely',
            uncertain: '⚠️ Uncertain',
            buyer_friendly: '✓ Buyer Friendly',
            buyer_unfriendly: '⚠️ Buyer Unfriendly',
            strong: '✓ Strong',
            weak: '⚠️ Weak',
            neutral: '⚠️ Neutral',
            standard: '⚠️ Standard',
        };
        return labels[verdict] || verdict;
    };

    const displayMode = detectedMode || mode;
    const showPrescriptionBanner = detectedMode === 'prescription';

    return (
        <section id="trythese" className="py-20 bg-white text-ink">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h2 className="text-[clamp(32px,5vw,52px)] font-serif font-bold mb-3 text-center text-indigo">Try it now</h2>
                    <p className="text-center text-ink-soft mb-8 text-sm md:text-base max-w-2xl mx-auto">
                        Paste a contract, prescription, government notice, warranty, return policy, meeting notes, or suspicious message. We'll translate the jargon and show you what actually matters.
                    </p>

                    {/* Dropdown */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold mb-2 block text-ink">
                            Document type (optional - auto-detects by default)
                        </label>
                        <select
                            value={mode}
                            onChange={(e) => {
                                setMode(e.target.value as AnalysisMode);
                                setInputText('');
                                setResult(null);
                                setDetectedMode(null);
                            }}
                            className="w-full px-4 py-3 border border-paper-line rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo bg-white text-ink font-semibold text-sm"
                        >
                            {DROPDOWN_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-ink-soft mt-2">💡 Tip: Leave set to "Not sure — figure it out" for automatic detection</p>
                    </div>
                </div>

                {/* Prescription Disclaimer */}
                {showPrescriptionBanner && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-900 font-semibold">
                            💊This explains what your prescription says — not medical advice. Never change your dosage without consulting your doctor.
                        </p>
                    </div>
                )}

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Input */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold mb-3 text-ink">
                            Enter text:
                        </label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={PLACEHOLDERS[mode]}
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
                            {loading ? 'Analyzing...' : 'Analyze it'}
                        </button>

                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800 text-xs">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Results */}
                    <div className="flex flex-col bg-paper p-6 rounded-lg border border-paper-line min-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-paper-line rounded w-3/4"></div>
                                <div className="h-3 bg-paper-line rounded w-full"></div>
                                <div className="h-3 bg-paper-line rounded w-5/6"></div>
                            </div>
                        ) : result ? (
                            <div className="space-y-2 text-xs md:text-sm">
                                {/* Detected Mode Info */}
                                {detectedMode && (
                                    <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg mb-4">
                                        <p className="text-blue-900 font-bold text-sm">
                                            ✓ Detected as: <span className="capitalize text-lg">{detectedMode === 'returns' ? 'Return Policy' : detectedMode === 'government' ? 'Government Form' : detectedMode === 'message' ? 'Suspicious Message' : detectedMode === 'prescription' ? 'Prescription' : detectedMode === 'meeting' ? 'Meeting Notes' : detectedMode === 'warranty' ? 'Warranty' : 'Contract'}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Verdict Badge */}
                                {result.verdict && (
                                    <div className={`p-3 rounded-lg ${getVerdictStyle(result.verdict).container}`}>
                                        <p className={`font-semibold text-sm ${getVerdictStyle(result.verdict).text}`}>
                                            {getVerdictLabel(result.verdict)}
                                        </p>
                                    </div>
                                )}

                                {/* Summary */}
                                {result.summary && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink text-xs">Summary</h3>
                                        <p className="text-ink-soft text-xs leading-snug">{result.summary}</p>
                                    </div>
                                )}

                                {/* Return Window */}
                                {result.returnWindow && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Return Window</h3>
                                        <p className="text-ink-soft text-xs">{result.returnWindow}</p>
                                    </div>
                                )}

                                {/* Coverage Period */}
                                {result.coveragePeriod && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Coverage Period</h3>
                                        <p className="text-ink-soft text-xs">{result.coveragePeriod}</p>
                                    </div>
                                )}

                                {/* Dosage */}
                                {result.dosage && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Dosage</h3>
                                        <p className="text-ink-soft text-xs">{result.dosage}</p>
                                    </div>
                                )}

                                {/* Obligations */}
                                {result.obligations && result.obligations.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink text-xs">Obligations</h3>
                                        <ul className="text-xs text-ink-soft space-y-0.5">
                                            {result.obligations.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Conditions */}
                                {result.conditions && result.conditions.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Conditions</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.conditions.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Process/Claim Process */}
                                {(result.process || result.claimProcess) && (result.process || result.claimProcess).length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">{result.claimProcess ? 'Claim Process' : 'Process'}</h3>
                                        <ol className="text-xs text-ink-soft space-y-1 list-decimal list-inside">
                                            {(result.process || result.claimProcess).map((item: string, i: number) => <li key={i}>{item}</li>)}
                                        </ol>
                                    </div>
                                )}

                                {/* Warnings */}
                                {result.warnings && result.warnings.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Warnings</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.warnings.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Government Warnings */}
                                {result.governmentWarnings && result.governmentWarnings.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Warnings</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.governmentWarnings.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Side Effects */}
                                {result.sideEffects && result.sideEffects.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Side Effects</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.sideEffects.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Red Flags (Prescription) */}
                                {displayMode === 'prescription' && result.redFlags && result.redFlags.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink text-red-600">🚨 Stop & Call Doctor</h3>
                                        <ul className="text-xs text-red-700 space-y-1 bg-red-50 p-2 rounded border border-red-200">
                                            {result.redFlags.map((flag: string, i: number) => <li key={i}>• {flag}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Red Flags (Message) */}
                                {displayMode === 'message' && result.redFlags && result.redFlags.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink text-red-600">🚩 Red Flags</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.redFlags.map((flag: string, i: number) => <li key={i}>• {flag}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Action Items */}
                                {result.actionItems && result.actionItems.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-ink">Action Items</h3>
                                            <button
                                                onClick={copyActionItems}
                                                className="text-xs px-2 py-1 bg-indigo/10 text-indigo rounded hover:bg-indigo/20"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs border-collapse">
                                                <thead>
                                                    <tr className="border-b border-paper-line">
                                                        <th className="text-left p-2 font-semibold">Task</th>
                                                        <th className="text-left p-2 font-semibold">Owner</th>
                                                        <th className="text-left p-2 font-semibold">Deadline</th>
                                                        <th className="text-left p-2 font-semibold">Priority</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.actionItems.map((item: any, i: number) => (
                                                        <tr key={i} className="border-b border-paper-line hover:bg-paper-deep">
                                                            <td className="p-2">{item.task}</td>
                                                            <td className="p-2">{item.owner}</td>
                                                            <td className="p-2">{item.deadline}</td>
                                                            <td className="p-2">
                                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.priority === 'high'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : item.priority === 'medium'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                    {item.priority}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* What They Need To Do */}
                                {result.whatTheyNeedToDo && result.whatTheyNeedToDo.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Steps</h3>
                                        <ol className="text-xs text-ink-soft space-y-1 list-decimal list-inside">
                                            {result.whatTheyNeedToDo.map((item: string, i: number) => <li key={i}>{item}</li>)}
                                        </ol>
                                    </div>
                                )}

                                {/* Decisions */}
                                {result.decisions && result.decisions.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Decisions</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.decisions.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Deadlines */}
                                {result.deadlines && result.deadlines.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Deadlines</h3>
                                        <div className="space-y-2 text-xs">
                                            {result.deadlines.map((item: any, i: number) => (
                                                <div key={i} className="p-2 border-l-2 border-red-400 bg-red-50 rounded">
                                                    {typeof item === 'string' ? (
                                                        <p>{item}</p>
                                                    ) : (
                                                        <>
                                                            <p className="font-semibold">{item.date}</p>
                                                            <p className="text-ink-soft">{item.action}</p>
                                                            <p className="text-red-700 font-semibold mt-1">⚠️ {item.consequence}</p>
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Reasoning */}
                                {result.reasoning && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Analysis</h3>
                                        <p className="text-ink-soft text-xs leading-relaxed">{result.reasoning}</p>
                                    </div>
                                )}

                                {/* Covered */}
                                {result.covered && result.covered.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink text-green-600">✓ Covered</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.covered.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Not Covered */}
                                {result.notCovered && result.notCovered.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink text-red-600">⚠️ NOT Covered</h3>
                                        <ul className="text-xs text-red-700 space-y-1 bg-red-50 p-2 rounded border border-red-200">
                                            {result.notCovered.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Contact Info */}
                                {result.contactInfo && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Contact Info</h3>
                                        <p className="text-ink-soft text-xs">{result.contactInfo}</p>
                                    </div>
                                )}

                                {/* Links */}
                                {result.urls && result.urls.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">Links Found</h3>
                                        <div className="space-y-2">
                                            {result.urls.map((link: any, i: number) => (
                                                <div key={i} className="p-2 bg-paper-deep rounded border border-paper-line">
                                                    <p className="text-xs font-mono truncate text-ink-soft">{link.url}</p>
                                                    <p className={`text-xs mt-1 ${link.reputation === 'safe'
                                                        ? 'text-green-600'
                                                        : 'text-red-600'
                                                        }`}>
                                                        {link.reputation === 'safe' ? '✓' : '⚠️'} {link.reason}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Risks */}
                                {result.risks && result.risks.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink text-red-600 text-xs">Risks</h3>
                                        <ul className="text-xs text-ink-soft space-y-0.5">
                                            {result.risks.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Helpful Tips */}
                                {result.helpfulTips && result.helpfulTips.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold mb-1 text-ink">💡 Helpful Tips</h3>
                                        <ul className="text-xs text-ink-soft space-y-1">
                                            {result.helpfulTips.map((item: string, i: number) => <li key={i}>• {item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Cached Badge */}
                                {result.cached && (
                                    <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800 mt-2">
                                        ✓ Cached result
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-ink-soft text-sm">
                                Results will appear here
                            </div>
                        )}
                    </div>
                </div>

                {/* Works with... text */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-ink-soft">
                        Works with contracts, prescriptions, government forms, warranties, return policies, meeting notes, and suspicious messages.
                    </p>
                </div>
            </div>
        </section>
    );
}
