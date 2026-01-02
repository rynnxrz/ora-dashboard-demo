import React, { useState, useRef, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    LineElement, PointElement, ArcElement
} from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import FactoryOutputWidget from './FactoryOutputWidget';
import { LEAD_TIME_CONTRACTS } from '../../data/mockData';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend, ChartDataLabels
);

const ProcessLeadTimeWidget = () => {
    const { t, language } = useLanguage();
    // --- State ---
    const chartRef = useRef(null);

    // --- Metrics Calculation (New Logic) ---
    // 1. Overall Median Cycle: (Signing Date -> Shipping Date)
    // 2. On-time Delivery Rate: (Duration <= 90 Days)
    const metrics = useMemo(() => {
        const sorted = [...LEAD_TIME_CONTRACTS].sort((a, b) => a.duration - b.duration);
        const count = sorted.length;
        const mid = Math.floor(count / 2);
        const median = count % 2 !== 0 ? sorted[mid].duration : (sorted[mid - 1].duration + sorted[mid].duration) / 2;

        const onTimeCount = sorted.filter(c => c.duration <= 90).length;
        const onTimeRate = Math.round((onTimeCount / count) * 100);

        return { median, onTimeRate, onTimeCount, totalCount: count };
    }, []);

    const [selectedStageIndex, setSelectedStageIndex] = useState(null); // P2-A Stage Selection
    const [selectedLine, setSelectedLine] = useState(null);       // P2-B Line Selection

    // Helper to switch selections
    const handleStageClick = (index) => {
        setSelectedStageIndex(index === selectedStageIndex ? null : index);
        // Independent states: Don't clear selectedLine
    };

    const handleLineClick = (line) => {
        setSelectedLine(line.name === selectedLine?.name ? null : line);
        // Independent states: Don't clear selectedStageIndex
    };

    // --- 1. MOCK DATA (P2-A & Drill-down) ---
    const stages = [
        {
            label: 'S1 Contract', fullLabel: 'S1 合同录入',
            target: 2, actual: 5, q3Actual: 4, breach: 75, q3Breach: 40,
            totalCount: 20, breachCount: 15,
            topContributors: [
                { id: 'CNT-2410-092', time: 10, gap: 8, days: 10 },
                { id: 'CNT-2410-105', time: 7, gap: 5, days: 7 },
                { id: 'CNT-2410-101', time: 5, gap: 3, days: 5 }
            ]
        },
        {
            label: 'S2 Payment', fullLabel: 'S2 回款确认',
            target: 4, actual: 10, q3Actual: 5, breach: 85, q3Breach: 65,
            totalCount: 20, breachCount: 17,
            topContributors: [
                { id: 'PAY-2411-003', time: 15, gap: 11, days: 15 },
                { id: 'PAY-2411-015', time: 12, gap: 8, days: 12 },
                { id: 'PAY-2411-009', time: 10, gap: 6, days: 10 }
            ]
        },
        {
            label: 'S3 Material', fullLabel: 'S3 物料准备',
            target: 10, actual: 11, q3Actual: 11, breach: 30, q3Breach: 25,
            totalCount: 20, breachCount: 6,
            topContributors: [
                { id: 'MAT-2411-A01', time: 15, gap: 5, days: 15 },
                { id: 'MAT-2411-B09', time: 13, gap: 3, days: 13 }
            ]
        },
        {
            label: 'S4 Production', fullLabel: 'S4 生产排产',
            target: 15, actual: 15.2, q3Actual: 16, breach: 5, q3Breach: 15, // +0.2d (Avg), 5% Breach (1/20) - Healthy but with 1 issue
            totalCount: 20, breachCount: 1,
            topContributors: [
                { id: 'C2411-L05', time: 22, gap: 7, days: 15, planDate: '11-10', actDate: '12-02' } // Planned 15d, Actual 22d -> 7d Delay
            ]
        },
        {
            label: 'S5 Shipping', fullLabel: 'S5 出货排车',
            target: 5, actual: 5, q3Actual: 5.5, breach: 0, q3Breach: 4,
            totalCount: 20, breachCount: 0,
            topContributors: []
        }
    ];

    // --- 2. MOCK DATA (P2-B Bottlenecks) ---
    const productionLines = [
        {
            name: 'Liquids Line',
            adherence: 75, total: 4, passed: 3, delay: 1.75, status: 'CRITICAL',
            impactDays: 7, // 1 contract * 7 days delay
            avgDelay: 1.75, // 7 / 4
            topContributors: [
                { id: 'C2411-L05', status: 'S4 Production', days: 15, planDate: '11-10', actDate: '12-02', gap: 7 } // Planned 15d
            ]
        },
        {
            name: 'Powder Line',
            adherence: 100, total: 8, passed: 8, delay: 0.0, status: 'STABLE',
            impactDays: 0,
            avgDelay: 0,
            topContributors: []
        },
        { name: 'Capsules Line', adherence: 100, total: 8, passed: 8, delay: 0, status: 'STABLE', impactDays: 0, avgDelay: 0 }
    ];
    // Filter and Sort
    const visibleBottlenecks = productionLines
        .filter(l => l.adherence < 100 || l.impactDays > 0)
        .sort((a, b) => b.impactDays - a.impactDays);


    // --- 3. Color Logic ---
    const getStatusColor = (breachRate) => {
        if (breachRate > 50) return '#ef4444'; // Red
        if (breachRate > 20) return '#f97316'; // Orange
        return '#10b981';                      // Emerald
    };

    // --- 4. Chart Data Preparation (Left Chart) ---
    let currentStart = 0;
    const timeData = stages.map(s => {
        const start = currentStart;
        currentStart += s.actual;
        return [start, start + s.actual];
    });

    const targetMarkers = stages.map((s, i) => {
        const start = timeData[i][0];
        const targetEnd = start + s.target;
        return [targetEnd - 0.1, targetEnd + 0.1];
    });

    const chartData = {
        labels: stages.map(s => s.label),
        datasets: [
            {
                label: '目标 (Target)',
                data: targetMarkers,
                backgroundColor: '#0f172a',
                barThickness: 40,
                grouped: false,
                order: 1,
                datalabels: { display: false }
            },
            {
                label: '实际时长',
                data: timeData,
                backgroundColor: stages.map((s, i) => {
                    const color = getStatusColor(s.breach);
                    if (selectedStageIndex !== null && selectedStageIndex !== i) return color + '40';
                    return color;
                }),
                hoverBackgroundColor: stages.map(s => getStatusColor(s.breach)),
                borderRadius: 4,
                barThickness: 24,
                grouped: false,
                order: 2,
                datalabels: {
                    display: true,
                    align: 'top',
                    anchor: 'end',
                    offset: 4,
                    color: (ctx) => {
                        if (selectedStageIndex !== null && selectedStageIndex !== ctx.dataIndex) return '#cbd5e1';
                        const s = stages[ctx.dataIndex];
                        return (s.actual - s.target) > 0 ? '#ef4444' : '#10b981';
                    },
                    font: { weight: 'bold', size: 11 },
                    formatter: (v, ctx) => {
                        const s = stages[ctx.dataIndex];
                        const gap = s.actual - s.target;
                        if (gap > 0) return `+${parseFloat(gap.toFixed(1))}d`;
                        if (gap < 0) return `${parseFloat(gap.toFixed(1))}d`;
                        return '✓';
                    }
                }
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                handleStageClick(elements[0].index);
            } else {
                setSelectedStageIndex(null);
            }
        },
        layout: { padding: { top: 40, bottom: 0 } },
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.label === '目标 (Target)') return ` 目标: ${stages[ctx.dataIndex].target}天`;
                        const s = stages[ctx.dataIndex];
                        const gap = s.actual - s.target;
                        return [
                            ` 实际: ${s.actual}天 (目标${s.target}天)`,
                            ` 偏差: ${gap > 0 ? '+' : ''}${gap}天`,
                            ` 异常率: ${s.breach}%`
                        ];
                    }
                }
            },
            datalabels: {
                listeners: {
                    click: (ctx) => {
                        handleStageClick(ctx.dataIndex);
                    }
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 }, color: '#64748b' } },
            y: { display: false, beginAtZero: true }
        }
    };

    // --- 5. Right Chart Data (Trend) ---
    const rightBarColors = stages.map(s => getStatusColor(s.breach));
    const activeRightColors = stages.map((s, i) =>
        selectedStageIndex !== null && selectedStageIndex !== i ? '#f1f5f9' : rightBarColors[i]
    );

    const breachTrendData = {
        labels: stages.map(s => s.label),
        datasets: [
            {
                label: '本季异常率',
                data: stages.map(s => s.breach),
                backgroundColor: activeRightColors,
                borderRadius: 3,
                barThickness: 12,
                order: 1
            },
            {
                label: '上季度异常率',
                data: stages.map(s => s.q3Breach),
                backgroundColor: '#cbd5e1',
                borderRadius: 2,
                barThickness: 8,
                grouped: true,
                order: 2
            }
        ]
    };

    const breachTrendOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: { display: false },
            tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}%` } }
        },
        scales: {
            x: { display: false, max: 100 },
            y: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#64748b' } }
        }
    };

    // --- 6. Diagnosis Content ---
    const getDiagnosisContent = () => {
        // [CASE A REMOVED: Line Diagnosis now handled by inline accordion]

        // CASE B: Stage Diagnosis (P2-A Selection)
        if (selectedStageIndex !== null) {
            const s = stages[selectedStageIndex];
            const gap = s.actual - s.target;
            const trendDiff = s.breach - s.q3Breach;
            const isCritical = s.breach > 20;

            return (
                <div className="animate-in fade-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2 flex-shrink-0">
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">{language === 'zh' ? s.fullLabel : s.label}</h4>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{t('p2_stage_diagnosis')}</p>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${s.breach > 50 ? 'bg-red-50 text-red-600 border-red-100' :
                            s.breach > 20 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>

                            {t(s.breach > 50 ? 'p2_status_critical' : s.breach > 20 ? 'p2_status_warning' : 'p2_status_healthy')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
                        <div className="bg-slate-50 border border-slate-100 p-2 rounded">
                            <span className="text-[10px] text-slate-500 block">{t('p2_avg_time')}</span>
                            <div className="flex items-baseline gap-1">
                                <span className="font-bold text-slate-800">{s.actual}d</span>
                                <span className={`text-[10px] font-bold ${gap > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {gap > 0 ? `+${parseFloat(gap.toFixed(1))}d` : `${parseFloat(gap.toFixed(1))}d`}
                                </span>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-2 rounded">
                            <span className="text-[10px] text-slate-500 block">{t('p2_breach_rate')}</span>
                            <div className="flex items-baseline gap-1 items-end">
                                <span className="font-bold text-slate-800">{s.breach}%</span>
                                <span className="text-[10px] text-slate-400 font-medium ml-1">
                                    ({s.breachCount}/{s.totalCount})
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar min-h-0">
                        {isCritical ? (
                            <>
                                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-2 flex items-center gap-1 sticky top-0 bg-white z-10">
                                    <i className="fa-solid fa-triangle-exclamation text-red-400"></i>
                                    {t('p2_top_contributors')}
                                </h5>
                                <div className="space-y-1 pb-2">
                                    {s.topContributors.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-default group">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded bg-slate-100 text-[9px] text-slate-500 flex items-center justify-center font-bold">{idx + 1}</span>
                                                <div>
                                                    <div className="font-medium text-slate-700 font-mono group-hover:text-indigo-600 transition-colors">{item.id}</div>
                                                    {item.days && <span className="text-[9px] text-slate-400">Planned: {item.days}d</span>}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-slate-500 mr-2">{item.time}d</span>
                                                <span className="font-bold text-red-500">+{item.gap}d</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-emerald-100 bg-emerald-50/30 rounded-lg border-dashed">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                                    <i className="fa-solid fa-check text-emerald-500 text-sm"></i>
                                </div>
                                <h5 className="font-bold text-emerald-800 text-sm">{t('p2_running_smoothly')}</h5>
                                <p className="text-[10px] text-emerald-600 mt-1 max-w-[160px] leading-tight">
                                    {t('p2_running_smoothly_desc')
                                        .replace('{stage}', language === 'zh' ? s.fullLabel.split(' ')[1] : s.label)
                                        .replace('{count}', `${s.breachCount}/${s.totalCount}`)
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )
        }

        return (
            <div className="h-full flex flex-col">
                <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-chart-pie text-indigo-500"></i> {t('p2_overall_overview_title')}
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-xs text-slate-400 block mb-1">{t('p2_median_cycle_label')}</span>
                        <span className="text-xl font-black text-slate-800">{metrics.median}<small className="text-xs text-slate-500 ml-1">Days</small></span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-xs text-slate-400 block mb-1">{t('p2_ontime_rate_label')}</span>
                        {/* Logic: Duration <= 90 days = On-time */}
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-emerald-600">{metrics.onTimeRate}<small className="text-xs text-emerald-500 ml-1">%</small></span>
                            <span className="text-[10px] text-slate-400 font-medium">({metrics.onTimeCount}/{metrics.totalCount})</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded border border-slate-100 p-3 flex items-start gap-3">
                    <i className="fa-solid fa-circle-info text-slate-300 mt-0.5"></i>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        <b className="text-slate-700">{t('p2_tip_label')}</b> <br />
                        <span dangerouslySetInnerHTML={{
                            __html: t('p2_tip_content')
                                .replace('<red>', '<span class="text-red-500 font-bold">')
                                .replace('</red>', '</span>')
                                .replace('<rose>', '<span class="text-rose-500 font-bold">')
                                .replace('</rose>', '</span>')
                        }} />
                    </p>
                </div>
            </div>
        );
    }



    return (
        <div className="p-6 bg-slate-50 font-sans">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{t('p2_deep_dive_title')}</h2>
                    {language === 'zh' && <span className="text-slate-400 text-sm font-medium">Lead Time Deep Dive</span>}
                </div>
                <p className="text-slate-500 text-sm mt-1">
                    {t('p2_median_cycle_label')}: <b className="text-slate-800">{metrics.median} {language === 'en' ? 'Days' : '天'}</b>
                    <span className="mx-2 text-slate-300">|</span>
                    {t('p2_ontime_rate_label')}: <b className="text-emerald-600">{metrics.onTimeRate}%</b>
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT CHART: P2-A */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
                            <div>
                                <h3 className="font-bold text-slate-700 leading-none">P2-A. 阶段耗时监控</h3>
                                <p className="text-[10px] text-slate-400 mt-1">颜色代表异常率 (Red=Unstable)</p>
                            </div>
                        </div>
                        <div className="flex gap-3 text-[10px] font-medium text-slate-500">
                            <div className="flex items-center gap-1"><div className="w-3 h-1 bg-slate-900"></div>目标线</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div>极不稳定</div>
                            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div>健康稳定</div>
                        </div>
                    </div>

                    <div className="px-6 pt-6 pb-2 flex-1 relative h-[300px]">
                        <Bar ref={chartRef} data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* RIGHT PANEL: DIAGNOSIS */}
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col h-full">
                        <div className="flex-1 min-h-0 mb-4 overflow-hidden flex flex-col">
                            {getDiagnosisContent()}
                        </div>
                        <div className="h-[1px] bg-slate-100 mb-4 w-full flex-shrink-0"></div>
                        <div className="h-[140px] flex-shrink-0 flex flex-col">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">各阶段异常趋势 (对比上季)</span>
                                <div className="flex gap-2 text-[9px] text-slate-400">
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></span>Current</span>
                                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-slate-300 rounded-sm"></span>Last Q</span>
                                </div>
                            </div>
                            <div className="flex-1 relative">
                                <Bar data={breachTrendData} options={breachTrendOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM GRID: P2-B */}
            <div className="grid grid-cols-1 gap-6 mt-6">
                {/* P2-B: BOTTLENECKS (RANKING LIST) */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
                            <div>
                                <h3 className="font-bold text-slate-700 leading-none uppercase">P2-B. PRODUCTION LINE EFFICIENCY <span className="text-slate-400 text-xs font-normal normal-case ml-1">(Sorted by Cumulative Delays)</span></h3>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Filter: Current Quarter</p>
                            </div>
                        </div>
                    </div>

                    {/* Ranking Table Header */}
                    <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 border-b border-slate-100 pb-2 mb-2 px-2 uppercase">
                        <div className="col-span-4">Line</div>
                        <div className="col-span-4">On-time Adherence</div>
                        <div className="col-span-3 text-right">Cumulative / Avg Delay</div>
                        <div className="col-span-1 text-right">Status</div>
                    </div>

                    {/* Ranking List Content */}
                    <div className="flex-1 overflow-auto custom-scrollbar space-y-2 p-1">
                        {visibleBottlenecks.map((line, idx) => {
                            const isSelected = selectedLine?.name === line.name;
                            return (
                                <div key={idx} className="transition-all duration-300">
                                    {/* Main Row */}
                                    <div
                                        onClick={() => handleLineClick(line)}
                                        className={`grid grid-cols-12 gap-4 items-center p-2 rounded-lg transition-colors border cursor-pointer relative z-10 ${isSelected
                                            ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm'
                                            : 'hover:bg-slate-50 border-transparent hover:border-slate-100 bg-white'
                                            }`}
                                    >
                                        {/* Name */}
                                        <div className="col-span-4 font-bold text-slate-700 text-sm flex items-center gap-2">
                                            <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold transition-colors ${isSelected ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {idx + 1}
                                            </span>
                                            {line.name}
                                        </div>

                                        {/* Adherence Progess */}
                                        <div className="col-span-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-bold ${line.adherence >= 90 ? 'text-emerald-600' :
                                                    line.adherence >= 80 ? 'text-yellow-600' : 'text-red-600'
                                                    }`}>
                                                    {line.adherence}%
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    ({line.passed}/{line.total})
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${line.adherence >= 90 ? 'bg-emerald-500' :
                                                        line.adherence >= 80 ? 'bg-yellow-400' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${line.adherence}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Impact / Delay */}
                                        <div className="col-span-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className={`font-bold text-xs ${line.impactDays > 20 ? 'text-red-500' : 'text-orange-500'}`}>
                                                    {line.impactDays}d <span className="text-[9px] text-slate-400 font-normal">Cumulative</span>
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">
                                                    {line.avgDelay ? line.avgDelay.toFixed(1) : '0.0'}d Avg Delay
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="col-span-1 text-right flex justify-end items-center gap-2">
                                            {line.status === 'CRITICAL' && <i className="fa-solid fa-triangle-exclamation text-red-500" title="Critical"></i>}
                                            {line.status === 'WARNING' && <i className="fa-solid fa-circle-exclamation text-orange-400" title="Warning"></i>}
                                            {line.status === 'STABLE' && <i className="fa-solid fa-check-circle text-emerald-400" title="Stable"></i>}
                                            {line.status === 'GOOD' && <i className="fa-solid fa-face-smile text-emerald-300" title="Good"></i>}

                                            <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-300 ${isSelected ? 'rotate-180 text-indigo-500' : ''}`}></i>
                                        </div>
                                    </div>

                                    {/* Expanded Detail (Accordion) */}
                                    <div
                                        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
                                    >
                                        <div className="min-h-0 bg-slate-50 rounded-lg border border-slate-100 p-3 ml-4">
                                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200/50">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                                                    Root Cause
                                                </span>
                                            </div>

                                            {line.topContributors?.length > 0 ? (
                                                <div className="space-y-2">
                                                    {line.topContributors.map((c, i) => (
                                                        <div key={i} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-100 shadow-sm">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                                                                        {c.id}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 rounded border border-slate-100">
                                                                        {c.status}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                                                                    <i className="fa-solid fa-clock text-slate-300"></i>
                                                                    Planned: <span className="text-slate-700">{c.days}d</span>
                                                                    <span className="text-slate-300 mx-1">|</span>
                                                                    <span className="text-slate-500">
                                                                        {c.planDate} <i className="fa-solid fa-arrow-right text-[8px] mx-0.5"></i> {c.actDate}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                            <div className="flex items-baseline gap-3 text-[10px]">
                                                                <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded font-bold border border-red-100">
                                                                    Delay +{c.gap}d
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-2 text-xs text-slate-400 italic">No specific contracts identified.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>


            </div>

            {/* P2-C: FACTORY OUTPUT & EFFICIENCY TRENDS */}
            <div className="mt-6">
                <FactoryOutputWidget />
            </div>
        </div>
    );
};

export default ProcessLeadTimeWidget;
