import React, { useState, useRef, useMemo } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    LineElement, PointElement, ArcElement
} from 'chart.js';
import { Bar, Chart, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement,
    Title, Tooltip, Legend, ChartDataLabels
);

const ProcessLeadTimeWidget = () => {
    // --- State ---
    const chartRef = useRef(null);
    const [selectedStageIndex, setSelectedStageIndex] = useState(null); // For interaction

    // --- 1. MOCK DATA (P2-A & Drill-down) ---
    const stages = [
        {
            label: 'S1 Contract', fullLabel: 'S1 合同录入',
            target: 2, actual: 5, q3Actual: 4, breach: 75, q3Breach: 40,
            totalCount: 20, breachCount: 15,
            topContributors: [
                { id: 'CNT-2410-092', time: 12, gap: 10 },
                { id: 'CNT-2410-105', time: 9, gap: 7 },
                { id: 'CNT-2410-101', time: 8, gap: 6 }
            ]
        },
        {
            label: 'S2 Money', fullLabel: 'S2 回款确认',
            target: 4, actual: 10, q3Actual: 5, breach: 85, q3Breach: 65,
            totalCount: 20, breachCount: 17,
            topContributors: [
                { id: 'PAY-2411-003', time: 22, gap: 18 },
                { id: 'PAY-2411-015', time: 18, gap: 14 },
                { id: 'PAY-2411-009', time: 15, gap: 11 }
            ]
        },
        {
            label: 'S3 Material', fullLabel: 'S3 物料准备',
            target: 10, actual: 11, q3Actual: 11, breach: 30, q3Breach: 25,
            totalCount: 20, breachCount: 6,
            topContributors: [
                { id: 'MAT-2411-A01', time: 15, gap: 5 },
                { id: 'MAT-2411-B09', time: 14, gap: 4 }
            ]
        },
        {
            label: 'S4 Production', fullLabel: 'S4 生产排产',
            target: 15, actual: 12, q3Actual: 16, breach: 5, q3Breach: 5,
            totalCount: 20, breachCount: 1,
            topContributors: [
                { id: 'PRD-2411-X99', time: 18, gap: 3 }
            ]
        },
        {
            label: 'S5 Shipping', fullLabel: 'S5 出货排车',
            target: 5, actual: 5, q3Actual: 5.5, breach: 0, q3Breach: 4,
            totalCount: 15, breachCount: 0,
            topContributors: []
        }
    ];

    // --- 2. MOCK DATA (P2-B Bottlenecks) ---
    // Only showing problematic lines
    const productionLines = [
        { name: 'Liquids (液剂)', adherence: 60, total: 20, passed: 8, delay: 12.0, status: 'CRITICAL' },
        { name: 'Powder (粉剂)', adherence: 82, total: 50, passed: 41, delay: 4.5, status: 'WARNING' },
        { name: 'Capsules (胶囊)', adherence: 88, total: 50, passed: 44, delay: 2.0, status: 'STABLE' },
        { name: 'Gummies (软糖)', adherence: 95, total: 100, passed: 95, delay: 0.5, status: 'GOOD' }
    ];
    // Filter and Sort for "Ranking List"
    const bottlenecks = productionLines
        .filter(l => l.adherence < 90 || l.delay > 1.5)
        .sort((a, b) => b.delay - a.delay);


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
                const index = elements[0].index;
                setSelectedStageIndex(index === selectedStageIndex ? null : index);
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
                        const index = ctx.dataIndex;
                        setSelectedStageIndex(index === selectedStageIndex ? null : index);
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
                label: 'S3异常率',
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
        if (selectedStageIndex !== null) {
            const s = stages[selectedStageIndex];
            const gap = s.actual - s.target;
            const trendDiff = s.breach - s.q3Breach;
            const isCritical = s.breach > 20;

            return (
                <div className="animate-in fade-in slide-in-from-right-2 duration-300 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2 flex-shrink-0">
                        <div>
                            <h4 className="font-bold text-slate-800 text-base">{s.fullLabel}</h4>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Stage Diagnosis</p>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${s.breach > 50 ? 'bg-red-50 text-red-600 border-red-100' :
                                s.breach > 20 ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                            }`}>
                            {s.breach > 50 ? 'CRITICAL' : s.breach > 20 ? 'WARNING' : 'HEALTHY'}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
                        <div className="bg-slate-50 border border-slate-100 p-2 rounded">
                            <span className="text-[10px] text-slate-500 block">平均耗时</span>
                            <div className="flex items-baseline gap-1">
                                <span className="font-bold text-slate-800">{s.actual}d</span>
                                <span className={`text-[10px] font-bold ${gap > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {gap > 0 ? `+${parseFloat(gap.toFixed(1))}d` : `${parseFloat(gap.toFixed(1))}d`}
                                </span>
                            </div>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 p-2 rounded">
                            <span className="text-[10px] text-slate-500 block">异常率 (Breach)</span>
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
                                    Top Delay Contributors
                                </h5>
                                <div className="space-y-1 pb-2">
                                    {s.topContributors.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-default group">
                                            <div className="flex items-center gap-2">
                                                <span className="w-4 h-4 rounded bg-slate-100 text-[9px] text-slate-500 flex items-center justify-center font-bold">{idx + 1}</span>
                                                <span className="font-medium text-slate-700 font-mono group-hover:text-indigo-600 transition-colors">{item.id}</span>
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
                                <h5 className="font-bold text-emerald-800 text-sm">运行平稳</h5>
                                <p className="text-[10px] text-emerald-600 mt-1 max-w-[160px] leading-tight">
                                    {s.label}阶段运行平稳 (异常数: {s.breachCount}/{s.totalCount})，无显著异常波动。
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
                    <i className="fa-solid fa-chart-pie text-indigo-500"></i> 全流程概览
                </h4>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-xs text-slate-400 block mb-1">总平均周期</span>
                        <span className="text-xl font-black text-slate-800">42<small className="text-xs text-slate-500 ml-1">天</small></span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-xs text-slate-400 block mb-1">准时交付率</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-emerald-600">82<small className="text-xs text-emerald-500 ml-1">%</small></span>
                            <span className="text-[10px] text-slate-400 font-medium">(82/100)</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-white rounded border border-slate-100 p-3 flex items-start gap-3">
                    <i className="fa-solid fa-circle-info text-slate-300 mt-0.5"></i>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        <b className="text-slate-700">操作提示：</b> <br />
                        点击左侧柱状图中的 <span className="text-red-500 font-bold">红色异常阶段</span>，即可下钻查看导致拖期的具体合同明细。
                    </p>
                </div>
            </div>
        );
    }

    // --- 7. P4 Component Data (Material Readiness) ---
    const p4Data = {
        labels: ['Ready', 'Waiting', 'High Risk'],
        datasets: [{ data: [85, 10, 5], backgroundColor: ['#2A9D8F', '#E9C46A', '#E76F51'], borderWidth: 0 }]
    };
    const p4Options = { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false }, datalabels: { display: false } } };

    return (
        <div className="p-6 bg-slate-50 font-sans">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">交付周期深度透视</h2>
                    <span className="text-slate-400 text-sm font-medium">Lead Time Deep Dive</span>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                    整体中位周期: <b className="text-slate-800">42 天</b>
                    <span className="mx-2 text-slate-300">|</span>
                    准时交付率: <b className="text-emerald-600">82%</b>
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

            {/* BOTTOM GRID: P2-B & P4 */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                {/* P2-B: BOTTLENECKS (RANKING LIST) - NEW */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                        <div className="w-2 h-6 bg-rose-500 rounded-full"></div>
                        <div>
                            <h3 className="font-bold text-slate-700 leading-none">P2-B. 产线效能警示</h3>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Top Delays by Line (Bottlenecks)</p>
                        </div>
                    </div>

                    {/* Ranking Table Header */}
                    <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 border-b border-slate-100 pb-2 mb-2 px-2">
                        <div className="col-span-4">产线 (Line)</div>
                        <div className="col-span-4">准时交付率 (Adherence)</div>
                        <div className="col-span-3 text-right">平均延迟 (Avg Delay)</div>
                        <div className="col-span-1 text-right">状态</div>
                    </div>

                    {/* Ranking List Content */}
                    <div className="flex-1 overflow-auto custom-scrollbar space-y-1">
                        {bottlenecks.map((line, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-4 items-center p-2 rounded hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                {/* Name */}
                                <div className="col-span-4 font-bold text-slate-700 text-sm flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center font-bold">
                                        {idx + 1}
                                    </span>
                                    {line.name}
                                </div>

                                {/* Adherence Progess */}
                                <div className="col-span-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-xs font-bold ${line.status === 'CRITICAL' ? 'text-red-600' :
                                                line.status === 'WARNING' ? 'text-orange-500' : 'text-slate-600'
                                            }`}>
                                            {line.adherence}%
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                            ({line.passed}/{line.total})
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${line.status === 'CRITICAL' ? 'bg-red-500' :
                                                    line.status === 'WARNING' ? 'bg-orange-400' : 'bg-emerald-400'
                                                }`}
                                            style={{ width: `${line.adherence}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Avg Delay */}
                                <div className="col-span-3 text-right">
                                    <span className={`font-mono font-bold text-sm ${line.delay > 5 ? 'text-red-500' :
                                            line.delay > 2 ? 'text-orange-500' : 'text-slate-600'
                                        }`}>
                                        {line.delay.toFixed(1)}d
                                    </span>
                                </div>

                                {/* Status Badge */}
                                <div className="col-span-1 text-right">
                                    {line.status === 'CRITICAL' && <i className="fa-solid fa-triangle-exclamation text-red-500" title="Critical"></i>}
                                    {line.status === 'WARNING' && <i className="fa-solid fa-circle-exclamation text-orange-400" title="Warning"></i>}
                                    {line.status === 'STABLE' && <i className="fa-solid fa-check-circle text-emerald-400" title="Stable"></i>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* P4: Material Readiness */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-6 bg-yellow-500 rounded-full"></div>
                        <h3 className="font-bold text-slate-700">P4. 物料准备</h3>
                    </div>

                    <div className="h-40 relative mb-4">
                        <Doughnut data={p4Data} options={p4Options} />
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-bold text-slate-700">85%</span>
                            <span className="text-xs text-slate-400 font-medium mt-1">Ready</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-auto">
                        <h4 className="font-bold text-slate-800 text-xs mb-3">风险批次</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium">C2411-05</span>
                                <span className="text-red-500 font-bold">-2d</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-600 font-medium">C2411-08</span>
                                <span className="text-red-500 font-bold">-1d</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessLeadTimeWidget;
