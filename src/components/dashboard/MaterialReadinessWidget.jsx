import React, { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '../../contexts/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const MaterialReadinessWidget = ({ onRiskClick }) => {
    const { language } = useLanguage();
    const isZh = language === 'zh';
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const labels = {
        ready: isZh ? '已准备' : 'Ready',
        notReady: isZh ? '未准备' : 'Not Ready',
        signed: isZh ? '签约' : 'Signed',
        deadline: isZh ? '截止' : 'Deadline',
        prodStart: isZh ? '开工' : 'Prod Start',
        miss: isZh ? '缺料：' : 'Miss:',
        buffer: isZh ? '缓冲：3天' : 'Buffer: 3 days',
        missing: isZh ? '缺料：' : 'Missing:',
        highRiskBatches: isZh ? '高风险批次' : 'High-Risk Batches',
        items: isZh ? '个' : 'items',
        drawerTitle: isZh ? '高风险批次明细' : 'High-Risk Batches Details',
        drawerSubtitle: isZh ? '需要关注' : 'items requiring attention'
    };

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
                    status: isZh ? '缺失' : 'Missing',
                    progress: 3, totalItems: 5,
                    missing: isZh ? '主料、纽扣、护理标签' : 'Main Fabric, Buttons, Care Labels'
                },
                {
                    id: 'C2411-08',
                    signedDate: '2024-12-05',
                    materialTargetDate: '2025-01-05',
                    prodStartDate: '2025-01-08',
                    overdueDays: 1,
                    status: isZh ? '部分缺失' : 'Partial',
                    progress: 4, totalItems: 5,
                    missing: isZh ? '包装标签、吊牌' : 'Packaging Labels, Hangtags'
                },
                {
                    id: 'C2411-12',
                    signedDate: '2024-11-28',
                    materialTargetDate: '2025-01-02',
                    prodStartDate: '2025-01-06',
                    overdueDays: 3, // Critical
                    status: isZh ? '严重' : 'Critical',
                    progress: 1, totalItems: 6,
                    missing: isZh ? '原料一、原料二、里料、拉链、线' : 'Raw Material A, B, Lining, Zippers, Thread'
                },
                {
                    id: 'C2411-15',
                    signedDate: '2024-11-20',
                    materialTargetDate: '2024-12-30',
                    prodStartDate: '2025-01-05',
                    overdueDays: 7, // Severe
                    status: isZh ? '严重' : 'Critical',
                    progress: 0, totalItems: 4,
                    missing: isZh ? '全部物料：面料、辅料、配件、包装' : 'All Materials: Fabric, Trims, Accessories, Packaging'
                },
                {
                    id: 'C2411-18',
                    signedDate: '2024-11-25',
                    materialTargetDate: '2025-01-01',
                    prodStartDate: '2025-01-04',
                    overdueDays: 5,
                    status: isZh ? '严重' : 'Severe',
                    progress: 2, totalItems: 5,
                    missing: isZh ? '拉链、线、松紧带' : 'Zippers, Thread, Elastic Bands'
                }
            ]
        };
    }, []);

    const readinessPercentage = Math.round((mockMaterialsData.readyCount / mockMaterialsData.totalWeeklyContracts) * 100);

    // Chart Data
    const chartData = {
        labels: [labels.ready, labels.notReady],
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
            return { text: isZh ? `逾期 ${overdueDays} 天` : `Overdue by ${overdueDays} days`, color: 'text-red-500 font-bold' };
        } else if (overdueDays === 0) {
            return { text: isZh ? '今日到期' : 'Due Today', color: 'text-orange-500 font-bold' };
        } else {
            return { text: isZh ? `距到期 ${Math.abs(overdueDays)} 天` : `Due in ${Math.abs(overdueDays)} days`, color: 'text-slate-400' };
        }
    };

    // Expansion Logic
    const displayedBatches = mockMaterialsData.riskBatches.slice(0, 2); // Always only 2 in widget
    const hiddenCount = mockMaterialsData.riskBatches.length - 2;

    // Helper to render batch card
    const renderBatchCard = (batch, isDrawer = false) => {
        const isOverdue = batch.overdueDays > 0;
        const overdueStatus = getDeadlineStatus(batch.overdueDays);
        const completionPct = (batch.progress / batch.totalItems) * 100;

        return (
            <div key={batch.id} className={`bg-slate-50 rounded-lg border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${isDrawer ? 'p-3 mb-3' : 'p-1.5'}`}>
                {/* Header */}
                <div className={`flex items-center justify-between ${isDrawer ? 'mb-2' : 'mb-0.5 px-1'}`}>
                    <span className="text-xs font-bold text-slate-700 font-mono tracking-tight">{batch.id}</span>
                </div>

                {/* Timeline */}
                <div className={`relative flex items-start justify-between text-[10px] text-slate-500 ${isDrawer ? 'pb-2' : 'pb-0.5'}`}>
                    {/* Connector Line */}
                    <div className="absolute top-[4px] left-4 right-4 h-[1px] bg-slate-200 -z-0"></div>

                    {/* Node 1: Signed */}
                    <div className="relative z-10 flex flex-col items-center flex-1">
                        <div className={`rounded-full bg-slate-400 border border-white box-content ${isDrawer ? 'w-2.5 h-2.5 mb-1' : 'w-2 h-2 mb-0.5'}`}></div>
                        <span className="text-[8px] text-slate-400 mb-px uppercase tracking-wider leading-none">{labels.signed}</span>
                        <span className="text-[9px] font-mono text-slate-600 font-medium leading-none">{batch.signedDate}</span>
                    </div>

                    {/* Node 2: Deadline */}
                    <div className="relative z-10 flex flex-col items-center flex-[2]">
                        <div className={`rounded-full border border-white box-content ${isOverdue ? 'bg-red-500' : 'bg-blue-500'} ${isDrawer ? 'w-2.5 h-2.5 mb-1' : 'w-2 h-2 mb-0.5'}`}></div>
                        <span className="text-[8px] text-slate-400 mb-px uppercase tracking-wider leading-none">{labels.deadline}</span>
                        <span className={`text-[9px] font-mono font-bold mb-0.5 leading-none ${isOverdue ? 'text-red-500' : 'text-slate-700'}`}>{batch.materialTargetDate}</span>
                        <span className={`text-[8px] ${overdueStatus.color} mb-1 whitespace-nowrap leading-none`}>
                            {overdueStatus.text}
                        </span>

                        {/* Widget View: Compact Miss Pill */}
                        {!isDrawer && (
                            <div className="bg-red-50 rounded px-1.5 py-0.5 mt-0.5 inline-block max-w-full">
                                <span className="text-[9px] text-red-500 font-bold truncate block leading-tight">
                                    {labels.miss} {batch.missing}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Node 3: Prod Start */}
                    <div className="relative z-10 flex flex-col items-center flex-1">
                        <div className={`rounded-full bg-blue-600 border border-white box-content ring-2 ring-blue-100 ${isDrawer ? 'w-2.5 h-2.5 mb-1' : 'w-2 h-2 mb-0.5'}`}></div>
                        <span className="text-[8px] text-slate-400 mb-px uppercase tracking-wider leading-none">{labels.prodStart}</span>
                        <span className="text-[9px] font-mono text-slate-600 font-medium mb-0.5 leading-none">{batch.prodStartDate}</span>
                        {/* Drawer View: Buffer Info */}
                        {isDrawer && (
                            <span className="text-[9px] text-slate-400 mt-0.5">{labels.buffer}</span>
                        )}
                    </div>
                </div>

                {/* Drawer View: Detailed Missing Row */}
                {isDrawer && batch.missing && (
                    <div className="mt-2 border-t border-slate-100 pt-2 text-left">
                        <div className="text-[13px] leading-snug text-[#E53E3E]">
                            <span className="font-bold mr-1">{labels.missing}</span>
                            {batch.missing}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* Main Widget */}
            <div className={`flex flex-col bg-white h-full rounded-2xl`}>
                {/* Header (Hidden when embedded usually, but logic here kept simple) */}
                {/* Content */}
                <div className="p-3 flex flex-col gap-3 h-full">

                    {/* Donut Chart */}
                    <div className="h-20 relative shrink-0">
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-xl font-black text-slate-700">{readinessPercentage}%</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{labels.ready}</span>
                        </div>
                    </div>

                    {/* Risk List (Widget View) */}
                    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-2 shrink-0">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase">{labels.highRiskBatches}</h4>
                            <span className="text-[9px] text-slate-400">{mockMaterialsData.riskBatches.length} {labels.items}</span>
                        </div>

                        <div className="space-y-2 overflow-hidden">
                            {displayedBatches.map((batch) => renderBatchCard(batch, false))}
                        </div>

                        {/* More Button */}
                        {hiddenCount > 0 && (
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="w-full mt-auto py-2 text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-slate-100 rounded border border-dashed border-slate-200 transition-colors shrink-0"
                            >
                                {isZh ? `+${hiddenCount} 个高风险批次` : `+${hiddenCount} more high-risk batches`}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Side Drawer */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
                    {/* No Backdrop (Per Request to keep left side interactive) */}

                    {/* Drawer Panel */}
                    <div className="w-[550px] bg-white h-full shadow-2xl border-l border-slate-200 pointer-events-auto flex flex-col animate-slide-in-right">
                        {/* Drawer Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">{labels.drawerTitle}</h2>
                                <p className="text-xs text-slate-500">{isZh ? `共 ${mockMaterialsData.riskBatches.length} 个${labels.drawerSubtitle}` : `Reviewing ${mockMaterialsData.riskBatches.length} items requiring attention`}</p>
                            </div>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <i className="fa-solid fa-times text-lg"></i>
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {mockMaterialsData.riskBatches.map((batch) => renderBatchCard(batch, true))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MaterialReadinessWidget;
