import React from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    Title, Tooltip, Legend
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    Title, Tooltip, Legend, ChartDataLabels
);

const FactoryOutputWidget = () => {
    // Mock Data - 4 Quarters Trend
    // Q3: 3500 Labor Days, Q4: 4000 Labor Days (Target)
    const labels = ['Q1', 'Q2', 'Q3', 'Q4 (本季)'];

    // Data for Bar (Total Labor Days) - Showing capacity growth
    const laborDaysData = [2800, 3100, 3500, 4000];

    // Data for Line (Avg Lead Time) - Showing efficiency improvement
    // Q3: 45 days, Q4: 42 days (Target matching P2-A)
    const leadTimeData = [48, 46, 45, 42];

    const data = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: '总产出工时 (Total Labor Days)',
                data: laborDaysData,
                backgroundColor: (ctx) => {
                    return ctx.dataIndex === 3 ? '#6366f1' : '#cbd5e1'; // Highlight Q4
                },
                barThickness: 40,
                borderRadius: 4,
                yAxisID: 'yDesc',
                order: 2,
                datalabels: {
                    color: (ctx) => ctx.dataIndex === 3 ? '#6366f1' : '#64748b',
                    font: { weight: 'bold' },
                    anchor: 'end',
                    align: 'top',
                    offset: -4,
                    formatter: (val) => val.toLocaleString()
                }
            },
            {
                type: 'line',
                label: '平均交付周期 (Lead Time)',
                data: leadTimeData,
                borderColor: '#10b981', // Emerald 500
                backgroundColor: '#10b981',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'yAsc',
                order: 1,
                tension: 0.3, // Soft curve
                datalabels: {
                    color: '#10b981',
                    align: 'top',
                    anchor: 'start',
                    offset: 6,
                    font: { weight: 'bold' },
                    formatter: (val) => `${val}d`
                }
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: { usePointStyle: true, padding: 20 }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.type === 'bar') return ` 总产出: ${ctx.raw.toLocaleString()} Days`;
                        return ` 平均周期: ${ctx.raw} Days`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { weight: 'bold', size: 12 }, color: '#475569' }
            },
            yDesc: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: { display: true, text: 'Total Labor Days', color: '#6366f1' },
                grid: { borderDash: [4, 4], color: '#f1f5f9' },
                max: 5000 // Add some headroom
            },
            yAsc: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: false,
                min: 30,
                max: 60,
                title: { display: true, text: 'Avg Lead Time (Days)', color: '#10b981' },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
                <div>
                    <h3 className="font-bold text-slate-700 leading-none">P2-C. 工厂产出与效能趋势 (Capacity Output & Efficiency)</h3>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Factory Output & Efficiency Trends</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center h-full">
                {/* Chart Section - min-w-0 required for Chart.js in flex container */}
                <div className="flex-1 w-full h-[280px] relative min-w-0">
                    <Chart type='bar' data={data} options={options} />
                </div>

                {/* Summary Section */}
                <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col gap-4">
                    {/* Card 1: Total Output */}
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <i className="fa-solid fa-industry text-4xl text-indigo-600"></i>
                        </div>
                        <span className="text-xs text-indigo-500 font-bold uppercase block mb-1">本季产出总工时</span>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-black text-indigo-700">4,000</span>
                            <span className="text-sm text-indigo-600 font-bold">Days</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-white inline-block px-1.5 py-0.5 rounded shadow-sm border border-indigo-50">
                            <i className="fa-solid fa-arrow-trend-up"></i>
                            ↑ 14.3% QoQ
                        </div>
                    </div>

                    {/* Card 2: Efficiency (Lead Time) */}
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <i className="fa-solid fa-stopwatch text-4xl text-emerald-600"></i>
                        </div>
                        <span className="text-xs text-emerald-600 font-bold uppercase block mb-1">平均交付周期</span>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-black text-emerald-700">42</span>
                            <span className="text-sm text-emerald-600 font-bold">Days</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-white inline-block px-1.5 py-0.5 rounded shadow-sm border border-emerald-50">
                            <i className="fa-solid fa-bolt"></i>
                            ↓ 3d vs Q3
                        </div>
                    </div>

                    {/* Bottom Note */}
                    <div className="px-1 mt-1">
                        <p className="text-[10px] text-slate-400 font-medium leading-tight text-center lg:text-left">
                            <i className="fa-solid fa-circle-info mr-1"></i>
                            Q4 累计交付 100 份合同 (Avg 40d/contract)；实际交付效率较初始阶段(Q1) 提升 12.5%。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FactoryOutputWidget;
