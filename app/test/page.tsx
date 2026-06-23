'use client';

import { useState } from 'react';

export default function TestPage() {
    const [quotaStatus, setQuotaStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const checkQuota = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/quota-status');
            const data = await response.json();
            setQuotaStatus(data);
            setMessage('✅ Quota status fetched');
        } catch (error) {
            setMessage(`❌ Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const resetQuota = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/reset-quota', { method: 'POST' });
            const data = await response.json();
            setQuotaStatus(data);
            setMessage('✅ Quotas reset successfully!');
        } catch (error) {
            setMessage(`❌ Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">API Quota Status</h1>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={checkQuota}
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Check Quota Status'}
                </button>
                <button
                    onClick={resetQuota}
                    disabled={loading}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Reset Quotas (Testing)'}
                </button>
            </div>

            {message && (
                <div className="mb-6 p-4 bg-gray-100 rounded">
                    {message}
                </div>
            )}

            {quotaStatus && (
                <div className="space-y-6">
                    <div className="p-6 border rounded bg-gray-50">
                        <h2 className="text-2xl font-bold mb-4">Groq API</h2>
                        <div className="space-y-2">
                            <p><strong>Available:</strong> {quotaStatus.groq.available ? '✅ Yes' : '❌ No'}</p>
                            {quotaStatus.groq.resetAt && (
                                <>
                                    <p><strong>Resets At:</strong> {quotaStatus.groq.resetAt}</p>
                                    <p><strong>Hours Until Reset:</strong> {quotaStatus.groq.hoursUntilReset}</p>
                                </>
                            )}
                            {quotaStatus.groq.lastError && (
                                <p><strong>Last Error:</strong> {quotaStatus.groq.lastError}</p>
                            )}
                            <p><strong>Failure Count:</strong> {quotaStatus.groq.failureCount}</p>
                        </div>
                    </div>

                    <div className="p-6 border rounded bg-gray-50">
                        <h2 className="text-2xl font-bold mb-4">Gemini API</h2>
                        <div className="space-y-2">
                            <p><strong>Available:</strong> {quotaStatus.gemini.available ? '✅ Yes' : '❌ No'}</p>
                            {quotaStatus.gemini.resetAt && (
                                <>
                                    <p><strong>Resets At:</strong> {quotaStatus.gemini.resetAt}</p>
                                    <p><strong>Hours Until Reset:</strong> {quotaStatus.gemini.hoursUntilReset}</p>
                                </>
                            )}
                            {quotaStatus.gemini.lastError && (
                                <p><strong>Last Error:</strong> {quotaStatus.gemini.lastError}</p>
                            )}
                            <p><strong>Failure Count:</strong> {quotaStatus.gemini.failureCount}</p>
                        </div>
                    </div>

                    <div className="p-6 border rounded bg-gray-50">
                        <h2 className="text-2xl font-bold mb-4">Status</h2>
                        <p><strong>Timestamp:</strong> {quotaStatus.timestamp}</p>
                        <p><strong>Any API Available:</strong> {quotaStatus.anyAvailable ? '✅ Yes' : '❌ No'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
