import React, { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '../../contexts/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const MaterialReadinessWidget = ({ onRiskClick }) => {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);

    // --- Mock Data Generation ---
    const mockMaterialsData = useMemo(() => {
        return {
            totalWeeklyContracts: 15, // Increased for demo
            readyCount: 10,
            riskBatches: [
                {
                    id: 'C2411-05',
                    delay: 2,
                    signedDate: '2024-12-01',
                    materialTargetDate: '2025-01-04',
                    prodStartDate: '2025-01-07',
                    status: 'Missing',
                    progress: 3, totalItems: 5,
                    missing: 'Main Fabric, Buttons'
                },
                {
                    id: 'C2411-08',
                    delay: 1,
                    signedDate: '2024-12-05',
                    materialTargetDate: '2025-01-05',
                    prodStartDate: '2025-01-08',
                    status: 'Partial',
                    progress: 4, totalItems: 5,
                    missing: 'Packaging Labels'
                },
                {
                    id: 'C2411-12',
                    delay: 3,
                    signedDate: '2024-11-28',
                    materialTargetDate: '2025-01-02',
                    prodStartDate: '2025-01-06',
                    status: 'Critical',
                    progress: 1, totalItems: 6,
                    missing: 'Raw Material A, B'
                },
                {
                    id: 'C2411-15',
                    delay: 5,
                    signedDate: '2024-11-20',
                    materialTargetDate: '2024-12-30',
                    prodStartDate: '2025-01-05',
                    status: 'Critical',
                    progress: 0, totalItems: 4,
                    missing: 'All Materials'
                },
                {
                    id: 'C2411-18',
                    delay: 4,
                    signedDate: '2024-11-25',
                    materialTargetDate: '2025-01-01',
                    prodStartDate: '2025-01-04',
                    status: 'Severe',
                    progress: 2, totalItems: 5,
                    missing: 'Zippers, Thread'
                }
            ]
        };
    }, []);

    const readinessPercentage = Math.round((mockMaterialsData.readyCount / mockMaterialsData.totalWeeklyContracts) * 100);

    // Chart Data
    const chartData = {
        labels: ['Ready', 'Not Ready'],
        datasets: [{
            data: [readinessPercentage, 100 - readinessPercentage],
            backgroundColor: ['#10B981', '#EF4444'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            datalabels: { display: false }
        }
    };

    const getBuffer = (matDate, prodDate) => {
        const d1 = new Date(matDate);
        const d2 = new Date(prodDate);
        const diffTime = d2 - d1;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // UI Helpers
    const getSeverityStyles = (delay) => {
        if (delay >= 3) return 'bg-red-600 text-white font-bold shadow-sm';
        return 'bg-red-50 text-red-600 font-bold border border-red-100';
    };

    // Expansion Logic
    const displayedBatches = isExpanded ? mockMaterialsData.riskBatches : mockMaterialsData.riskBatches.slice(0, 3);
    const hiddenCount = mockMaterialsData.riskBatches.length - 3;

    return (
        <div className={`card lg:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 relative ${isExpanded ? 'absolute z-50 shadow-xl' : 'h-full'}`}
            style={isExpanded ? { top: 0, left: 0, right: 0, maxHeight: '600px', minHeight: '100%' } : {}}
        >
            {/* Header */}
            <div className="card-header p-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white rounded-t-2xl sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-yellow-500 rounded-full"></div>
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-tight">MATERIAL READINESS</h3>
                </div>
                {isExpanded && (
                    <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="text-slate-400 hover:text-slate-600 p-1">
                        <i className="fa-solid fa-times"></i>
                    </button>
                )}
            </div>

            {/* Content */}
            <div className={`p-3 flex-1 flex flex-col gap-3 ${isExpanded ? 'overflow-y-auto custom-scrollbar' : 'overflow-hidden'}`}>

                {/* Donut Chart (Hide when expanded to focus on list) */}
                {!isExpanded && (
                    <div className="h-24 relative shrink-0">
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-2xl font-black text-slate-700">{readinessPercentage}%</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Ready</span>
                        </div>
                    </div>
                )}

                {/* Risk List with Timeline */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase">High-Risk Batches</h4>
                        <span className="text-[9px] text-slate-400">{mockMaterialsData.riskBatches.length} items</span>
                    </div>

                    <div className={`space-y-2 ${isExpanded ? '' : 'overflow-y-auto pr-1 flex-1 custom-scrollbar'}`}>
                        {displayedBatches.map((batch, idx) => {
                            const buffer = getBuffer(batch.materialTargetDate, batch.prodStartDate);
                            const severityClass = getSeverityStyles(batch.delay);
                            const completionPct = (batch.progress / batch.totalItems) * 100;

                            return (
                                <div key={idx} className={`bg-slate-50 rounded-lg p-2 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${isExpanded ? 'max-w-2xl mx-auto w-full' : ''}`}>
                                    {/* Header Row: ID + Delay */}
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-slate-700 font-mono tracking-tight">{batch.id}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${severityClass}`}>
                                            -{batch.delay}d
                                        </span>
                                    </div>

                                    {/* Timeline Visual */}
                                    <div className={`relative flex items-center justify-between text-[10px] text-slate-500 pb-2 ${isExpanded ? 'max-w-md mx-auto w-full' : ''}`}>
                                        {/* Connector Line */}
                                        <div className="absolute top-1.5 left-2 right-2 h-[1px] bg-slate-200 -z-0"></div>

                                        {/* Node 1: Signed */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mb-1 border border-white box-content"></div>
                                            <span className="text-[9px] font-medium text-slate-500 mb-px">Signed</span>
                                            <span className="text-[8px] font-mono text-slate-400">{batch.signedDate}</span>
                                        </div>

                                        {/* Node 2: Mat Target (With Progress) */}
                                        <div className="relative z-10 flex flex-col items-center w-20">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mb-1 border border-white box-content"></div>
                                            <span className="text-[9px] font-bold text-blue-600 mb-px">Target</span>

                                            {/* Progress Bar */}
                                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-0.5 mt-0.5">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${completionPct}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[8px] font-medium text-slate-500 leading-none">
                                                ({batch.progress}/{batch.totalItems})
                                            </span>

                                            {/* Missing Info */}
                                            <div className="absolute top-full mt-1 w-28 text-center bg-slate-50/90 backdrop-blur-[1px] rounded px-1">
                                                <span className="text-[8px] text-red-400 truncate block leading-tight border-t border-slate-100 pt-0.5 mt-0.5">
                                                    Miss: {batch.missing}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Node 3: Prod Start */}
                                        <div
                                            className="relative z-10 flex flex-col items-center cursor-pointer group"
                                            onClick={(e) => { e.stopPropagation(); onRiskClick && onRiskClick(batch.id); }}
                                        >
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mb-1 border border-white box-content ring-2 ring-blue-100"></div>
                                            <span className="text-[9px] font-bold text-blue-600 mb-px group-hover:underline decoration-blue-300">Start</span>
                                            <span className="text-[8px] font-mono text-slate-500">{batch.prodStartDate}</span>

                                            {/* Buffer Info */}
                                            <span className={`absolute top-full mt-1 text-[8px] whitespace-nowrap ${buffer < 0 ? 'font-bold text-red-500' : 'text-slate-400'}`}>
                                                Buf: {buffer}d
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-3"></div> {/* Spacer for absolute elements */}
                                </div>
                            );
                        })}
                    </div>

                    {/* Expand Trigger */}
                    {!isExpanded && hiddenCount > 0 && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="w-full mt-2 py-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded border border-dashed border-slate-200 transition-colors shrink-0"
                        >
                            +{hiddenCount} more high-risk batches
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaterialReadinessWidget;
