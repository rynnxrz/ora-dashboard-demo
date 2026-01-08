import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '../../contexts/LanguageContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

// Custom Plugin for 70% Risk Threshold Marker
const riskThresholdPlugin = {
    id: 'riskThreshold',
    afterDraw: (chart) => {
        if (chart.config.type !== 'doughnut') return;
        const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
        const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;

        // 70% angle. Start is -90deg (top). 
        // 70% of 360 = 252 degrees.
        // -90 + 252 = 162 degrees.
        // Convert to radians: 162 * (Math.PI / 180)
        const angle = (162) * (Math.PI / 180);

        const xStart = centerX + (outerRadius + 8) * Math.cos(angle);
        const yStart = centerY + (outerRadius + 8) * Math.sin(angle);
        const xEnd = centerX + (innerRadius - 4) * Math.cos(angle);
        const yEnd = centerY + (innerRadius - 4) * Math.sin(angle);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.strokeStyle = '#9CA3AF'; // Gray-400
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]); // Dashed line
        ctx.stroke();

        // Add label "70%"
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Position label slightly outside
        const labelX = centerX + (outerRadius + 18) * Math.cos(angle);
        const labelY = centerY + (outerRadius + 18) * Math.sin(angle);
        ctx.fillText('70%', labelX, labelY);

        ctx.restore();
    }
};

ChartJS.register(riskThresholdPlugin);

const ClientRadarWidget = () => {
    const { t, language } = useLanguage();
    const isZh = language === 'zh';
    const dayUnit = isZh ? '天' : 'd';
    const coreLabel = isZh ? '核心' : 'Core';
    const expLabel = isZh ? '拓展' : 'Exp';
    const gapLabel = isZh ? '空白' : 'Gap';
    const [activeTab, setActiveTab] = React.useState('risks');
    const [highlightedClients, setHighlightedClients] = React.useState([]);

    // Mock Data Source - Expanded for Round 4 (Differentiation)
    const mockClients = [
        // Stable Giants (Chart Focus)
        { name: isZh ? '阿尔法营养' : 'AlphaNutrition', q3: 1500, q4: 1550 },
        { name: isZh ? '生物实验室' : 'BioLabs', q3: 1200, q4: 1200 },
        { name: isZh ? '大健康' : 'MegaHealth', q3: 1100, q4: 1050 },
        { name: isZh ? '营养公司' : 'NutriCo', q3: 900, q4: 920 },
        { name: isZh ? '康养集团' : 'WellnessInc', q3: 850, q4: 850 },

        // Volatile Clients (List Focus)
        { name: isZh ? '活力' : 'Vitality', q3: 450, q4: 0 },         // Stop (-100%)
        { name: isZh ? '能量软糖' : 'PowerGums', q3: 800, q4: 1200 },     // Big Growth (+50%)
        { name: isZh ? '海德科技' : 'HydraTech', q3: 200, q4: 50 },       // Shrink (-75%)
        { name: isZh ? '禅健' : 'ZenFit', q3: 100, q4: 400 },         // Huge Growth (+300%)
        { name: isZh ? '生酮生活' : 'KetoLife', q3: 150, q4: 100 },       // Shrink (-33%)
        { name: isZh ? '纯乳清' : 'PureWhey', q3: 50, q4: 150 },        // Growth (+200%)
        { name: isZh ? '肌能' : 'Muscle', q3: 320, q4: 280 }          // Minor Shrink (might filter out if <10%)
    ];

    // --- Logic Implementation ---

    // 1. Calculate Delta & Totals
    const clientsWithDelta = mockClients.map(client => {
        const delta = client.q4 - client.q3;
        const pct = client.q3 === 0 ? 100 : Math.round((delta / client.q3) * 100);
        return { ...client, delta, pct };
    });

    const totalQ4Days = clientsWithDelta.reduce((sum, client) => sum + client.q4, 0);

    // 2. Selection Logic
    // CHART: Top 8 by Volume (Q4) descending (Scale)
    const topByVolume = [...clientsWithDelta].sort((a, b) => b.q4 - a.q4).slice(0, 8);

    // LIST: High Volatility (>10% Change)
    // Risk: Delta < -10% or Stop (q4=0)
    const highRisk = clientsWithDelta
        .filter(c => c.q4 === 0 || c.pct <= -10)
        .sort((a, b) => a.delta - b.delta); // Most negative first

    // Growth: Delta > +10%
    const topGrowing = clientsWithDelta
        .filter(c => c.pct >= 10)
        .sort((a, b) => b.delta - a.delta); // Most positive first

    // 3. Dynamic Chart List Logic
    // If a client is selected from the list, ensure they appear in the chart
    let chartClients = [...topByVolume];
    // Check if any highlighted client (that is NOT part of top 8) needs to be added?
    // For single selection (from list), yes.
    // Logic: if we have ONE highlighted client and it's not in top 8, add it.
    if (highlightedClients.length === 1) {
        const selectedName = highlightedClients[0];
        const selectedClient = clientsWithDelta.find(c => c.name === selectedName);
        if (selectedClient) {
            const alreadyInChart = chartClients.some(c => c.name === selectedClient.name);
            if (!alreadyInChart) {
                // Append strictly to the end as a "Selected Focus"
                chartClients.push(selectedClient);
            }
        }
    }

    // Interaction Helper
    const handleClientClick = (clientName) => {
        // Toggle selection
        if (highlightedClients.includes(clientName) && highlightedClients.length === 1) {
            setHighlightedClients([]);
        } else {
            setHighlightedClients([clientName]);
        }
    };

    // --- 3B: Client Concentration Logic ---
    // Calculate Top 3 Clients for Q4
    const top3ClientsQ4 = [...clientsWithDelta].sort((a, b) => b.q4 - a.q4).slice(0, 3);
    const top3Q4Sum = top3ClientsQ4.reduce((sum, c) => sum + c.q4, 0);
    const top3Q4Share = Math.round((top3Q4Sum / totalQ4Days) * 100);

    // Calculate Top 3 Clients for Q3 (for Comparison)
    const totalQ3Days = clientsWithDelta.reduce((sum, client) => sum + client.q3, 0);
    const top3ClientsQ3 = [...clientsWithDelta].sort((a, b) => b.q3 - a.q3).slice(0, 3);
    const top3Q3Sum = top3ClientsQ3.reduce((sum, c) => sum + c.q3, 0);
    const top3Q3Share = Math.round((top3Q3Sum / totalQ3Days) * 100);

    // Risk Status Logic
    let riskStatus = 'Low';
    let riskColor = 'text-green-700'; // Darker text
    let riskBg = 'bg-green-50'; // Background
    let riskBorder = 'border-green-500';

    if (top3Q4Share > 70) {
        riskStatus = 'High';
        riskColor = 'text-red-700';
        riskBg = 'bg-red-50';
        riskBorder = 'border-red-500';
    } else if (top3Q4Share >= 50) {
        riskStatus = 'Moderate';
        riskColor = 'text-orange-700'; // Darker Orage
        riskBg = 'bg-orange-50'; // Light Orange BG
        riskBorder = 'border-orange-500';
    }
    const riskStatusText = isZh
        ? (riskStatus === 'High' ? '高' : riskStatus === 'Moderate' ? '中' : '低')
        : riskStatus;

    // Max Exposure Logic
    const maxExposureClient = topByVolume[0];
    const maxExposurePct = ((maxExposureClient.q4 / totalQ4Days) * 100).toFixed(0);

    // QoQ Comparison
    const shareDelta = (top3Q4Share - top3Q3Share).toFixed(1);
    const isRiskIncreasing = shareDelta > 0;

    // Handle Donut Click
    const handleDonutClick = (event, elements) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            if (index === 0) { // Top 3 Slice
                const top3Names = top3ClientsQ4.map(c => c.name);

                // Toggle: if already fully selected, clear; otherwise select
                const allSelected = top3Names.every(name => highlightedClients.includes(name));
                if (allSelected && highlightedClients.length === top3Names.length) {
                    setHighlightedClients([]);
                } else {
                    setHighlightedClients(top3Names);
                }
            } else {
                setHighlightedClients([]); // Clear if clicking "Others"
            }
        }
    };

    // --- Chart Data Preparation ---
    const riskData = {
        labels: chartClients.map(c => c.name),
        datasets: [
            {
                label: isZh ? '第三季度' : 'Q3 Days',
                data: chartClients.map(c => c.q3),
                backgroundColor: (ctx) => {
                    const name = chartClients[ctx.dataIndex].name;
                    // If selection active
                    if (highlightedClients.length > 0) {
                        return highlightedClients.includes(name) ? '#E5E7EB' : '#E5E7EB40';
                    }
                    return '#E5E7EB';
                },
                barPercentage: 0.6,
                datalabels: { display: false }
            },
            {
                label: isZh ? '第四季度' : 'Q4 Days',
                data: chartClients.map(c => c.q4),
                backgroundColor: (ctx) => {
                    const client = chartClients[ctx.dataIndex];
                    // Base Colors
                    let color = '#3b82f6'; // Default Blue for stable
                    if (client.delta > 0 && client.pct >= 10) color = '#10B981'; // Green (Grow)
                    else if (client.delta < 0 && client.pct <= -10) color = '#F97316'; // Orange (Risk)
                    if (client.q4 === 0) color = '#EF4444'; // Red (Stop)

                    // Dimming Interaction
                    if (highlightedClients.length > 0 && !highlightedClients.includes(client.name)) {
                        return color + '40'; // Low opacity
                    }
                    return color;
                },
                barPercentage: 0.6,
                datalabels: {
                    color: (ctx) => {
                        const client = chartClients[ctx.dataIndex];
                        if (highlightedClients.length > 0 && !highlightedClients.includes(client.name)) return '#99999940';
                        return '#666';
                    },
                    anchor: 'end',
                    align: 'top',
                    formatter: (value) => `${value}`
                }
            }
        ]
    };

    const riskOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } },
            tooltip: {
                callbacks: {
                    afterBody: function (context) {
                        const idx = context[0].dataIndex;
                        const client = chartClients[idx];
                        const sign = client.delta > 0 ? '+' : '';
                        return isZh
                            ? `变化：${sign}${client.delta}${dayUnit}（${sign}${client.pct}%）`
                            : `Delta: ${sign}${client.delta} (${sign}${client.pct}%)`;
                    }
                }
            },
            datalabels: { display: true }
        },
        scales: { y: { display: false }, x: { grid: { display: false } } }
    };

    // --- Helpers for 3C Matrix (Preserved/Updated) ---
    const getStatusColor = (days) => {
        if (days > 500) return 'bg-teal-600 text-white';
        if (days > 0) return 'bg-teal-100 text-teal-800';
        return 'border border-dashed border-gray-300 text-gray-300';
    };

    // --- Render Helpers ---
    const renderCombinedImpact = (client) => {
        const sign = client.delta > 0 ? '+' : '';
        const colorClass = client.delta >= 0 ? 'text-green-600' : (client.q4 === 0 ? 'text-red-600' : 'text-orange-500');
        // New Metric: Share of Total
        const shareOfTotal = ((client.q4 / totalQ4Days) * 100).toFixed(1);

        return (
            <div className="flex flex-col items-end">
                <span className={`${colorClass} font-bold`}>{sign}{client.delta}{dayUnit}</span>
                <span className="text-xxs text-gray-400">{isZh ? '影响' : 'Impact'}</span>
            </div>
        );
    };

    const displayList = activeTab === 'risks' ? highRisk : topGrowing;

    // 3B Donut Data
    const donutData = {
        labels: isZh ? ['前三客户', '其他'] : ['Top 3 Clients', 'Others'],
        datasets: [
            {
                data: [top3Q4Sum, totalQ4Days - top3Q4Sum],
                backgroundColor: ['#0F766E', '#E5E7EB'], // Teal-700 vs Gray-200
                borderWidth: 0,
                hoverOffset: 4
            }
        ]
    };

    const donutOptions = {
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const val = context.raw;
                        const pct = Math.round((val / totalQ4Days) * 100);
                        return isZh
                            ? `${context.label}：${val}${dayUnit}（${pct}%）`
                            : `${context.label}: ${val} days (${pct}%)`;
                    }
                }
            },
            datalabels: { display: false }
        },
        onClick: handleDonutClick
    };

    return (
        <section className="pb-10 mt-8">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight border-l-4 border-secondary pl-3">
                    {t('p3_title')}
                </h2>
                <span className="text-xs text-gray-400">
                    {isZh
                        ? `季度产能分布（总计：${totalQ4Days.toLocaleString()}天）`
                        : `Quarter-over-Quarter Capacity Allocation (Total: ${totalQ4Days.toLocaleString()}d)`}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3A: Client Risk & Growth */}
                <div className="card lg:col-span-2">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fa-solid fa-user-shield text-ora-primary"></i> {t('p3a_title')}
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[350px]">
                        {/* Visual: Bar Chart (Wider) */}
                        <div className="w-full h-80 min-w-0 md:col-span-2 flex flex-col">
                            <div className="flex-1 min-h-0 relative">
                                <Bar data={riskData} options={riskOptions} />
                            </div>
                            <div className="text-center text-xs text-gray-400 mt-2 shrink-0">{isZh ? '总产能分布' : 'Total Capacity Distribution'}</div>
                        </div>

                        {/* Interactive List: Tabbed (Narrower) */}
                        <div className="w-full h-80 flex flex-col md:col-span-1">
                            {/* Tabs: Pill Switcher */}
                            <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                                <button
                                    onClick={() => setActiveTab('risks')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'risks' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {isZh ? '风险' : 'Risks'}
                                    <span className={`inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full ${activeTab === 'risks' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'}`}>{highRisk.length}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('opportunities')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'opportunities' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {isZh ? '增长' : 'Growth'}
                                    <span className={`inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full ${activeTab === 'opportunities' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>{topGrowing.length}</span>
                                </button>
                            </div>

                            {/* Fixed Header */}
                            <div className="grid grid-cols-10 text-gray-400 bg-gray-50 uppercase text-xxs py-2 px-2 rounded-t font-medium mb-1">
                                <div className="col-span-6">{isZh ? '品牌/占比' : 'Brand / Share'}</div>
                                <div className="col-span-4 text-right">{isZh ? '影响' : 'Impact'}</div>
                            </div>

                            {/* Scrollable List Content */}
                            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
                                <table className="w-full text-left text-xs table-fixed">
                                    <tbody className="divide-y divide-gray-100">
                                        {displayList.map((client, idx) => {
                                            const isSelected = highlightedClients.includes(client.name);
                                            // Context Percentage
                                            const shareOfTotal = ((client.q4 / totalQ4Days) * 100).toFixed(1);

                                            return (
                                                <tr
                                                    key={idx}
                                                    onClick={() => handleClientClick(client.name)}
                                                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border-l-2 border-indigo-500' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="px-2 py-3 w-[60%]" title={client.name}>
                                                        <div className="font-bold text-gray-700 truncate">{client.name}</div>
                                                        <div className="text-[10px] text-gray-400">{isZh ? `（占比 ${shareOfTotal}%）` : `(${shareOfTotal}% of Total)`}</div>
                                                    </td>
                                                    <td className="px-2 py-3 text-right w-[40%]">
                                                        {renderCombinedImpact(client)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Widget 3B: Client Concentration (Refactored) */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm"><i className="fa-solid fa-chart-pie text-secondary"></i> {t('p3b_title')}</h3>
                    </div>
                    <div className="p-4 flex flex-col h-full relative">
                        {/* Donut Chart Container */}
                        <div className="relative h-48 w-full flex justify-center items-center mb-2">
                            <Doughnut data={donutData} options={donutOptions} plugins={[riskThresholdPlugin]} />
                            {/* Center Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <div className="text-secondary text-xs uppercase font-medium">{isZh ? '前三占比' : 'Top 3 Share'}</div>
                                <div className="text-2xl font-bold text-gray-800">{top3Q4Share}%</div>
                            </div>
                        </div>

                        {/* QoQ & Risk Status Block */}
                        <div className="mt-auto space-y-3">
                            {/* QoQ Metrics */}
                            <div className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded border border-gray-100">
                                <div className="text-gray-500">
                                    {isZh ? '上季对比：' : 'Q3 Comparison:'}<br />
                                    <strong>{top3Q3Share}%</strong>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-400 text-[10px] uppercase tracking-wide">{isZh ? '趋势' : 'Trend'}</div>
                                    {isRiskIncreasing ? (
                                        <div className="text-orange-500 font-bold">
                                            +{shareDelta}% {isZh ? '上升' : 'Increase'} <i className="fa-solid fa-arrow-trend-up"></i>
                                        </div>
                                    ) : (
                                        <div className="text-green-600 font-bold">
                                            {shareDelta}% {isZh ? '下降' : 'Decrease'} <i className="fa-solid fa-arrow-trend-down"></i>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={`text-xs border-l-4 ${riskBorder} pl-3 py-2 ${riskBg} rounded-r relative`}>
                                {/* Max Exposure Metric */}
                                <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-1">
                                    <span className="text-gray-500">{isZh ? '最大占比：' : 'Max Exposure:'}</span>
                                    <span className="font-bold text-gray-700">{maxExposureClient.name} ({maxExposurePct}%)</span>
                                </div>

                                <div className="mb-1 text-gray-600 leading-tight">
                                    {isZh
                                        ? `前三客户占用总产能的 `
                                        : 'Top 3 Clients occupy '}
                                    <span className="font-bold">{top3Q4Share}%</span>
                                    {isZh ? '。' : ' of total capacity.'}
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="font-bold text-gray-500">{isZh ? '风险等级：' : 'Risk Status:'}</span>
                                    <span className={`uppercase font-bold ${riskColor} px-2 py-0.5 bg-white border border-gray-100 rounded shadow-sm text-xxs`}>
                                        {riskStatusText}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Widget 3C: Format Capacity Matrix */}
                <div className="card lg:col-span-3">
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title"><i className="fa-solid fa-border-all text-teal-600"></i> {t('p3c_title')}</h3>
                        <div className="flex items-center gap-3 text-xxs">
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-600 rounded-sm"></span> {coreLabel}（&gt;500{dayUnit}）</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-100 rounded-sm border border-teal-200"></span> {expLabel}（1-200{dayUnit}）</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-300 border-dashed rounded-sm"></span> {gapLabel}（0{dayUnit}）</div>
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <table className="w-full text-xs text-center border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left font-bold text-gray-600 bg-gray-50 w-40">{isZh ? '品牌/剂型' : 'Brand / Form'}</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">{isZh ? '软糖' : 'Gummies'}</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">{isZh ? '粉剂' : 'Powder'}</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">{isZh ? '液体' : 'Liquids'}</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">{isZh ? '胶囊' : 'Capsules'}</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-left font-bold text-teal-900">{isZh ? '小雨伞' : 'Little Umbrella'}</td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(1000)}`}>1,000{dayUnit}<br /><span className="text-[9px] opacity-75">{coreLabel}</span></div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(400)}`}>400{dayUnit}<br /><span className="text-[9px] opacity-75">{expLabel}</span></div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(200)}`}>200{dayUnit}<br /><span className="text-[9px] opacity-75">{expLabel}</span></div></td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-left font-bold text-teal-900">{isZh ? '能量软糖' : 'PowerGums'}</td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(800)}`}>800{dayUnit}<br /><span className="text-[9px] opacity-75">{coreLabel}</span></div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(400)}`}>400{dayUnit}<br /><span className="text-[9px] opacity-75">{expLabel}</span></div></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ClientRadarWidget;
