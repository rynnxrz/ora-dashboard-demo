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
        // Mock Reference "Today": 2026-01-06
        return {
            totalWeeklyContracts: 15,
            readyCount: 10,
            riskBatches: [
                {
                    id: 'C2411-05',
                    signedDate: '2024-12-01',
                    materialTargetDate: '2025-01-04',
                    prodStartDate: '2025-01-07',
                    overdueDays: 2, // 2 days past Jan 4
                    status: 'Missing',
                    progress: 3, totalItems: 5,
                    missing: 'Main Fabric, Buttons'
                },
                {
                    id: 'C2411-08',
                    signedDate: '2024-12-05',
                    materialTargetDate: '2025-01-05',
                    prodStartDate: '2025-01-08',
                    overdueDays: 1,
                    status: 'Partial',
                    progress: 4, totalItems: 5,
                    missing: 'Packaging Labels'
                },
                {
                    id: 'C2411-12',
                    signedDate: '2024-11-28',
                    materialTargetDate: '2025-01-02',
                    prodStartDate: '2025-01-06',
                    overdueDays: 3, // Critical
                    status: 'Critical',
                    progress: 1, totalItems: 6,
                    missing: 'Raw Material A, B'
                },
                {
                    id: 'C2411-15',
                    signedDate: '2024-11-20',
                    materialTargetDate: '2024-12-30',
                    prodStartDate: '2025-01-05',
                    overdueDays: 7, // Severe
                    status: 'Critical',
                    progress: 0, totalItems: 4,
                    missing: 'All Materials'
                },
                {
                    id: 'C2411-18',
                    signedDate: '2024-11-25',
                    materialTargetDate: '2025-01-01',
                    prodStartDate: '2025-01-04',
                    overdueDays: 5,
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

    // Helper for explicit status text
    const getDeadlineStatus = (overdueDays) => {
        if (overdueDays > 0) {
            return { text: `Overdue by ${overdueDays} days`, color: 'text-red-500 font-bold' };
        } else if (overdueDays === 0) {
            return { text: 'Due Today', color: 'text-orange-500 font-bold' };
        } else {
            return { text: `Due in ${Math.abs(overdueDays)} days`, color: 'text-slate-400' };
        }
    };

    // Expansion Logic
    const displayedBatches = isExpanded ? mockMaterialsData.riskBatches : mockMaterialsData.riskBatches.slice(0, 2);
    const hiddenCount = mockMaterialsData.riskBatches.length - 2;

    return (
        <div className="card lg:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 h-full">
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
                            const overdueStatus = getDeadlineStatus(batch.overdueDays);
                            const isOverdue = batch.overdueDays > 0;
                            const completionPct = (batch.progress / batch.totalItems) * 100;

                            return (
                                <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                    {/* Header: Just ID now */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-slate-700 font-mono tracking-tight">{batch.id}</span>
                                    </div>

                                    {/* Standardized 3-Point Timeline */}
                                    <div className="relative flex items-start justify-between text-[10px] text-slate-500 pb-2">

                                        {/* Connector Line */}
                                        <div className="absolute top-[5px] left-4 right-4 h-[1px] bg-slate-200 -z-0"></div>

                                        {/* Node 1: Signed Date */}
                                        <div className="relative z-10 flex flex-col items-center flex-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mb-1.5 border border-white box-content"></div>
                                            <span className="text-[9px] text-slate-400 mb-px uppercase tracking-wider">Signed Date</span>
                                            <span className="text-[10px] font-mono text-slate-600 font-medium">{batch.signedDate}</span>
                                        </div>

                                        {/* Node 2: Material Deadline */}
                                        <div className="relative z-10 flex flex-col items-center flex-[1.5]">
                                            <div className={`w-2.5 h-2.5 rounded-full mb-1.5 border border-white box-content ${isOverdue ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                            <span className="text-[9px] text-slate-400 mb-px uppercase tracking-wider">Material Deadline</span>
                                            <span className={`text-[10px] font-mono font-bold mb-0.5 ${isOverdue ? 'text-red-500' : 'text-slate-700'}`}>{batch.materialTargetDate}</span>

                                            {/* Explicit Status Text */}
                                            <span className={`text-[9px] ${overdueStatus.color} mb-1 whitespace-nowrap`}>
                                                {overdueStatus.text}
                                            </span>

                                            {/* Progress Bar & Missing Info */}
                                            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mb-0.5">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${completionPct}%` }}
                                                ></div>
                                            </div>
                                            <div className="bg-slate-100 rounded px-1 py-0.5 max-w-[100px] text-center">
                                                <span className="text-[8px] text-slate-400 truncate block leading-tight">
                                                    Miss: {batch.missing}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Node 3: Prod Start */}
                                        <div className="relative z-10 flex flex-col items-center flex-1">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mb-1.5 border border-white box-content ring-2 ring-blue-100"></div>
                                            <span className="text-[9px] text-slate-400 mb-px uppercase tracking-wider">Prod Start</span>
                                            <span className="text-[10px] font-mono text-slate-600 font-medium mb-0.5">{batch.prodStartDate}</span>
                                        </div>
                                    </div>
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
        </div >
    );
};

export default MaterialReadinessWidget;
