import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '../../contexts/LanguageContext';
import TitleWithIcon from '../common/TitleWithIcon';

ChartJS.register(...registerables, ChartDataLabels);

const DataQualityWidget = ({ isEmbedded }) => {
    const { t, language } = useLanguage();
    const isZh = language === 'zh';
    const [filter, setFilter] = useState('all'); // 'all' | 'date' | 'qty' | 'logic' | 'other'
    const [expandedRows, setExpandedRows] = useState({});
    const [showAll, setShowAll] = useState(false);

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
            summary: isZh ? "多项（3）" : "Multiple (3)",
            details: [
                {
                    productName: isZh ? "产品一" : "Product A",
                    issues: isZh ? ["缺失：发货日期", "缺失：价格"] : ["Missing: Shipping Date", "Missing: Price"]
                },
                {
                    productName: isZh ? "产品二" : "Product B",
                    issues: isZh ? ["需要更新"] : ["Update Required"]
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
            summary: isZh ? "缺失：数量" : "Missing: Quantity",
            details: [
                { productName: isZh ? "全部产品" : "All Products", issues: isZh ? ["缺失：数量"] : ["Missing: Quantity"] }
            ],
            currentStage: "S2",
            daysDelayed: 10
        },
        {
            id: "C2411-009",
            isDataIssue: true,
            issueCount: 1,
            type: 'logic',
            summary: isZh ? "需要更新" : "Update Required",
            details: [
                { productName: isZh ? "生产档期" : "Production Slot", issues: isZh ? ["需要更新"] : ["Update Required"] }
            ],
            currentStage: "S4",
            daysDelayed: 8
        },
        {
            id: "C2410-022",
            isDataIssue: true,
            issueCount: 1,
            type: 'other',
            summary: isZh ? "缺失：字段" : "Missing: Fields",
            details: [
                { productName: isZh ? "物料" : "Materials", issues: isZh ? ["缺失：字段"] : ["Missing: Fields"] }
            ],
            currentStage: "S3",
            daysDelayed: 3
        },
        {
            id: "C2411-012",
            isDataIssue: true,
            issueCount: 1,
            type: 'other',
            summary: isZh ? "缺失：合同抬头信息" : "Missing: Header Info",
            details: [
                { productName: isZh ? "合同抬头" : "Contract Header", issues: isZh ? ["缺失：合同抬头信息"] : ["Missing: Header Info"] }
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
    const visibleIssues = showAll ? sortedIssues : sortedIssues.slice(0, 3);
    const hiddenCount = Math.max(sortedIssues.length - visibleIssues.length, 0);

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
        <div className={`flex flex-col h-full ${isEmbedded ? '' : 'card lg:col-span-1'}`}>
            {!isEmbedded && (
                <div className="card-header">
                    <div>
                        <TitleWithIcon as="h3" size="sm" iconClass="fa-solid fa-check-double" className="card-title">
                            {t('p1d_title') || "Data Quality"}
                        </TitleWithIcon>
                        <span className="text-xs text-gray-400">{t('p1d_update') || "Last Update: 10 mins ago"}</span>
                    </div>
                </div>
            )}

            <div className="p-4 flex flex-col gap-4">
                {/* Chart Section */}
                <div className="h-32 relative shrink-0">
                    <Doughnut data={dqData} options={dqOptions} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-2xl font-bold text-gray-700">92%</span>
                        <span className="text-[10px] text-gray-400">{isZh ? '评分' : 'Score'}</span>
                    </div>
                </div>

                {/* List Section */}
                <div className="border-t pt-2">
                    <div className="flex justify-between items-center mb-2">
                        <TitleWithIcon as="h4" size="sm" iconClass="fa-solid fa-triangle-exclamation" className="text-xs font-bold text-gray-700">
                            {t('p1d_list_title') || "Issue List"}
                        </TitleWithIcon>
                        <div className="text-[10px] text-gray-400">
                            {t('p1d_filter_label') || "Filter:"} <span className="font-bold text-ora-primary">{filter === 'all' ? t('dq_filter_all_bad') || 'All Issues' : t(`dq_issue_${filter}`) || filter}</span>
                        </div>
                    </div>
                    <table className="w-full text-left text-xs">
                        <thead className="text-gray-400 border-b border-gray-100">
                            <tr>
                                <th className="py-1 font-medium">{t('p1d_th_contract') || (isZh ? "合同" : "Contract")}</th>
                                <th className="py-1 font-medium text-right">{t('p1d_th_issue') || (isZh ? "问题" : "Issue")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {visibleIssues.length > 0 ? (
                                visibleIssues.map((item) => (
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
                                                    <div className="bg-gray-50 border-y border-gray-100 p-2 pl-6 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
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
                    {hiddenCount > 0 && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="w-full mt-2 py-1.5 text-[10px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded border border-dashed border-gray-200 transition-colors"
                        >
                            {isZh ? '查看更多' : 'Click to view more'}
                        </button>
                    )}
                    {hiddenCount === 0 && showAll && sortedIssues.length > 3 && (
                        <button
                            onClick={() => setShowAll(false)}
                            className="w-full mt-2 py-1.5 text-[10px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded border border-dashed border-gray-200 transition-colors"
                        >
                            {isZh ? '收起' : 'Show less'}
                        </button>
                    )}
                </div>
            </div>
            {/* Footer Removed */}
        </div>
    );
};

export default DataQualityWidget;
