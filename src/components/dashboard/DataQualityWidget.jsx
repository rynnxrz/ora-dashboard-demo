import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useLanguage } from '../../contexts/LanguageContext';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DataQualityWidget = () => {
    const { t } = useLanguage();
    const [filter, setFilter] = useState('all'); // 'all' | 'date' | 'qty' | 'logic' | 'other'

    // Mock Data for "Issue List"
    const issueData = [
        { id: 'C2411-002', issue: t('dq_issue_date') || 'Missing Shipping Date', type: 'date', updated: '2h ago' },
        { id: 'C2411-005', issue: t('dq_issue_qty') || 'Quantity Mismatch', type: 'qty', updated: '5h ago' },
        { id: 'C2411-009', issue: t('dq_issue_logic') || 'Time Logic Error (S2>S3)', type: 'logic', updated: '1d ago' },
        { id: 'C2410-022', issue: t('dq_issue_other') || 'Missing Contact', type: 'other', updated: '2d ago' },
        { id: 'C2411-012', issue: t('dq_issue_other') || 'Missing Label Spec', type: 'other', updated: '3d ago' }
    ];

    const filteredIssues = filter === 'all' ? issueData : issueData.filter(i => i.type === filter);

    // Chart Data
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
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return context.label + ': ' + context.raw + '%';
                    }
                }
            }
        },
        onClick: (event, elements) => {
            // Mock click interaction on chart section if needed
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
                                <th className="py-1 font-medium">{t('p1d_th_contract') || "Contract"}</th>
                                <th className="py-1 font-medium text-right">{t('p1d_th_issue') || "Issue"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredIssues.length > 0 ? (
                                filteredIssues.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 cursor-pointer" onClick={() => setFilter(filter === item.type ? 'all' : item.type)}>
                                        <td className="py-1.5 font-bold text-gray-700">{item.id}</td>
                                        <td className="py-1.5 text-right text-gray-500 truncate max-w-[120px]" title={item.issue}>{item.issue}</td>
                                    </tr>
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
            <div className="card-footer text-[10px] text-gray-400 text-center">
                {t('p1d_footer') || "Click rows to filter by issue type"}
            </div>
        </div>
    );
};

export default DataQualityWidget;
