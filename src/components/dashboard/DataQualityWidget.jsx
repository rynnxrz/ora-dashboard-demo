import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '../../contexts/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DataQualityWidget = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all'); // 'all' | 'date' | 'qty' | 'logic' | 'other'
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Mock Data Grouped by Contract
    const issueData = [
        {
            id: "C2411-002",
            isDataIssue: true,
            issueCount: 3,
            type: 'date',
            summary: "Multiple (3)",
            details: [
                {
                    productName: "Product A",
                    issues: ["Missing: Shipping Date", "Missing: Price"]
                },
                {
                    productName: "Product B",
                    issues: ["Update Required"]
                }
            ],
            currentStage: "S3",
            daysDelayed: 5
        },
        {
            id: "C2411-005",
            isDataIssue: true,
            issueCount: 1,
            type: 'qty',
            summary: "Missing: Quantity",
            details: [
                { productName: "All Products", issues: ["Missing: Quantity"] }
            ],
            currentStage: "S2",
            daysDelayed: 10
        },
        {
            id: "C2411-009",
            isDataIssue: true,
            issueCount: 1,
            type: 'logic',
            summary: "Update Required",
            details: [
                { productName: "Production Slot", issues: ["Update Required"] }
            ],
            currentStage: "S4",
            daysDelayed: 8
        },
        {
            id: "C2410-022",
            isDataIssue: true,
            issueCount: 1,
            type: 'other',
            summary: "Missing: Fields",
            details: [
                { productName: "Materials", issues: ["Missing: Fields"] }
            ],
            currentStage: "S3",
            daysDelayed: 3
        },
        {
            id: "C2411-012",
            isDataIssue: true,
            issueCount: 1,
            type: 'other',
            summary: "Missing: Header Info",
            details: [
                { productName: "Contract Header", issues: ["Missing: Header Info"] }
            ],
            currentStage: "S1",
            daysDelayed: 2
        }
    ];

    // Filter Logic - Simple check if any issue matches type or if top-level type matches
    const filteredIssues = filter === 'all'
        ? issueData
        : issueData.filter(i => i.type === filter);

    // Sort by Count Descending
    const sortedIssues = [...filteredIssues].sort((a, b) => b.issueCount - a.issueCount);

    // Chart Data (Unchanged visuals, just context)
    const dqData = {
        labels: [t('dq_good') || 'Complete', t('dq_bad') || 'Incomplete'],
        datasets: [{
            data: [92, 8],
            backgroundColor: ['#2A9D8F', '#E76F51'],
            borderWidth: 0
        }]
    };
    const dqOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: { display: false },
            datalabels: { display: false },
            tooltip: { callbacks: { label: (c) => c.label + ': ' + c.raw + '%' } }
        }
    };


    return (
        <div className="card lg:col-span-1 flex flex-col h-full">
            <div className="card-header">
                <div>
                    <h3 className="card-title"><i className="fa-solid fa-check-double text-gray-600"></i> {t('p1d_title') || "Data Quality"}</h3>
                    <span className="text-xs text-gray-400">{t('p1d_update') || "Last Update: 10 mins ago"}</span>
                </div>
            </div>

            <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Chart Section */}
                <div className="h-32 relative shrink-0">
                    <Doughnut data={dqData} options={dqOptions} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-2xl font-bold text-gray-700">92%</span>
                        <span className="text-[10px] text-gray-400">Score</span>
                    </div>
                </div>

                {/* List Section */}
                <div className="flex-1 overflow-y-auto min-h-[150px] border-t pt-2 scroll-smooth">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-gray-700">{t('p1d_list_title') || "Issue List"}</h4>
                        <div className="text-[10px] text-gray-400">
                            {t('p1d_filter_label') || "Filter:"} <span className="font-bold text-ora-primary">{filter === 'all' ? t('dq_filter_all_bad') || 'All Issues' : t(`dq_issue_${filter}`) || filter}</span>
                        </div>
                    </div>
                    <table className="w-full text-left text-xs">
                        <thead className="text-gray-400 border-b border-gray-100">
                            <tr>
                                <th className="py-1 font-medium">Contract</th>
                                <th className="py-1 font-medium text-right">{t('p1d_th_issue') || "Issue"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {sortedIssues.length > 0 ? (
                                sortedIssues.map((item) => (
                                    <React.Fragment key={item.id}>
                                        <tr
                                            className={`hover:bg-gray-50 cursor-pointer ${expandedRows[item.id] ? 'bg-gray-50' : ''}`}
                                            onClick={() => toggleRow(item.id)} // Always toggle to see details
                                        >
                                            <td className="py-1.5 font-bold text-gray-700 flex items-center gap-2">
                                                {/* Chevron on Left */}
                                                <i className={`fa-solid ${expandedRows[item.id] ? 'fa-caret-down' : 'fa-caret-right'} text-gray-400 text-[10px]`}></i>
                                                {item.id}
                                            </td>
                                            <td className="py-1.5 text-right text-gray-500">
                                                {item.issueCount > 1 ? (
                                                    <span className="font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded text-[10px]">
                                                        {item.summary}
                                                    </span>
                                                ) : (
                                                    <span className="truncate max-w-[120px] block ml-auto" title={item.summary}>
                                                        {item.summary}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                        {/* Expanded Content */}
                                        {expandedRows[item.id] && (
                                            <tr className="bg-gray-100/50">
                                                <td colSpan="2" className="p-0">
                                                    <div className="bg-gray-50 border-y border-gray-100 p-2 pl-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] max-h-60 overflow-y-auto">
                                                        <table className="w-full text-[10px]">
                                                            <tbody className="divide-y divide-gray-200/50">
                                                                {item.details.map((subIssue, idx) => (
                                                                    <tr key={idx}>
                                                                        <td className="py-2 font-medium text-gray-600 align-top w-1/3">{subIssue.productName}</td>
                                                                        <td className="py-2 text-right align-top">
                                                                            <div className="flex flex-wrap justify-end gap-1.5">
                                                                                {subIssue.issues.map((issue, issueIdx) => (
                                                                                    <span key={issueIdx} className="bg-[#FFF5F5] text-[#E53E3E] border border-[#FECACA] px-2 py-0.5 rounded whitespace-normal text-right mb-1">
                                                                                        {issue}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="py-4 text-center text-gray-400 italic">{t('p1d_empty') || "No issues found"}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Footer Removed */}
        </div>
    );
};

export default DataQualityWidget;
