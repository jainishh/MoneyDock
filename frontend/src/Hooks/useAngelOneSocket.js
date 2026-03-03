import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { stocks as initialStocks } from '../utils/stockData.js';
import { parseTickData, updateStockPrice, updateStocksWithTicks } from '../utils/stockDataParser.js';
import { getMarketStatus, fetchStockQuotes } from '../services/angelOneService.js';

const useAngelOneSocket = (dynamicStocks = null) => {
    const { socket, isConnected, error: socketError } = useSocket();
    const [stocks, setStocks] = useState(dynamicStocks || initialStocks);
    const [error, setError] = useState(null);
    const [marketStatus, setMarketStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const hasLoadedRestData = useRef(false);
    const lastSubscribedTokens = useRef(new Set());

    // Sync state if dynamicStocks changes (e.g. portfolio refetched)
    useEffect(() => {
        if (dynamicStocks) {
            setStocks(prev => {
                // If we already have price data for these tokens, preserve it
                return dynamicStocks.map(ds => {
                    const existing = prev.find(p => p.token === ds.token || p.symboltoken === ds.token);
                    if (existing) {
                        return { ...ds, ...existing, ...ds }; // ds takes precedence for metadata, existing for prices
                    }
                    return ds;
                });
            });
            hasLoadedRestData.current = false; // Trigger REST fetch for new batch
        }
    }, [dynamicStocks]);

    // Sync local error with socket error
    useEffect(() => {
        if (socketError) setError(socketError);
    }, [socketError]);

    // Fetch initial market status and REST data if needed
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);

                // Check market status (non-blocking)
                getMarketStatus().then(status => setMarketStatus(status)).catch(() => {});

                // Always fetch REST data for new/changed token sets (works even when market is closed)
                if (!hasLoadedRestData.current) {
                    const stocksToFetch = stocks.filter(s => s.token || s.symboltoken);
                    if (stocksToFetch.length === 0) return;

                    const quotes = await fetchStockQuotes(stocksToFetch);

                    if (quotes && quotes.length > 0) {
                        setStocks(prevStocks => {
                            return prevStocks.map(stock => {
                                const token = stock.token || stock.symboltoken;
                                const quote = quotes.find(q => q.token === token);
                                if (quote) {
                                    const change = (quote.ltp || 0) - (quote.close || 0);
                                    const changePercent = quote.close > 0 ? (change / quote.close) * 100 : 0;

                                    return {
                                        ...stock,
                                        ltp: quote.ltp,
                                        price: quote.ltp,
                                        open: quote.open,
                                        high: quote.high,
                                        low: quote.low,
                                        close: quote.close,
                                        volume: quote.volume,
                                        oi: quote.oi || 0,
                                        oiChange: quote.oiChange || 0,
                                        change,
                                        changePercent: parseFloat(changePercent.toFixed(2)),
                                        percent: `${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
                                        isUp: change >= 0,
                                        dataSource: 'REST'
                                    };
                                }
                                return stock;
                            });
                        });
                        hasLoadedRestData.current = true;
                    }
                }
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [stocks.length]);

    const tickBuffer = useRef([]);

    // Independent Loop to process buffered ticks
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (tickBuffer.current.length > 0) {
                const ticksToProcess = [...tickBuffer.current];
                tickBuffer.current = [];

                setStocks(prevStocks => {
                    const uniqueTicks = new Map();
                    ticksToProcess.forEach(t => {
                        if (t && t.token) uniqueTicks.set(t.token, t);
                    });
                    const latestTicks = Array.from(uniqueTicks.values());
                    return updateStocksWithTicks(prevStocks, latestTicks);
                });
            }
        }, 200);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!socket || !isConnected) return;

        const currentTokens = stocks
            .map(s => s.token || s.symboltoken)
            .filter(Boolean);

        if (currentTokens.length === 0) return;

        // Check if subscription has actually changed
        const currentSet = new Set(currentTokens);
        const hasChanged = currentTokens.some(t => !lastSubscribedTokens.current.has(t)) ||
            Array.from(lastSubscribedTokens.current).some(t => !currentSet.has(t));

        if (!hasChanged) return;

        const stocksToSubscribe = stocks.filter(s => s.token || s.symboltoken);

        socket.emit('subscribe_stocks', {
            tokens: stocksToSubscribe.map(s => ({
                token: s.token || s.symboltoken,
                exchange: s.exchange || s.exch_seg || 'NSE',
                exch_seg: s.exch_seg || s.exchange || 'NSE'
            })),
            mode: 3
        });

        lastSubscribedTokens.current = currentSet;

        const handleSubscriptionResult = (result) => {
            if (result.success) {
                console.log(`✅ Subscribed to ${result.totalSubscriptions} items`);
            }
        };

        const handleTickData = (tickData) => {
            try {
                const parsedTick = parseTickData(tickData);
                if (parsedTick) tickBuffer.current.push(parsedTick);
            } catch (error) {
                console.error('Error processing tick:', error);
            }
        };

        socket.on('subscription_result', handleSubscriptionResult);
        socket.on('tick_data', handleTickData);

        return () => {
            socket.off('subscription_result', handleSubscriptionResult);
            socket.off('tick_data', handleTickData);
        };
    }, [socket, isConnected, stocks.length]);

    const addStock = async (newStock) => {
        if (stocks.find(s => String(s.token || s.symboltoken) === String(newStock.token || newStock.symboltoken))) return;
        setStocks(prev => [...prev, newStock]);
    };

    return { stocks, isConnected, error, marketStatus, isLoading, addStock };
};

export default useAngelOneSocket;
