import { getAllDocumentLogs } from '@/app/api/analyze-contract/document-logger';

/**
 * GET /api/document-logs
 * 
 * Returns all submitted documents with:
 * - $createdAt (automatic timestamp)
 * - documentType
 * - documentContent
 * 
 * Query parameters:
 * - limit: number of logs to return (default 1000)
 * - format: 'json' or 'csv' - defaults to json
 */
export async function GET(request: Request) {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '1000', 10);
    const format = url.searchParams.get('format') || 'json';

    try {
        const logs = await getAllDocumentLogs(limit);

        if (format === 'csv') {
            // Export as CSV
            if (logs.length === 0) {
                const csv = '$createdAt,documentType,documentContent\n';
                return new Response(csv, {
                    headers: {
                        'Content-Type': 'text/csv',
                        'Content-Disposition': 'attachment; filename="document-logs.csv"'
                    }
                });
            }

            const headers = '$createdAt,documentType,documentContent';
            const rows = logs.map(log => {
                const timestamp = log.$createdAt;
                const type = String(log.documentType);
                const content = String(log.documentContent).replace(/"/g, '""');
                return `"${timestamp}","${type}","${content}"`;
            });

            const csv = [headers, ...rows].join('\n');
            return new Response(csv, {
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': 'attachment; filename="document-logs.csv"'
                }
            });
        }

        // Return as JSON
        return Response.json({
            totalLogs: logs.length,
            entries: logs.map(log => ({
                $createdAt: log.$createdAt,
                documentType: log.documentType,
                documentContent: log.documentContent
            }))
        });

    } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Error fetching logs:', errorMsg);
        return Response.json(
            { error: 'Failed to fetch logs', message: errorMsg },
            { status: 500 }
        );
    }
}
