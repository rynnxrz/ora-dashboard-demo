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
    // 3A: Client Risk Bar (Days Delta)
    const riskData = {
        labels: ['Vitality', 'Muscle', 'PowerGums'],
        datasets: [
            {
                label: 'Q3 Days',
                data: [450, 320, 800],
                backgroundColor: '#E5E7EB',
                barPercentage: 0.6,
                datalabels: { display: false } // Hide Q3 labels to avoid clutter
            },
            {
                label: 'Q4 Days',
                data: [0, 120, 1200],
                backgroundColor: ['#EF4444', '#F97316', '#10B981'], // Red, Orange, Green
                barPercentage: 0.6,
                datalabels: {
                    color: '#666',
                    anchor: 'end',
                    align: 'top',
                    formatter: (value, context) => {
                        const q3Data = context.chart.data.datasets[0].data;
                        const idx = context.dataIndex;
                        const q3Value = q3Data[idx];
                        const delta = value - q3Value;
                        const sign = delta > 0 ? '+' : '';
                        return `${value}d (${sign}${delta})`;
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
                        const deltas = [-450, -200, +400];
                        const delta = deltas[idx];
                        const sign = delta > 0 ? '+' : '';
                        return `Delta: ${sign}${delta} Days`;
                    }
                }
            },
            datalabels: { display: true }
        },
        scales: { y: { display: false, max: 1500 }, x: { grid: { display: false } } }
    };

    // 3C: Capacity Concentration (Total 4000 Days)
    const capacityData = {
        labels: ['Little Umbrella', 'PowerGums', 'Others'],
        datasets: [{
            data: [1600, 1200, 1200], // Total 4000
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
                color: (context) => {
                    // Dark color for the light gray bar (index 2 - Others), white for others
                    return context.dataIndex === 2 ? '#374151' : '#fff';
                },
                formatter: (value, ctx) => {
                    const percentage = Math.round((value / 4000) * 100);
                    // Show label inside bar for larger values
                    return ctx.dataIndex === 2 ? `Others ${percentage}%` : `${percentage}%`;
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const val = context.raw;
                        const pct = Math.round((val / 4000) * 100);
                        return `${val} Days (${pct}%)`;
                    }
                }
            }
        }
    };

    // 3D Matrix Data Helper
    const getStatusColor = (days) => {
        if (days > 500) return 'bg-teal-600 text-white'; // Core
        if (days > 0) return 'bg-teal-100 text-teal-800'; // Exp
        return 'border border-dashed border-gray-300 text-gray-300'; // Gap
    };

    const getStatusLabel = (days) => {
        if (days > 500) return 'Core';
        if (days > 0) return 'Exp';
        return '—';
    };

    return (
        <section className="pb-10 mt-8">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-l-4 border-secondary pl-3" data-i18n="p3_title">
                    Part 3. 客户与产能雷达 (Client & Capacity Radar)
                </h2>
                <span className="text-xs text-gray-400">Measured in Occupied Capacity Days (Total: 4,000d)</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3A: Client Risk Watch */}
                <div className="card lg:col-span-2">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fa-solid fa-user-shield text-ora-primary"></i> <span data-i18n="p3a_title">3A. 客户风险预警 (Client Risk Watch)</span>
                        </h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Visual: Bar Chart */}
                        <div className="w-full h-48">
                            <Bar data={riskData} options={riskOptions} />
                            <div className="text-center text-xs text-gray-400 mt-2">Comparison: Q3 (Gray) vs Q4 (Color) Occupied Days</div>
                        </div>

                        {/* Table: Details */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                                    <tr>
                                        <th className="px-2 py-2">Brand</th>
                                        <th className="px-2 py-2">Status</th>
                                        <th className="px-2 py-2 text-right">Capacity Impact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="px-2 py-3 font-bold">Vitality</td>
                                        <td className="px-2 py-3"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xxs">🛑 Stop</span></td>
                                        <td className="px-2 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-gray-400 strike-through text-[10px]">450d</span>
                                                <span className="text-red-600 font-bold">0d (-450)</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-3 font-bold">Muscle</td>
                                        <td className="px-2 py-3"><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xxs">🟠 Shrink</span></td>
                                        <td className="px-2 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-gray-400 text-[10px]">320d</span>
                                                <span className="text-orange-500 font-bold">120d (-200)</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-2 py-3 font-bold">PowerGums</td>
                                        <td className="px-2 py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xxs">🟢 Grow</span></td>
                                        <td className="px-2 py-3 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-gray-400 text-[10px]">800d</span>
                                                <span className="text-green-600 font-bold">1,200d (+400)</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Widget 3C: Brand Capacity Concentration */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-chart-pie text-secondary"></i> <span data-i18n="p3c_title">3C. 品牌产能集中度</span></h3>
                    </div>
                    <div className="p-4 flex flex-col justify-between h-full">
                        <div className="h-40 relative">
                            <Bar data={capacityData} options={capacityOptions} />
                        </div>
                        {/* Risk Warning */}
                        <div className="mt-4 text-xs border-l-2 border-ora-warning pl-2 text-gray-600">
                            <span className="font-bold text-ora-warning">Concentration Risk:</span>
                            <br />
                            Top 2 Clients (Little Umbrella + PowerGums) occupy <span className="font-bold">70%</span> of total capacity (2,800/4,000 Days).
                        </div>
                    </div>
                </div>

                {/* Widget 3D: White Space Matrix */}
                <div className="card lg:col-span-3">
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title"><i className="fa-solid fa-border-all text-teal-600"></i> 3D. 剂型工时分布 (White Space)</h3>
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
                                    {/* Gummies: 1000d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(1000)}`}>1,000d<br /><span className="text-[9px] opacity-75">Core</span></div></td>
                                    {/* Powder: 400d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(400)}`}>400d<br /><span className="text-[9px] opacity-75">Exp</span></div></td>
                                    {/* Liquids: 0d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    {/* Capsules: 200d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(200)}`}>200d<br /><span className="text-[9px] opacity-75">Exp</span></div></td>
                                </tr>
                                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-left font-bold text-teal-900">PowerGums</td>
                                    {/* Gummies: 800d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(800)}`}>800d<br /><span className="text-[9px] opacity-75">Core</span></div></td>
                                    {/* Powder: 0d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    {/* Liquids: 0d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(0)}`}>—</div></td>
                                    {/* Capsules: 400d */}
                                    <td className="p-1"><div className={`w-full py-2 rounded-md font-medium ${getStatusColor(400)}`}>400d<br /><span className="text-[9px] opacity-75">Exp</span></div></td>
                                </tr>
                                {/* Vitality Row - Optional/Ghost maybe? Keeping it simple as per request or maybe removing since they stopped? 
                                    Request didn't explicitly say to remove Vitality from 3D, but 3A says they stopped. 
                                    However, the user request table for 3D only showed Little Umbrella and PowerGums.
                                    I will follow the user's specific table for 3D which only had LU and PowerGums.
                                */}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ClientRadarWidget;
