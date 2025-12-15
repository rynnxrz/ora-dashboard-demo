import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DataQualityWidget = () => {
    // Chart Data Mock - Matching HTML's dataQualityChart
    const doughnutData = {
        labels: ['Date', 'Qty', 'Logic', 'Other'],
        datasets: [
            {
                data: [12, 3, 1, 1],
                backgroundColor: ['#E76F51', '#F4A261', '#E9C46A', '#264653'],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        layout: {
            padding: 20
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
            datalabels: {
                display: true,
                color: '#666',
                anchor: 'end',
                align: 'end',
                offset: 10,
                font: { size: 10, weight: 'normal' },
                formatter: (value, ctx) => {
                    return ctx.chart.data.labels[ctx.dataIndex];
                }
            }
        },
        scales: {
            x: { display: false },
            y: { display: false }
        }
    };

    return (
        <div className="card bg-white border border-gray-200 shadow-sm rounded-lg lg:col-span-3 flex flex-col h-96">
            <div className="card-header flex justify-between items-center mb-2 px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <i className="fas fa-database text-purple-600"></i>
                    <span data-i18n="p1d_title">数据记录完整度 (Data Quality)</span>
                </h3>
                <span className="text-xs text-gray-500">Last Update: 10 mins ago</span>
            </div>

            <div className="flex flex-1 overflow-hidden p-4 gap-4">
                {/* Left: Charts (50%) */}
                <div className="w-1/2 flex flex-col justify-center">
                    {/* Chart 1: Issue Type Donut */}
                    <div className="w-full relative h-48">
                        <Doughnut data={doughnutData} options={chartOptions} />

                        {/* Optional: Center checkmark or text if desired, but HTML logic emphasizes labels */}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center bg-gray-50 p-2 rounded">
                        <i className="fas fa-info-circle mr-1"></i>左侧展示整体记录完整度，右侧展示问题类型分布。
                    </div>
                </div>

                {/* Right: Detail List (50%) */}
                <div className="w-1/2 flex flex-col bg-white border border-gray-100 rounded-lg shadow-sm h-full">
                    <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <span className="font-bold text-xs text-gray-700">问题合同列表 (Issue List)</span>
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">当前筛选: 全部问题</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-gray-50 text-xs font-semibold text-gray-500 z-10">
                                <tr>
                                    <th className="p-2 border-b">合同/产品</th>
                                    <th className="p-2 border-b">问题</th>
                                    <th className="p-2 border-b">更新</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-gray-100">
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-2">
                                        <div className="font-medium text-gray-800">C-2024-001</div>
                                        <div className="text-gray-500 scale-90 origin-left">Gummies</div>
                                    </td>
                                    <td className="p-2 text-red-600"><i className="fas fa-calendar-times mr-1"></i>缺少发货日期</td>
                                    <td className="p-2 text-gray-500">10m ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-2">
                                        <div className="font-medium text-gray-800">C-2024-005</div>
                                        <div className="text-gray-500 scale-90 origin-left">Powder</div>
                                    </td>
                                    <td className="p-2 text-orange-600"><i className="fas fa-balance-scale-right mr-1"></i>数量不一致</td>
                                    <td className="p-2 text-gray-500">2h ago</td>
                                </tr>
                                <tr className="hover:bg-gray-50 transition-colors">
                                    <td className="p-2">
                                        <div className="font-medium text-gray-800">C-2024-008</div>
                                        <div className="text-gray-500 scale-90 origin-left">Liquids</div>
                                    </td>
                                    <td className="p-2 text-red-600"><i className="fas fa-calendar-times mr-1"></i>缺少发货日期</td>
                                    <td className="p-2 text-gray-500">1d ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataQualityWidget;
