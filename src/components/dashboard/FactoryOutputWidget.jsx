import React, { useState, useMemo, useEffect } from 'react';
import {
    Chart as ChartJS, registerables
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '../../contexts/LanguageContext';
import TitleWithIcon from '../common/TitleWithIcon';

ChartJS.register(...registerables, ChartDataLabels);

// --- Parsing Helpers ---
const parseOutput = (str) => {
    if (!str) return 0;
    if (typeof str === 'number') return str;
    const val = parseFloat(str);
    if (str.includes('M')) return val * 1000000;
    if (str.includes('k')) return val * 1000;
    return val;
};

const formatOutput = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
};

// --- Mock Data Generator ---
const getProductionLines = (isZh) => [
    {
        id: 'liquid_sachet',
        name: isZh ? '液体条包' : 'Liquid Sachet',
        color: '#f97316',
        load: 88,
        totalOutput: '1.2M', unit: 'ml',
        // Trends: Q1, Q2, Q3, Q4
        outputTrend: [950000, 1050000, 1100000, 1200000],
        leadTimeTrend: [48, 46, 45, 42],
        subLines: isZh ? [{ name: '一号线', load: 95 }, { name: '二号线', load: 81 }] : [{ name: 'LS-01', load: 95 }, { name: 'LS-02', load: 81 }]
    },
    {
        id: 'liquid_pouch',
        name: isZh ? '液体袋' : 'Liquid Pouch',
        color: '#ef4444',
        load: 82,
        totalOutput: '850k', unit: 'ml',
        outputTrend: [600000, 700000, 750000, 850000],
        leadTimeTrend: [50, 48, 48, 46],
        subLines: isZh ? [{ name: '一号线', load: 85 }, { name: '二号线', load: 79 }] : [{ name: 'LP-A', load: 85 }, { name: 'LP-B', load: 79 }]
    },
    {
        id: 'gel_candy',
        name: isZh ? '软糖' : 'Gel Candy',
        color: '#eab308',
        load: 75,
        totalOutput: '500k', unit: 'pcs',
        outputTrend: [400000, 450000, 480000, 500000],
        leadTimeTrend: [35, 34, 32, 30],
        subLines: isZh ? [{ name: '一号线', load: 75 }] : [{ name: 'GC-01', load: 75 }]
    },
    {
        id: 'tablets',
        name: isZh ? '片剂' : 'Tablets',
        color: '#10b981',
        load: 70,
        totalOutput: '15M', unit: 'pcs',
        outputTrend: [12000000, 13500000, 14500000, 15000000],
        leadTimeTrend: [28, 27, 26, 25],
        subLines: isZh ? [{ name: '一号线', load: 72 }, { name: '二号线', load: 68 }] : [{ name: 'TB-X', load: 72 }, { name: 'TB-Y', load: 68 }]
    },
    {
        id: 'sachet_filling',
        name: isZh ? '条包充填' : 'Sachet Filling',
        color: '#06b6d4',
        load: 65,
        totalOutput: '900k', unit: 'g',
        outputTrend: [800000, 850000, 880000, 900000],
        leadTimeTrend: [40, 39, 38, 38],
        subLines: isZh ? [{ name: '一号线', load: 60 }, { name: '二号线', load: 70 }] : [{ name: 'SF-1', load: 60 }, { name: 'SF-2', load: 70 }]
    },
    {
        id: 'hard_cap',
        name: isZh ? '硬胶囊' : 'Hard Cap',
        color: '#3b82f6',
        load: 60,
        totalOutput: '5.0M', unit: 'pcs',
        outputTrend: [4200000, 4500000, 4800000, 5000000],
        leadTimeTrend: [32, 31, 30, 29],
        subLines: isZh ? [{ name: '一号线', load: 60 }] : [{ name: 'HC-Line', load: 60 }]
    },
    {
        id: 'soft_cap',
        name: isZh ? '软胶囊' : 'Soft Cap',
        color: '#8b5cf6',
        load: 55,
        totalOutput: '3.2M', unit: 'pcs',
        outputTrend: [2800000, 3000000, 3100000, 3200000],
        leadTimeTrend: [45, 44, 42, 40],
        subLines: isZh ? [{ name: '一号线', load: 55 }] : [{ name: 'SC-Line', load: 55 }]
    },
    {
        id: 'square_sachet',
        name: isZh ? '方袋' : 'Square Sachet',
        color: '#d946ef',
        load: 45,
        totalOutput: '400k', unit: 'g',
        outputTrend: [300000, 320000, 380000, 400000],
        leadTimeTrend: [55, 52, 50, 48],
        subLines: isZh ? [{ name: '一号线', load: 45 }] : [{ name: 'SS-01', load: 45 }]
    },
    {
        id: 'packing',
        name: isZh ? '包装/瓶装' : 'Packing/Bottle',
        color: '#64748b',
        load: 40,
        totalOutput: '120k', unit: 'units',
        outputTrend: [100000, 110000, 115000, 120000],
        leadTimeTrend: [20, 19, 18, 18],
        subLines: isZh ? [{ name: '主线', load: 40 }] : [{ name: 'PK-Main', load: 40 }]
    }
];

const FactoryOutputWidget = () => {
    const { language } = useLanguage();
    const isZh = language === 'zh';
    const dayUnit = isZh ? '天' : 'd';

    // View States
    const [viewMode, setViewMode] = useState('overall'); // 'overall' | 'line'

    // Trend View Filter State (New)
    const [trendSelection, setTrendSelection] = useState('all'); // 'all' or line.id

    // Ranking View Filter States
    const [selectedLineIds, setSelectedLineIds] = useState([]);
    const [expandedLineIds, setExpandedLineIds] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const fullProductionLines = useMemo(() => getProductionLines(isZh), [isZh]);

    // Initial Logic for 'line' view selection
    useEffect(() => {
        if (viewMode === 'line') {
            const sorted = [...fullProductionLines].sort((a, b) => b.load - a.load);
            const n = sorted.length;
            if (n <= 5) {
                setSelectedLineIds(sorted.map(l => l.id));
            } else {
                const top = sorted[0];
                const median = sorted[Math.floor(n / 2)];
                const bottom3 = sorted.slice(n - 3);
                const selected = new Set([top.id, median.id, ...bottom3.map(l => l.id)]);
                setSelectedLineIds(Array.from(selected));
            }
        }
    }, [viewMode]);

    // Common Labels
    const labels = isZh ? ['一季度', '二季度', '三季度', '四季度（当前）'] : ['Q1', 'Q2', 'Q3', 'Q4 (Current)'];

    // --- Data Calculation for Trend View ---
    const trendData = useMemo(() => {
        let outputData = [0, 0, 0, 0];
        let leadTimeData = [0, 0, 0, 0];
        let unit = isZh ? '单位' : 'Units';
        let count = 0;

        if (trendSelection === 'all') {
            // Aggregate all lines
            if (fullProductionLines && fullProductionLines.length > 0) {
                fullProductionLines.forEach(line => {
                    if (line.outputTrend) {
                        line.outputTrend.forEach((val, idx) => {
                            if (outputData[idx] !== undefined) outputData[idx] += val;
                        });
                    }
                    if (line.leadTimeTrend) {
                        line.leadTimeTrend.forEach((val, idx) => {
                            if (leadTimeData[idx] !== undefined) leadTimeData[idx] += val;
                        });
                    }
                });
                // Average lead time
                leadTimeData = leadTimeData.map(val => Math.round(val / fullProductionLines.length));
            }
        } else {
            // Specific line
            const line = fullProductionLines.find(l => l.id === trendSelection);
            if (line) {
                outputData = [...(line.outputTrend || [0, 0, 0, 0])];
                leadTimeData = [...(line.leadTimeTrend || [0, 0, 0, 0])];
                unit = line.unit;
            }
        }

        // Calculate Comparisons (Q4 vs Q3)
        const q4Output = outputData[3] || 0;
        const q3Output = outputData[2] || 0;
        const outputDiff = q4Output - q3Output;
        const outputDiffPct = q3Output > 0 ? ((outputDiff / q3Output) * 100).toFixed(1) : 0;

        const q4Lead = leadTimeData[3] || 0;
        const q3Lead = leadTimeData[2] || 0;
        const leadDiff = q4Lead - q3Lead;

        return {
            outputData,
            leadTimeData,
            unit,
            q4Output: formatOutput(q4Output),
            q4Lead,
            outputDiffPct,
            leadDiff,
            isOutputUp: outputDiff >= 0,
            isLeadImproved: leadDiff <= 0
        };
    }, [trendSelection, fullProductionLines, isZh]);

    // --- Chart Config for Trend View ---
    const overallChartData = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: isZh ? '季度产出' : 'Quarterly Output',
                data: trendData.outputData,
                backgroundColor: (ctx) => ctx.dataIndex === 3 ? '#6366f1' : '#cbd5e1',
                barThickness: 40,
                borderRadius: 4,
                yAxisID: 'yOutput',
                order: 2,
                datalabels: {
                    color: (ctx) => ctx.dataIndex === 3 ? '#6366f1' : '#64748b',
                    font: { weight: 'bold' },
                    anchor: 'end',
                    align: 'top',
                    offset: -4,
                    formatter: (val) => formatOutput(val)
                }
            },
            {
                type: 'line',
                label: isZh ? '平均交付周期' : 'Avg Lead Time',
                data: trendData.leadTimeData,
                borderColor: '#10b981',
                backgroundColor: '#10b981',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'yTime',
                order: 1,
                tension: 0.3,
                datalabels: {
                    color: '#10b981',
                    align: 'top',
                    anchor: 'start',
                    offset: 6,
                    font: { weight: 'bold' },
                    formatter: (val) => `${val}${dayUnit}`
                }
            }
        ]
    };

    const overallOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.type === 'bar') {
                            return isZh
                                ? ` 产出：${formatOutput(ctx.raw)} ${trendData.unit}`
                                : ` Output: ${formatOutput(ctx.raw)} ${trendData.unit}`;
                        }
                        return isZh
                            ? ` 周期：${ctx.raw} ${dayUnit}`
                            : ` Lead Time: ${ctx.raw} ${dayUnit}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { weight: 'bold', size: 12 }, color: '#475569' }
            },
            yOutput: {
                type: 'linear', display: true, position: 'left', beginAtZero: true,
                title: { display: true, text: isZh ? `产出 (${trendData.unit})` : `Output (${trendData.unit})`, color: '#6366f1' },
                grid: { borderDash: [4, 4], color: '#f1f5f9' }
            },
            yTime: {
                type: 'linear', display: true, position: 'right', beginAtZero: true,
                suggestedMax: 60,
                min: 0,
                title: { display: true, text: isZh ? '交付周期 (天)' : 'Lead Time (Days)', color: '#10b981' },
                grid: { display: false }
            }
        }
    };

    // --- Derived Data for Ranking View ---
    const selectedLines = useMemo(() => {
        return fullProductionLines
            .filter(line => selectedLineIds.includes(line.id))
            .sort((a, b) => b.load - a.load);
    }, [selectedLineIds, fullProductionLines]);

    const rankingSummary = useMemo(() => {
        if (selectedLines.length === 0) return { totalOutput: 0, maxCapacity: 0, avgFulfillment: 0, unit: '' };
        let totalOutputVal = 0;
        let maxCapacityVal = 0;
        const units = new Set();

        selectedLines.forEach(line => {
            const out = parseOutput(line.totalOutput);
            const cap = out / (line.load / 100);
            totalOutputVal += out;
            maxCapacityVal += cap;
            units.add(line.unit);
        });

        const displayUnit = units.size === 1 ? Array.from(units)[0] : (isZh ? '单位' : 'Units');
        const avgFulfillment = maxCapacityVal > 0 ? (totalOutputVal / maxCapacityVal) * 100 : 0;

        return {
            totalOutput: formatOutput(totalOutputVal),
            maxCapacity: formatOutput(maxCapacityVal),
            avgFulfillment: avgFulfillment.toFixed(1),
            unit: displayUnit
        };
    }, [selectedLines, isZh]);


    // --- Helpers ---
    const toggleLineSelection = (id) => {
        if (selectedLineIds.includes(id)) {
            if (selectedLineIds.length > 1) {
                setSelectedLineIds(prev => prev.filter(lineId => lineId !== id));
            }
        } else {
            if (selectedLineIds.length < 5) setSelectedLineIds(prev => [...prev, id]);
        }
    };

    const toggleAccordion = (id) => {
        setExpandedLineIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const getStatusColor = (load) => {
        if (load > 80) return { bar: 'bg-orange-500', text: 'text-orange-600', label: isZh ? '高' : 'High' };
        if (load >= 60) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: isZh ? '正常' : 'Optimal' };
        return { bar: 'bg-slate-300', text: 'text-slate-500', label: isZh ? '低' : 'Low' };
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 shrink-0">
                <div className="flex items-center gap-2">
                    <div>
                        <TitleWithIcon as="h3" size="sm" iconClass="fa-solid fa-industry" className="font-bold text-slate-700 leading-none">
                            {viewMode === 'overall'
                                ? (isZh ? '2D 季度产出与效率趋势' : '2D. Quarterly Output & Efficiency Trends')
                                : (isZh ? '2D 当前产线负荷排行' : '2D. Current Production Load Ranking')}
                        </TitleWithIcon>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">
                            {viewMode === 'overall'
                                ? (isZh ? '历史趋势分析' : 'Historical Trend Analysis')
                                : (isZh ? '实时负载监控' : 'Real-time Load Monitoring')
                            }
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {/* View Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('overall')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'overall' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {isZh ? '整体工厂' : 'Factory Trend'}
                        </button>
                        <button
                            onClick={() => setViewMode('line')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'line' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {isZh ? '按产线' : 'Line Ranking'}
                        </button>
                    </div>

                    {/* Filter for Trend View */}
                    {viewMode === 'overall' && (
                        <div className="relative z-10">
                            <select
                                value={trendSelection}
                                onChange={(e) => setTrendSelection(e.target.value)}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer appearance-none pr-8"
                                style={{ backgroundImage: 'none' }}
                            >
                                <option value="all">{isZh ? '全部工厂 (All Factory)' : 'All Factory'}</option>
                                {fullProductionLines.map(line => (
                                    <option key={line.id} value={line.id}>{line.name}</option>
                                ))}
                            </select>
                            <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none"></i>
                        </div>
                    )}

                    {/* Filter for Ranking View */}
                    {viewMode === 'line' && (
                        <div className="relative z-10">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm"
                            >
                                <i className="fa-solid fa-filter text-slate-400"></i>
                                {isZh ? `选择产线（${selectedLineIds.length}）` : `Select Lines (${selectedLineIds.length})`}
                                <i className={`fa-solid fa-chevron-down ml-1 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {isFilterOpen && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl p-2 max-h-60 overflow-y-auto z-20">
                                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">{isZh ? '产线类别' : 'Production Categories'}</div>
                                    {fullProductionLines.map(line => {
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
                            data={overallChartData}
                            options={overallOptions}
                        />
                    ) : (
                        <div className="flex flex-col gap-4 mt-2">
                            {selectedLines.map(line => {
                                const status = getStatusColor(line.load);
                                const isExpanded = expandedLineIds.includes(line.id);
                                return (
                                    <div key={line.id} className="w-full">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-32 flex-shrink-0 flex items-center gap-1.5">
                                                <button onClick={() => toggleAccordion(line.id)} className="w-4 h-4 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 transition-colors">
                                                    <i className={`fa-solid fa-plus text-[10px] transition-transform ${isExpanded ? 'rotate-45' : ''}`}></i>
                                                </button>
                                                <span className="text-xs font-bold text-slate-700 truncate" title={line.name}>{line.name}</span>
                                            </div>
                                            <div className="flex-1 h-8 bg-slate-50 rounded-lg relative overflow-hidden flex items-center px-2 group cursor-default" title={isZh ? `负荷: ${line.load}%` : `Load: ${line.load}%`}>
                                                <div className="absolute inset-y-0 left-0 right-0 border border-slate-100 rounded-lg pointer-events-none"></div>
                                                <div className={`absolute left-0 top-0 bottom-0 ${status.bar} opacity-90 rounded-r-md transition-all duration-700 ease-out`} style={{ width: `${line.load}%` }}></div>
                                                <div className="relative z-10 flex justify-between w-full text-xs font-bold px-2">
                                                    <span className="text-white drop-shadow-md flex items-baseline gap-1">
                                                        {line.totalOutput} <span className="text-[10px] opacity-90 font-medium">{line.unit}</span>
                                                    </span>
                                                    <span className={`text-xs font-bold uppercase ${status.text} drop-shadow-sm bg-white/80 px-1 rounded`}>{status.label}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {isExpanded && (
                                            <div className="pl-36 pr-2 mb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                                {line.subLines.map((sub, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <span className="w-16 text-[10px] font-mono text-slate-500 text-right">{sub.name}</span>
                                                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${status.bar} opacity-60`} style={{ width: `${sub.load}%` }}></div>
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
                            {/* Card 1: Quarterly Output */}
                            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className="fa-solid fa-box-open text-4xl text-indigo-600"></i>
                                </div>
                                <span className="text-xs text-indigo-500 font-bold uppercase block mb-1">{isZh ? '本季度产出' : 'Current Quarter Output'}</span>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-black text-indigo-700">{trendData.q4Output}</span>
                                    <span className="text-sm text-indigo-600 font-bold">{trendData.unit}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white inline-block px-1.5 py-0.5 rounded shadow-sm border border-indigo-50">
                                    <i className={`fa-solid ${trendData.isOutputUp ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
                                    {trendData.isOutputUp ? '+' : ''}{trendData.outputDiffPct}% {isZh ? '环比' : 'QoQ'}
                                </div>
                            </div>
                            {/* Card 2: Efficiency */}
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className="fa-solid fa-stopwatch text-4xl text-emerald-600"></i>
                                </div>
                                <span className="text-xs text-emerald-600 font-bold uppercase block mb-1">{isZh ? '当前平均交付周期' : 'Avg Lead Time (Current)'}</span>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-black text-emerald-700">{trendData.q4Lead}</span>
                                    <span className="text-sm text-emerald-600 font-bold">{dayUnit}</span>
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold bg-white inline-block px-1.5 py-0.5 rounded shadow-sm border ${trendData.isLeadImproved ? 'text-emerald-600 border-emerald-50' : 'text-orange-500 border-orange-50'}`}>
                                    <i className="fa-solid fa-bolt"></i>
                                    {trendData.isLeadImproved ? 'Improved' : 'Slower'} {Math.abs(trendData.leadDiff)}{dayUnit} vs Q3
                                </div>
                            </div>
                        </>
                    ) : (
                        /* Ranking Summary Stats */
                        <div className="flex flex-col gap-3">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10"><i className="fa-solid fa-box-open text-3xl text-blue-600"></i></div>
                                <span className="text-[10px] text-blue-500 font-bold uppercase block mb-1 tracking-wide">{isZh ? '预估总产出' : 'TOTAL ESTIMATED OUTPUT'}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-blue-700">{rankingSummary.totalOutput}</span>
                                    <span className="text-xs text-blue-600 font-bold">{rankingSummary.unit}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-slate-200 relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 right-0 p-2 opacity-5"><i className="fa-solid fa-battery-full text-3xl text-slate-800"></i></div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1 tracking-wide">{isZh ? '最大潜在产能' : 'MAX POTENTIAL CAPACITY'}</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-slate-700">{rankingSummary.maxCapacity}</span>
                                    <span className="text-xs text-slate-500 font-bold">{rankingSummary.unit}</span>
                                </div>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-10"><i className="fa-solid fa-percent text-3xl text-emerald-600"></i></div>
                                <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-1 tracking-wide">{isZh ? '平均达成率' : 'AVG FULFILLMENT RATE'}</span>
                                <div className="flex items-baseline gap-1"><span className="text-2xl font-black text-emerald-700">{rankingSummary.avgFulfillment}%</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-1 mt-auto pt-3 border-t border-slate-100 shrink-0">
                <p className="text-[10px] text-slate-400 font-medium leading-tight text-center lg:text-left">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    {viewMode === 'overall'
                        ? (isZh ? '数据基于所选产线的季度历史记录。' : 'Data based on quarterly history of selected lines.')
                        : (isZh ? '默认视图显示 1 个最高、1 个中位、3 个最低产线（按当前负荷）。' : 'Default view showing 1 Top, 1 Median, and 3 Bottom lines by current occupancy.')
                    }
                </p>
            </div>
        </div>
    );
};

export default FactoryOutputWidget;
