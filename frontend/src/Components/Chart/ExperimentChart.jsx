import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';

const ExperimentChart = () => {
    const chartContainerRef = useRef(null);
    const [status, setStatus] = useState("Initializing...");
    const [err, setErr] = useState("");

    useEffect(() => {
        // Safe check for container
        if (!chartContainerRef.current) {
            setStatus("Container ref is null");
            return;
        }

        let chart;
        try {
            setStatus("Creating chart...");

            // USE FIXED DIMENSIONS TO PREVENT CRASHES FROM 0-WIDTH PARENTS
            chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: '#000000' },
                    textColor: 'rgba(255, 255, 255, 0.9)',
                },
                width: 600,
                height: 400,
                grid: {
                    vertLines: { color: '#333' },
                    horzLines: { color: '#333' },
                },
            });

            // V5 CHECK: Use addSeries(CandlestickSeries) instead of addCandlestickSeries
            const candlestickSeries = chart.addSeries(CandlestickSeries, {
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350'
            });

            // Hardcoded valid data
            const data = [
                { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
                { time: '2018-12-23', open: 45.12, high: 53.90, low: 45.12, close: 48.09 },
                { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
                { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.50 },
                { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
                { time: '2018-12-27', open: 91.04, high: 121.40, low: 82.70, close: 111.40 },
                { time: '2018-12-28', open: 111.51, high: 142.83, low: 103.34, close: 131.25 },
                { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
                { time: '2018-12-30', open: 106.33, high: 110.20, low: 90.39, close: 98.10 },
                { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
            ];

            candlestickSeries.setData(data);
            chart.timeScale().fitContent();

            setStatus("Chart Created & Data Set Successfully");

        } catch (e) {
            console.error(e);
            setErr(e.message);
            setStatus("CRASHED");
        }

        return () => {
            if (chart) chart.remove();
        };
    }, []);

    return (
        <div style={{ padding: '20px', background: '#333', color: 'white', minHeight: '500px' }}>
            <h3>Experiment Chart Safety Mode</h3>
            <div>Status: <span style={{ color: 'yellow' }}>{status}</span></div>
            {err && <div style={{ color: 'red', fontWeight: 'bold' }}>ERROR: {err}</div>}

            <div
                ref={chartContainerRef}
                className="chart-container"
                style={{ width: '600px', height: '400px', border: '5px solid cyan', margin: '10px' }}
            />
        </div>
    );
};

export default ExperimentChart;
