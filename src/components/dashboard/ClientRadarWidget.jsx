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
    // 3A: Client Risk Bar
    const riskData = {
        labels: ['Vitality', 'Muscle'],
        datasets: [
            { label: 'Prev Q', data: [60, 60], backgroundColor: '#E5E7EB', barPercentage: 0.6, datalabels: { color: '#666', anchor: 'end', align: 'top' } },
            { label: 'Curr Q', data: [5, 25], backgroundColor: ['#E76F51', '#F4A261'], barPercentage: 0.6, datalabels: { color: '#666', anchor: 'end', align: 'top' } }
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
                        // Simply mocking context access, real app would pass full data or translation
                        const risk = idx === 0 ? 'Dormant' : 'Cooling';
                        return `Risk: ${risk}\nPrev: 60k\nCurr: ${context[0].raw}k`;
                    }
                }
            },
            datalabels: { display: true }
        },
        scales: { y: { display: false, max: 80 }, x: { grid: { display: false } } }
    };

    // 3C: Capacity Bar
    const capacityData = {
        labels: ['Little Umbrella', 'PowerGums', 'Others'],
        datasets: [{
            data: [42, 30, 28],
            backgroundColor: ['#2A9D8F', '#264653', '#E5E7EB'],
            borderRadius: 4,
            barPercentage: 0.5
        }]
    };
    const capacityOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { display: false }, y: { grid: { display: false } } },
        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#666',
                formatter: (value) => value + '%'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.raw}% Share`;
                    }
                }
            }
        }
    };

    return (
        <section className="pb-10 mt-8">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-l-4 border-secondary pl-3" data-i18n="p3_title">
                    Part 3. 客户与产能雷达 (Client & Capacity Radar)
                </h2>
                <span className="text-xs text-gray-400">Q3 2024 vs Q4 2024</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 3A: Client Risk */}
                <div className="card lg:col-span-2">
                    <div className="card-header">
                        <h3 className="card-title">
                            <i className="fa-solid fa-user-shield text-ora-primary"></i> <span data-i18n="p3a_title">3A. 客户风险预警</span>
                        </h3>
                    </div>
                    <div className="p-4">
                        {/* Visual: Bar Chart for Vol Comparison */}
                        <div className="w-full h-40">
                            <Bar data={riskData} options={riskOptions} />
                            <div className="text-center text-xs text-gray-500 mt-2">红色表示本季度完全没下单，橙色表示订单量明显下降。</div>
                        </div>
                        {/* List: Details */}
                        <div className="w-full overflow-x-auto mt-4">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">品牌</th>
                                        <th className="px-4 py-2">状态</th>
                                        <th className="px-4 py-2 text-right">最近几季出货量 (对比)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="px-4 py-2 font-bold">Vitality</td>
                                        <td className="px-4 py-2"><span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xxs">本季未下单</span></td>
                                        <td className="px-4 py-2 text-right text-gray-400">60k <i className="fa-solid fa-arrow-right text-gray-300 mx-1"></i> <span className="text-red-600 font-bold">0</span></td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 font-bold">Muscle</td>
                                        <td className="px-4 py-2"><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xxs">下单明显变少</span></td>
                                        <td className="px-4 py-2 text-right text-gray-400">60k <i className="fa-solid fa-arrow-right text-gray-300 mx-1"></i> <span className="text-orange-500 font-bold">25k</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="card-footer">Based on quarterly volume comparison</div>
                </div>

                {/* Widget 3C: Capacity Concentration */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-chart-pie text-secondary"></i> <span data-i18n="p3c_title">3C. 品牌产能集中度</span></h3>
                    </div>
                    <div className="p-4 flex flex-col justify-between h-full">
                        <div className="h-32 relative">
                            <Bar data={capacityData} options={capacityOptions} />
                        </div>
                        {/* Risk Warning */}
                        <div className="mt-2 text-xs border-l-2 border-ora-danger pl-2 text-gray-600">
                            <span className="font-bold text-ora-danger">High Risk:</span> 当前前三大客户占用排产产能约 72%，集中度偏高。
                        </div>
                    </div>
                    <div className="card-footer">Based on scheduled units</div>
                </div>

                {/* Widget 3D: White Space Matrix */}
                <div className="card lg:col-span-3">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-border-all text-teal-600"></i> P3-D. 剂型白地 (White Space)</h3>
                        <div className="flex items-center gap-2 text-xxs">
                            <span className="w-3 h-3 bg-teal-600 rounded-sm"></span> 核心业务
                            <span className="w-3 h-3 bg-teal-100 rounded-sm"></span> 偶尔生产
                            <span className="w-3 h-3 border border-gray-300 border-dashed rounded-sm"></span> 从未合作
                        </div>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <table className="w-full text-xs text-center border-collapse">
                            <thead>
                                <tr>
                                    <th className="px-3 py-2 text-left font-bold text-gray-600 bg-gray-50 w-40">品牌 / 剂型</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Gummies</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Powder</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Liquids</th>
                                    <th className="px-1 py-2 font-medium text-gray-500 bg-gray-50">Capsules</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                <tr className="border-b border-gray-50">
                                    <td className="p-3 text-left font-bold">Little Umbrella</td>
                                    <td className="p-1"><div className="w-full py-1 bg-teal-600 text-white rounded-sm text-[10px]">Core</div></td>
                                    <td className="p-1"><div className="w-full py-1 bg-teal-100 text-teal-800 rounded-sm text-[10px]">Exp</div></td>
                                    <td className="p-1"><div className="w-full py-1 border border-dashed border-gray-300 text-gray-300 rounded-sm text-[10px]">—</div></td>
                                    <td className="p-1"><div className="w-full py-1 bg-teal-600 text-white rounded-sm text-[10px]">Core</div></td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="p-3 text-left font-bold">PowerGums</td>
                                    <td className="p-1"><div className="w-full py-1 bg-teal-600 text-white rounded-sm text-[10px]">Core</div></td>
                                    <td className="p-1"><div className="w-full py-1 border border-dashed border-gray-300 text-gray-300 rounded-sm text-[10px]">—</div></td>
                                    <td className="p-1"><div className="w-full py-1 border border-dashed border-gray-300 text-gray-300 rounded-sm text-[10px]">—</div></td>
                                    <td className="p-1"><div className="w-full py-1 border border-dashed border-gray-300 text-gray-300 rounded-sm text-[10px]">—</div></td>
                                </tr>
                                <tr className="border-b border-gray-50">
                                    <td className="p-3 text-left font-bold">Vitality</td>
                                    <td className="p-1"><div className="w-full py-1 border border-dashed border-gray-300 text-gray-300 rounded-sm text-[10px]">—</div></td>
                                    <td className="p-1"><div className="w-full py-1 bg-teal-600 text-white rounded-sm text-[10px]">Core</div></td>
                                    <td className="p-1"><div className="w-full py-1 bg-teal-100 text-teal-800 rounded-sm text-[10px]">Exp</div></td>
                                    <td className="p-1"><div className="w-full py-1 border border-dashed border-gray-300 text-gray-300 rounded-sm text-[10px]">—</div></td>
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
