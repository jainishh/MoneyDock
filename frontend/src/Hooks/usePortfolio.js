import { useState, useEffect, useCallback } from 'react';

/**
 * usePortfolio — fetches holdings + summary from backend
 * Pass userId if auth middleware is not yet active.
 */
export function usePortfolio(userId) {
    const [holdings, setHoldings] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPortfolio = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/portfolio/holdings?userId=${userId}`);

            // Check if response is OK
            if (!res.ok) {
                const text = await res.text();
                setError(`Server Error (${res.status}): ${text.slice(0, 50)}...`);
                return;
            }

            // Check if response is JSON
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                setError('Invalid response format: Expected JSON but received ' + (contentType || 'unknown'));
                return;
            }

            const json = await res.json();
            if (!json.success) {
                setError(json.message || 'Failed to load portfolio');
            } else {
                setHoldings(json.holdings ?? []);
                setSummary(json.summary ?? null);
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { fetchPortfolio(); }, [fetchPortfolio]);

    return { holdings, summary, loading, error, refetch: fetchPortfolio };
}
