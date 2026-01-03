import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const ClientRadarWidget = () => {
    const [activeTab, setActiveTab] = React.useState('risks');
    const [selectedClientName, setSelectedClientName] = React.useState(null);

    // Mock Data Source - Expanded for Round 4 (Differentiation)
    const mockClients = [
        // Stable Giants (Chart Focus)
        { name: 'AlphaNutrition', q3: 1500, q4: 1550 },
        { name: 'BioLabs', q3: 1200, q4: 1200 },
        { name: 'MegaHealth', q3: 1100, q4: 1050 },
        { name: 'NutriCo', q3: 900, q4: 920 },
        { name: 'WellnessInc', q3: 850, q4: 850 },

        // Volatile Clients (List Focus)
        { name: 'Vitality', q3: 450, q4: 0 },         // Stop (-100%)
        { name: 'PowerGums', q3: 800, q4: 1200 },     // Big Growth (+50%)
        { name: 'HydraTech', q3: 200, q4: 50 },       // Shrink (-75%)
        { name: 'ZenFit', q3: 100, q4: 400 },         // Huge Growth (+300%)
        { name: 'KetoLife', q3: 150, q4: 100 },       // Shrink (-33%)
        { name: 'PureWhey', q3: 50, q4: 150 },        // Growth (+200%)
        { name: 'Muscle', q3: 320, q4: 280 }          // Minor Shrink (might filter out if <10%)
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
    if (selectedClientName) {
        const selectedClient = clientsWithDelta.find(c => c.name === selectedClientName);
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
        if (selectedClientName === clientName) {
            setSelectedClientName(null);
        } else {
            setSelectedClientName(clientName);
        }
    };

    // --- Chart Data Preparation ---
    const riskData = {
        labels: chartClients.map(c => c.name),
        datasets: [
            {
                label: 'Q3 Days',
                data: chartClients.map(c => c.q3),
                backgroundColor: (ctx) => {
                    const name = chartClients[ctx.dataIndex].name;
                    // If selection active, dim others
                    if (selectedClientName && name !== selectedClientName) return '#E5E7EB80'; // Dimmed
                    return '#E5E7EB';
                },
                barPercentage: 0.6,
                datalabels: { display: false }
            },
            {
                label: 'Q4 Days',
                data: chartClients.map(c => c.q4),
                backgroundColor: (ctx) => {
                    const client = chartClients[ctx.dataIndex];
                    // Base Colors
                    let color = '#3b82f6'; // Default Blue for stable
                    if (client.delta > 0 && client.pct >= 10) color = '#10B981'; // Green (Grow)
                    else if (client.delta < 0 && client.pct <= -10) color = '#F97316'; // Orange (Risk)
                    if (client.q4 === 0) color = '#EF4444'; // Red (Stop)

                    // Dimming Interaction
                    if (selectedClientName && client.name !== selectedClientName) {
                        return color + '40'; // Low opacity
                    }
                    return color;
                },
                barPercentage: 0.6,
                datalabels: {
                    color: (ctx) => {
                        const client = chartClients[ctx.dataIndex];
                        if (selectedClientName && client.name !== selectedClientName) return '#99999940';
                        return '#666';
                    },
                    anchor: 'end',
                    align: 'top',
                    formatter: (value, context) => {
                        const idx = context.dataIndex;
                        const client = chartClients[idx];
                        // const sign = client.delta > 0 ? '+' : '';
                        // Simplify label for chart: just Q4 value
                        return `${value}`;
                    }
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
                        return `Delta: ${sign}${client.delta} (${sign}${client.pct}%)`;
                    }
                }
            },
            datalabels: { display: true }
        },
        scales: { y: { display: false }, x: { grid: { display: false } } }
    };

    // --- Helpers for 3D Matrix (Preserved/Updated) ---
    const getStatusColor = (days) => {
        if (days > 500) return 'bg-teal-600 text-white';
        if (days > 0) return 'bg-teal-100 text-teal-800';
        return 'border border-dashed border-gray-300 text-gray-300';
    };

    // --- Render Helpers ---
    const renderDeltaBadge = (client) => {
        if (client.q4 === 0) return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xxs">🛑 Stop</span>;
        if (client.delta < 0) return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xxs">🟠 Shrink</span>;
        return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xxs">🟢 Grow</span>;
    };

    const renderCombinedImpact = (client) => {
        const sign = client.delta > 0 ? '+' : '';
        const colorClass = client.delta >= 0 ? 'text-green-600' : (client.q4 === 0 ? 'text-red-600' : 'text-orange-500');

        return (
            <span className={`${colorClass} font-bold`}>{sign}{client.delta}d ({sign}{client.pct}%)</span>
        );
    };

    // 3C Data (Static)
    const capacityData = {
        labels: ['AlphaNutrition', 'BioLabs', 'Others'],
        datasets: [{
            data: [1550, 1200, 1250],
            backgroundColor: ['#2A9D8F', '#264653', '#E5E7EB'],
            borderRadius: 4,
            barPercentage: 0.6
        }]
    };
    const capacityOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false, max: 4000 },
            y: { grid: { display: false } }
        },
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'start',
                offset: 4,
                color: (context) => context.dataIndex === 2 ? '#374151' : '#fff',
                formatter: (value, ctx) => {
                    const percentage = Math.round((value / 4000) * 100);
                    return ctx.dataIndex === 2 ? `Others ${percentage}%` : `${percentage}%`;
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.raw} Days (${Math.round((context.raw / 4000) * 100)}%)`;
                    }
                }
            }
        }
    };

    const displayList = activeTab === 'risks' ? highRisk : topGrowing;

    return (
        <section className="pb-10 mt-8">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-l-4 border-secondary pl-3">
                    PART 3. CLIENT & CAPACITY RADAR
                </h2>
                <span className="text-xs text-gray-400">Measured in Occupied Capacity Days (Total: {totalQ4Days.toLocaleString()}d)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3A: Client Risk Watch */}
                <div className="card lg:col-span-2">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fa-solid fa-user-shield text-ora-primary"></i> 3A. Client Risk Watch
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[350px]">
                        {/* Visual: Bar Chart (Wider) */}
                        <div className="w-full h-80 min-w-0 md:col-span-2 flex flex-col">
                            <div className="flex-1 min-h-0 relative">
                                <Bar data={riskData} options={riskOptions} />
                            </div>
                            <div className="text-center text-xs text-gray-400 mt-2 shrink-0">Total Capacity Distribution (Top 8 Clients)</div>
                        </div>

                        {/* Interactive List: Tabbed (Narrower) */}
                        <div className="w-full h-80 flex flex-col md:col-span-1">
                            {/* Tabs: Pill Switcher */}
                            <div className="flex bg-slate-100 p-1 rounded-lg mb-3">
                                <button
                                    onClick={() => setActiveTab('risks')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'risks' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Risks
                                    <span className={`inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full ${activeTab === 'risks' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-500'}`}>{highRisk.length}</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('opportunities')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'opportunities' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Growth
                                    <span className={`inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold rounded-full ${activeTab === 'opportunities' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>{topGrowing.length}</span>
                                </button>
                            </div>

                            {/* Fixed Header */}
                            <div className="grid grid-cols-10 text-gray-400 bg-gray-50 uppercase text-xxs py-2 px-2 rounded-t font-medium mb-1">
                                <div className="col-span-4">Brand</div>
                                <div className="col-span-6 text-right">Impact</div>
                            </div>

                            {/* Scrollable List Content */}
                            <div className="overflow-y-auto flex-1 pr-1 custom-scrollbar">
                                <table className="w-full text-left text-xs table-fixed">
                                    <tbody className="divide-y divide-gray-100">
                                        {displayList.map((client, idx) => {
                                            const isSelected = selectedClientName === client.name;
                                            return (
                                                <tr
                                                    key={idx}
                                                    onClick={() => handleClientClick(client.name)}
                                                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border-l-2 border-indigo-500' : 'hover:bg-gray-50'}`}
                                                >
                                                    <td className="px-2 py-3 font-bold text-gray-700 truncate w-[40%]" title={client.name}>
                                                        {client.name}
                                                    </td>
                                                    <td className="px-2 py-3 text-right w-[60%]">
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

                {/* Widget 3C: Brand Capacity Concentration */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-chart-pie text-secondary"></i> 3C. Brand Capacity Concentration</h3>
                    </div>
                    <div className="p-4 flex flex-col justify-between h-full">
                        <div className="h-40 relative">
                            <Bar data={capacityData} options={capacityOptions} />
                        </div>
                        {/* Risk Warning */}
                        <div className="mt-4 text-xs border-l-2 border-ora-warning pl-2 text-gray-600">
                            <span className="font-bold text-ora-warning">Concentration Risk:</span>
                            <br />
                            Top 2 Clients (AlphaNutrition + BioLabs) occupy <span className="font-bold">69%</span> of total capacity (2,750/4,000 Days).
                        </div>
                    </div>
                </div>

                {/* Widget 3D: White Space Matrix */}
                <div className="card lg:col-span-3">
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title"><i className="fa-solid fa-border-all text-teal-600"></i> 3D. Format Capacity Matrix (White Space)</h3>
                        <div className="flex items-center gap-3 text-xxs">
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-600 rounded-sm"></span> Core (&gt;500d)</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-teal-100 rounded-sm border border-teal-200"></span> Exp (1-200d)</div>
                            <div className="flex items-center gap-1"><span className="w-3 h-3 border border-gray-300 border-dashed rounded-sm"></span> Gap (0d)</div>
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <table className="w-full text-xs text-center border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left font-bold text-gray-600 bg-gray-50 w-40">Brand / Form</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Gummies</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Powder</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Liquids</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Capsules</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-left font-bold text-teal-900">Little Umbrella</td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(1000)}`}>1,000d<br /><span className="text-[9px] opacity-75">Core</span></div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(400)}`}>400d<br /><span className="text-[9px] opacity-75">Exp</span></div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(200)}`}>200d<br /><span className="text-[9px] opacity-75">Exp</span></div></td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-left font-bold text-teal-900">PowerGums</td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(800)}`}>800d<br /><span className="text-[9px] opacity-75">Core</span></div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(400)}`}>400d<br /><span className="text-[9px] opacity-75">Exp</span></div></td>
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
