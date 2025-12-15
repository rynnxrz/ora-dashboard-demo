import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut, Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

const ProcessLeadTimeWidget = () => {
    // P1: (Labeled 3B in HTML) Waterfall
    const p1Data = {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5'],
        datasets: [{
            label: 'Days',
            data: [
                [0, 5],
                [5, 15],
                [15, 20],
                [20, 35],
                [35, 42]
            ],
            backgroundColor: [
                '#2A9D8F', '#2A9D8F', '#E9C46A', '#264653', '#2A9D8F'
            ],
            borderRadius: 4,
            barPercentage: 0.6
        }]
    };
    const p1Options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                formatter: (value) => (value[1] - value[0]) + 'd',
                color: '#fff',
                font: { weight: 'bold' }
            }
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Cumulative Days' } }
        }
    };

    // P2: Breach Rate
    const p2Data = {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5'],
        datasets: [{
            label: 'Breach %',
            data: [10, 68, 20, 45, 5],
            backgroundColor: [
                '#2A9D8F', '#E76F51', '#E9C46A', '#E9C46A', '#2A9D8F'
            ],
            borderRadius: 4,
            barPercentage: 0.6
        }]
    };
    const p2Options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                formatter: (value) => value + '%',
                anchor: 'end',
                align: 'top',
                color: '#666'
            }
        },
        scales: { y: { beginAtZero: true, max: 100 } }
    };

    // P3: Plan Adherence
    const p3Data = {
        labels: ['Gummies', 'Powder', 'Liquids', 'Capsules'],
        datasets: [
            {
                type: 'bar',
                label: 'Adherence %',
                data: [95, 82, 60, 88],
                backgroundColor: '#264653',
                yAxisID: 'y',
                barPercentage: 0.5,
                borderRadius: 4,
                datalabels: {
                    color: '#fff',
                    formatter: (value) => value + '%'
                }
            },
            {
                type: 'line',
                label: 'Avg Delay',
                data: [1, 4, 12, 2],
                borderColor: '#E76F51',
                borderWidth: 2,
                yAxisID: 'y1',
                tension: 0.4,
                datalabels: {
                    align: 'top',
                    color: '#E76F51',
                    formatter: (value) => value + 'd'
                }
            }
        ]
    };
    const p3Options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
        },
        scales: {
            y: { beginAtZero: true, max: 100, position: 'left' },
            y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false } }
        }
    };

    // P4: Material Readiness
    const p4Data = {
        labels: ['Ready', 'Waiting', 'High Risk'],
        datasets: [{
            data: [85, 10, 5],
            backgroundColor: ['#2A9D8F', '#E9C46A', '#E76F51'],
            borderWidth: 0
        }]
    };
    const p4Options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
            legend: { display: false },
            datalabels: { display: false }
        }
    };

    // G1: Factory Growth
    const g1Data = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                type: 'bar',
                label: 'Units',
                data: [800000, 950000, 1050000, 1200000],
                backgroundColor: 'rgba(42, 157, 143, 0.6)',
                yAxisID: 'y',
                barPercentage: 0.5,
                borderRadius: 4,
                datalabels: {
                    color: '#fff',
                    formatter: (value) => (value / 1000) + 'k'
                }
            },
            {
                type: 'line',
                label: 'Lead Time',
                data: [48, 46, 45, 42],
                borderColor: '#264653',
                borderWidth: 2,
                yAxisID: 'y1',
                tension: 0.4,
                datalabels: {
                    align: 'top',
                    color: '#264653',
                    formatter: (value) => value + 'd'
                }
            }
        ]
    };
    const g1Options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 10 } } }
        },
        scales: {
            y: { beginAtZero: true, position: 'left' },
            y1: { beginAtZero: false, min: 30, position: 'right', grid: { drawOnChartArea: false } }
        }
    };


    return (
        <section className="mt-8">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-l-4 border-secondary pl-3" data-i18n="p2_title">
                    Part 2. 交付周期深度透视 (Lead Time Deep Dive)
                </h2>
                <span className="text-xs text-gray-400 italic ml-2">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    <span data-i18n="p2_subtitle">Process Cycle vs Target</span>
                </span>
            </div>

            {/* P0: Contract Entry Latency (Banner) */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <i className="fa-solid fa-stopwatch-20"></i>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-800">合同录入提醒</div>
                        <div className="text-xs text-gray-600">约 15% 的合同在签约后 3 天才录入系统。</div>
                    </div>
                </div>
                <button className="text-xs bg-white border border-gray-300 px-3 py-1 rounded font-bold text-gray-600 hover:bg-gray-50">查看明细</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* P1: Lead Time Waterfall */}
                <div className="card lg:col-span-2">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-industry text-secondary"></i> <span data-i18n="p3b_title">3B. 产能利用率</span></h3>
                        <span className="text-xs text-gray-400">平均天数 (Avg Days)</span>
                    </div>
                    <div className="p-4 h-64">
                        <Bar data={p1Data} options={p1Options} />
                    </div>
                    <div className="card-footer flex justify-between">
                        <span>整体中位周期：42 天</span>
                        <span>基于已完成的合同</span>
                    </div>
                    <div className="px-4 pb-2 text-xs text-gray-500">目前从收齐货款到发货平均约 42 天，其中生产和发货两个阶段耗时最长。</div>
                </div>

                {/* P2: Stage SLA Breach Rate */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-chart-column text-red-500"></i> P2. 各阶段超出内部目标的比例</h3>
                    </div>
                    <div className="p-4 h-64 flex flex-col">
                        <div className="flex-1 relative">
                            <Bar data={p2Data} options={p2Options} />
                        </div>
                        <div className="mt-2 text-xs text-gray-600 border-t pt-2">
                            <div className="font-bold mb-1">主要瓶颈 (Top Bottlenecks):</div>
                            <div className="flex justify-between"><span>1. 物料准备阶段</span> <span className="text-red-600 font-bold">68% 超出目标</span></div>
                            <div className="flex justify-between"><span>2. 生产阶段</span> <span className="text-orange-500 font-bold">45% 超出目标</span></div>
                        </div>
                    </div>
                </div>

                {/* P3: Plan Adherence */}
                <div className="card lg:col-span-2">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-calendar-check text-green-600"></i> P3. 各产线按时交付情况</h3>
                    </div>
                    <div className="p-4 h-64">
                        <Chart type='bar' data={p3Data} options={p3Options} />
                    </div>
                    <div className="card-footer">软糖和胶囊的交付最稳定，粉剂延迟较多。</div>
                </div>

                {/* P4: Materials vs Production */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title"><i className="fa-solid fa-boxes-stacked text-ora-warning"></i> P4. 开工前物料准备情况</h3>
                    </div>
                    <div className="p-4 flex flex-col h-full">
                        <div className="h-40 relative">
                            <Doughnut data={p4Data} options={p4Options} />
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-2xl font-bold text-gray-700">85%</span>
                                <span className="text-[10px] text-gray-400">准备就绪</span>
                            </div>
                        </div>
                        <div className="text-center text-xs text-gray-500 mt-1 mb-2">当前约 85% 的生产批次在开工前物料已准备就绪。</div>
                        <div className="flex-1 mt-2 overflow-y-auto border-t pt-2">
                            <div className="text-xs font-bold text-gray-700 mb-2">风险批次（开工时物料未完全到位）</div>
                            <ul className="space-y-1">
                                <li className="flex justify-between text-xxs text-gray-600"><span>C2411-05 (Gummies)</span> <span className="text-red-500 font-bold">-2d</span></li>
                                <li className="flex justify-between text-xxs text-gray-600"><span>C2411-08 (Powder)</span> <span className="text-red-500 font-bold">-1d</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* G1: Factory Growth */}
            <div className="card mb-8">
                <div className="card-header">
                    <h3 className="card-title"><i className="fa-solid fa-arrow-trend-up text-ora-primary"></i> G1. 工厂产出与效率提升</h3>
                    <span className="text-xs text-gray-400">季度出货趋势</span>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Chart */}
                    <div className="lg:col-span-3 h-64">
                        <Chart type='bar' data={g1Data} options={g1Options} />
                        <div className="text-center text-xs text-gray-500 mt-2">Q4 预计出货 120 万件，较上季度增长 15%；平均交付时间比初始阶段缩短约 3 天。</div>
                    </div>
                    {/* KPIs */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded border border-gray-100">
                            <div className="text-xs text-gray-500 uppercase font-bold">本季度出货总量</div>
                            <div className="text-2xl font-bold text-gray-800 mt-1">1.2M</div>
                            <div className="text-xs text-green-600 mt-1"><i className="fa-solid fa-arrow-up"></i> 15% QoQ</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded border border-gray-100">
                            <div className="text-xs text-gray-500 uppercase font-bold">平均交付时间</div>
                            <div className="text-2xl font-bold text-gray-800 mt-1">42d</div>
                            <div className="text-xs text-green-600 mt-1"><i className="fa-solid fa-arrow-down"></i> 3d vs Baseline</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessLeadTimeWidget;
