import React, { useState, useMemo, useEffect } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    Title, Tooltip, Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    Title, Tooltip, Legend, ChartDataLabels
);

// --- Data Constants ---
const FULL_PRODUCTION_LINES = [
    {
        id: 'liquid_sachet',
        name: 'Liquid Sachet',
        color: '#f97316', // Orange
        load: 88,
        trend: [1200, 1350, 1600, 1900],
        note: 'Critical visual check required',
        subLines: [{ name: 'LS-01', load: 95 }, { name: 'LS-02', load: 81 }]
    },
    {
        id: 'liquid_pouch',
        name: 'Liquid Pouch',
        color: '#ef4444', // Red
        load: 82,
        trend: [800, 850, 900, 1100],
        note: 'New spout equipment active',
        subLines: [{ name: 'LP-A', load: 85 }, { name: 'LP-B', load: 79 }]
    },
    {
        id: 'gel_candy',
        name: 'Gel Candy',
        color: '#eab308', // Yellow
        load: 75,
        trend: [500, 600, 750, 800],
        note: 'Temperature sensitive',
        subLines: [{ name: 'GC-01', load: 75 }]
    },
    {
        id: 'tablets',
        name: 'Tablets',
        color: '#10b981', // Emerald
        load: 70,
        trend: [1100, 1200, 1300, 1400],
        note: 'Stable output',
        subLines: [{ name: 'TB-X', load: 72 }, { name: 'TB-Y', load: 68 }]
    },
    {
        id: 'sachet_filling',
        name: 'Sachet Filling',
        color: '#06b6d4', // Cyan
        load: 65,
        trend: [900, 950, 950, 980],
        note: 'Routine maintenance due',
        subLines: [{ name: 'SF-1', load: 60 }, { name: 'SF-2', load: 70 }]
    },
    {
        id: 'hard_cap',
        name: 'Hard Cap',
        color: '#3b82f6', // Blue
        load: 60,
        trend: [600, 650, 700, 720],
        note: 'Material delay resolved',
        subLines: [{ name: 'HC-Line', load: 60 }]
    },
    {
        id: 'soft_cap',
        name: 'Soft Cap',
        color: '#8b5cf6', // Violet
        load: 55,
        trend: [300, 320, 350, 400],
        note: 'Low volume run',
        subLines: [{ name: 'SC-Line', load: 55 }]
    },
    {
        id: 'square_sachet',
        name: 'Square Sachet',
        color: '#d946ef', // Fuchsia
        load: 45,
        trend: [200, 250, 300, 350],
        note: 'Transitioning format',
        subLines: [{ name: 'SS-01', load: 45 }]
    },
    {
        id: 'packing',
        name: 'Packing/Bottle',
        color: '#64748b', // Slate
        load: 40,
        trend: [300, 300, 320, 320],
        note: 'Underutilized',
        subLines: [{ name: 'PK-Main', load: 40 }]
    }
];

const FactoryOutputWidget = () => {
    const [viewMode, setViewMode] = useState('overall'); // 'overall' | 'line'
    const [selectedLineIds, setSelectedLineIds] = useState([]);
    const [expandedLineIds, setExpandedLineIds] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Initial Logic for 'line' view selection
    useEffect(() => {
        if (viewMode === 'line') {
            // Sort by load descending
            const sorted = [...FULL_PRODUCTION_LINES].sort((a, b) => b.load - a.load);
            const n = sorted.length;
            if (n <= 5) {
                setSelectedLineIds(sorted.map(l => l.id));
            } else {
                // Top 1
                const top = sorted[0];
                // Median
                const median = sorted[Math.floor(n / 2)];
                // Bottom 3
                const bottom3 = sorted.slice(n - 3);

                // Use Set to avoid duplicates if specific overlap edge cases
                const selected = new Set([top.id, median.id, ...bottom3.map(l => l.id)]);
                setSelectedLineIds(Array.from(selected));
            }
        }
    }, [viewMode]);

    // Common Labels
    const labels = ['Q1', 'Q2', 'Q3', 'Q4 (Current)'];

    // --- Data for Overall View ---
    const laborDaysData = [2800, 3100, 3500, 4000];
    const leadTimeData = [48, 46, 45, 42];

    const overallData = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'Quarterly Labor Days',
                data: laborDaysData,
                backgroundColor: (ctx) => ctx.dataIndex === 3 ? '#6366f1' : '#cbd5e1',
                barThickness: 40,
                borderRadius: 4,
                yAxisID: 'yDesc',
                order: 2,
                datalabels: {
                    color: (ctx) => ctx.dataIndex === 3 ? '#6366f1' : '#64748b',
                    font: { weight: 'bold' },
                    anchor: 'end',
                    align: 'top',
                    offset: -4,
                    formatter: (val) => val.toLocaleString()
                }
            },
            {
                type: 'line',
                label: 'Avg Lead Time (Days)',
                data: leadTimeData,
                borderColor: '#10b981',
                backgroundColor: '#10b981',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'yAsc',
                order: 1,
                tension: 0.3,
                datalabels: {
                    color: '#10b981',
                    align: 'top',
                    anchor: 'start',
                    offset: 6,
                    font: { weight: 'bold' },
                    formatter: (val) => `${val}d`
                }
            }
        ]
    };

    // --- Options for Overall View ---
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { weight: 'bold', size: 12 }, color: '#475569' }
            },
            yDesc: {
                type: 'linear', display: true, position: 'left', beginAtZero: true,
                title: { display: true, text: 'Labor Days (Per Quarter)', color: '#6366f1' },
                grid: { borderDash: [4, 4], color: '#f1f5f9' }, max: 5000
            }
        }
    };

    const overallOptions = {
        ...commonOptions,
        scales: {
            ...commonOptions.scales,
            yAsc: {
                type: 'linear', display: true, position: 'right', beginAtZero: false, min: 30, max: 60,
                title: { display: true, text: 'Avg Lead Time (Days)', color: '#10b981' }, grid: { display: false }
            }
        },
        plugins: {
            ...commonOptions.plugins,
            tooltip: {
                ...commonOptions.plugins.tooltip,
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.type === 'bar') return ` Labor Days: ${ctx.raw.toLocaleString()}`;
                        return ` Avg Lead Time: ${ctx.raw} Days`;
                    }
                }
            }
        }
    };

    // --- Derived Data for Line View ---
    const selectedLines = useMemo(() => {
        // Sort selected lines by LOAD descending for display
        return FULL_PRODUCTION_LINES
            .filter(line => selectedLineIds.includes(line.id))
            .sort((a, b) => b.load - a.load);
    }, [selectedLineIds]);

    const summaryStats = useMemo(() => {
        if (selectedLines.length === 0) return { capacity: 0, avgLoad: 0 };
        const avgLoad = Math.round(selectedLines.reduce((acc, l) => acc + l.load, 0) / selectedLines.length);
        const totalCapacityDays = selectedLines.length * 90; // Mock: 90 days per quarter per line
        return { capacity: totalCapacityDays, avgLoad };
    }, [selectedLines]);


    // --- Helpers ---
    const toggleLineSelection = (id) => {
        if (selectedLineIds.includes(id)) {
            if (selectedLineIds.length > 1) {
                setSelectedLineIds(prev => prev.filter(lineId => lineId !== id));
            }
        } else {
            // Re-enforce max 5 logic to keep chart clean
            if (selectedLineIds.length < 5) {
                setSelectedLineIds(prev => [...prev, id]);
            }
        }
    };

    const toggleAccordion = (id) => {
        setExpandedLineIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // Dynamic Footnote
    const getFootnote = () => {
        if (viewMode === 'overall') {
            return `Q4 cumulative delivery: 100 contracts. Efficiency improved by 12.5% vs. Q1 initial stage.`;
        }
        return `Default view showing 1 Top, 1 Median, and 3 Bottom lines by current occupancy.`;
    };

    // Render Color Helper
    const getStatusColor = (load) => {
        if (load > 80) return { bar: 'bg-orange-500', text: 'text-orange-600', label: 'High' };
        if (load >= 60) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Optimal' };
        return { bar: 'bg-slate-300', text: 'text-slate-500', label: 'Low' };
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                    <div>
                        <h3 className="font-bold text-slate-700 leading-none">
                            {viewMode === 'overall' ? 'P2-C. QUARTERLY OUTPUT & EFFICIENCY TRENDS' : 'P2-C. CURRENT PRODUCTION LOAD RANKING'}
                        </h3>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Factory Output & Efficiency Trends</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('overall')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'overall' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Overall Factory
                        </button>
                        <button
                            onClick={() => setViewMode('line')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'line' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            By Production Line
                        </button>
                    </div>

                    {/* Category Filter (Only in Line View) */}
                    {viewMode === 'line' && (
                        <div className="relative z-10">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm"
                            >
                                <i className="fa-solid fa-filter text-slate-400"></i>
                                Select Lines ({selectedLineIds.length})
                                <i className={`fa-solid fa-chevron-down ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl p-2 max-h-60 overflow-y-auto z-20">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">Production Categories</div>
                                    {FULL_PRODUCTION_LINES.map(line => {
                                        const isSelected = selectedLineIds.includes(line.id);
                                        const isDisabled = !isSelected && selectedLineIds.length >= 5;
                                        return (
                                            <div
                                                key={line.id}
                                                onClick={() => !isDisabled && toggleLineSelection(line.id)}
                                                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 bg-white'}`}>
                                                    {isSelected && <i className="fa-solid fa-check text-[10px] text-white"></i>}
                                                </div>
                                                <span className="text-xs text-slate-700 font-medium truncate">{line.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0">
                {/* Chart / Ranking Section */}
                <div className="flex-1 w-full h-[320px] relative min-w-0 overflow-y-auto custom-scrollbar pr-2">
                    {viewMode === 'overall' ? (
                        <Chart
                            type='bar'
                            data={overallData}
                            options={overallOptions}
                        />
                    ) : (
                        /* Custom Horizontal Ranking Chart */
                        <div className="flex flex-col gap-4 mt-2">
                            {selectedLines.map(line => {
                                const status = getStatusColor(line.load);
                                const isExpanded = expandedLineIds.includes(line.id);

                                return (
                                    <div key={line.id} className="w-full">
                                        {/* Row Header & Bar */}
                                        <div className="flex items-center gap-4 mb-2">
                                            {/* Label Area */}
                                            <div className="w-32 flex-shrink-0 flex items-center gap-1.5">
                                                <button
                                                    onClick={() => toggleAccordion(line.id)}
                                                    className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 transition-colors"
                                                >
                                                    <i className={`fa-solid fa-plus text-[10px] transition-transform ${isExpanded ? 'rotate-45' : ''}`}></i>
                                                </button>
                                                <span className="text-xs font-bold text-slate-700 truncate" title={line.name}>{line.name}</span>
                                            </div>

                                            {/* Bar Area */}
                                            <div className="flex-1 h-8 bg-slate-50 rounded-lg relative overflow-hidden flex items-center px-2">
                                                {/* Background Bar Frame (Visual Guide) */}
                                                <div className="absolute inset-y-0 left-0 right-0 border border-slate-100 rounded-lg pointer-events-none"></div>

                                                {/* Actual Progress Bar */}
                                                <div
                                                    className={`absolute left-0 top-0 bottom-0 ${status.bar} opacity-90 rounded-r-md transition-all duration-700 ease-out`}
                                                    style={{ width: `${line.load}%` }}
                                                ></div>

                                                {/* Label on Top */}
                                                <div className="relative z-10 flex justify-between w-full text-xs font-bold px-2">
                                                    <span className="text-white drop-shadow-md">{line.load}%</span>
                                                    <span className={`text-xs font-bold uppercase ${status.text} drop-shadow-sm bg-white/80 px-1 rounded`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Sub-lines */}
                                        {isExpanded && (
                                            <div className="pl-36 pr-2 mb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                                {line.subLines.map((sub, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <span className="w-16 text-[10px] font-mono text-slate-500 text-right">{sub.name}</span>
                                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${status.bar} opacity-60`}
                                                                style={{ width: `${sub.load}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-600 w-8">{sub.load}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Summary Section */}
                <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-4 h-full max-h-[400px]">
                    {viewMode === 'overall' ? (
                        <>
                            {/* Card 1: Total Output */}
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className="fa-solid fa-industry text-4xl text-indigo-600"></i>
                                </div>
                                <span className="text-xs text-indigo-500 font-bold uppercase block mb-1">Current Quarter Labor Days</span>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-black text-indigo-700">4,000</span>
                                    <span className="text-sm text-indigo-600 font-bold">Days</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white inline-block px-1.5 py-0.5 rounded shadow-sm border border-indigo-50">
                                    <i className="fa-solid fa-arrow-trend-up"></i>
                                    ↑ 14.3% QoQ
                                </div>
                            </div>
                            {/* Card 2: Efficiency */}
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className="fa-solid fa-stopwatch text-4xl text-emerald-600"></i>
                                </div>
                                <span className="text-xs text-emerald-600 font-bold uppercase block mb-1">Avg Lead Time (Current)</span>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-black text-emerald-700">42</span>
                                    <span className="text-sm text-emerald-600 font-bold">Days</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-white inline-block px-1.5 py-0.5 rounded shadow-sm border border-emerald-50">
                                    <i className="fa-solid fa-bolt"></i>
                                    ↓ 3d vs Q3
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Line View Summary Stats (Replacing old list) */
                        <div className="mt-0 p-4 bg-slate-50 rounded-xl border border-slate-100 h-full flex flex-col justify-center gap-6">
                            <div>
                                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Total Available Capacity</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-slate-700">{summaryStats.capacity}</span>
                                    <span className="text-sm text-slate-500 font-bold">Days</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Based on {selectedLines.length} selected lines</p>
                            </div>

                            <div className="w-full h-px bg-slate-200"></div>

                            <div>
                                <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Avg Occupancy Rate</span>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-3xl font-black ${summaryStats.avgLoad > 80 ? 'text-orange-500' : 'text-emerald-600'}`}>
                                        {summaryStats.avgLoad}%
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Weighted average across selection</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Note - Always Visible at bottom of container */}
            <div className="px-1 mt-auto pt-3 border-t border-slate-100 shrink-0">
                <p className="text-[10px] text-slate-400 font-medium leading-tight text-center lg:text-left">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    {getFootnote()}
                </p>
            </div>
        </div>
    );
};

export default FactoryOutputWidget;
