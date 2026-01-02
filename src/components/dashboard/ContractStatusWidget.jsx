import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const ContractStatusWidget = ({ externalFilter }) => {
    const { t } = useLanguage();
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'graph'
    const [filter, setFilter] = useState('all'); // 'all' | 'blocker' | 'delay'
    const [expandedRows, setExpandedRows] = useState({});

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Sync with external filters (from KPI Grid)
    useEffect(() => {
        if (externalFilter) {
            setFilter(externalFilter);
        } else {
            // Optional: reset to all if external filter cleared? 
            // Or keep as is. Let's reset to 'all' if external is null to show "unselect" behavior
            setFilter('all');
        }
    }, [externalFilter]);

    const mockData = [
        { id: 'C2411-003', brand: 'Little Umbrella', stage: 'S2 款项', delay: '+45d', reason: '款项未到', overdueDays: 45, signedDate: '2024-10-01', targetDate: '2024-11-20', updated: '2d ago', isBlocker: true, isLimit: false, type: 'money' },
        { id: 'C2411-008', brand: 'PowerGums', stage: 'S3 物料', delay: '+20d', reason: '物料未齐', overdueDays: 20, signedDate: '2024-10-15', targetDate: '2024-12-05', updated: '1d ago', isBlocker: true, isLimit: false, type: 'materials' },
        {
            id: 'C2410-001',
            brand: 'Vitality',
            // Parent summarizes worst case (Model A)
            stage: 'S4 生产',
            delay: '+15d',
            reason: '超出内部目标',
            overdueDays: 15,
            signedDate: '2024-09-28',
            targetDate: '2024-11-15',
            updated: 'Active',
            isBlocker: false,
            isLimit: true,
            type: 'leadtime',
            products: [
                { id: 'Model-A', name: 'Vitality-Model-A', stage: 'S4 生产', delay: '+15d', overdueDays: 15, updated: '2024-10-20', status: 'delayed' },
                { id: 'Model-B', name: 'Vitality-Model-B', stage: 'S5 发货', delay: 'OK', overdueDays: 0, updated: 'Finished', status: 'finished' }
            ]
        },
        // Data Issues Mock Objects (Linked to DataQualityWidget)
        { id: 'C2411-002', brand: 'Specimen A', stage: 'S3 Material', delay: '+5d', isDataIssue: true, overdueDays: 5, signedDate: '2024-11-01', targetDate: '2024-12-01', updated: '1d ago' },
        { id: 'C2411-005', brand: 'Specimen B', stage: 'S2 Payment', delay: '+10d', isDataIssue: true, overdueDays: 10, signedDate: '2024-11-05', targetDate: '2024-12-10', updated: '2d ago' },
        { id: 'C2411-009', brand: 'Specimen C', stage: 'S4 Production', delay: '+8d', isDataIssue: true, overdueDays: 8, signedDate: '2024-10-25', targetDate: '2024-12-15', updated: '3d ago' },
        { id: 'C2410-022', brand: 'Specimen D', stage: 'S3 Material', delay: '+3d', isDataIssue: true, overdueDays: 3, signedDate: '2024-11-10', targetDate: '2024-12-05', updated: '4d ago' },
        { id: 'C2411-012', brand: 'Specimen E', stage: 'S1 Contract', delay: '+2d', isDataIssue: true, overdueDays: 2, signedDate: '2024-11-15', targetDate: '2024-12-20', updated: '5d ago' },
    ];

    const getFilteredData = () => {
        let data = mockData;
        if (filter === 'blocker') data = mockData.filter(d => d.isBlocker);
        if (filter === 'delay') data = mockData.filter(d => d.isLimit);
        if (filter === 'data_issue') data = mockData.filter(d => d.isDataIssue);

        // Default sort by overdueDays descending (most urgent first)
        return [...data].sort((a, b) => b.overdueDays - a.overdueDays);
    };

    const filteredData = getFilteredData();

    const getFilterLabel = (filterKey) => {
        switch (filterKey) {
            case 'lead-time': return 'Lead Time Breach'; // Map from KPIGrid ID if needed, but externalFilter sends 'delay'
            case 'delay': return 'Lead Time Breach';
            case 'blocker': return 'Payment Blocked';
            case 'material': return 'Material Risk';
            case 'data': return 'Data Issues';
            case 'data_issue': return 'Data Issues';
            default: return '';
        }
    };

    return (
        <div className="card lg:col-span-2">
            <div className="card-header">
                <div className="flex items-center gap-4">
                    <h3 className="card-title flex items-center gap-2">
                        <i className="fa-solid fa-list-check text-ora-primary"></i>
                        <span>{t('p1b_title') || "P1-B. Key Contracts"}</span>
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 rounded p-0.5 space-x-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-2 py-0.5 text-xs rounded shadow-sm font-bold border transition-all ${viewMode === 'list' ? 'bg-white text-gray-800 border-gray-200' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                            >
                                {t('btn_list') || "List"}
                            </button>
                            <button
                                onClick={() => setViewMode('graph')}
                                className={`px-2 py-0.5 text-xs rounded shadow-sm font-bold border transition-all ${viewMode === 'graph' ? 'bg-white text-gray-800 border-gray-200' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                            >
                                {t('btn_graph') || "Graph"}
                            </button>
                        </div>

                        {filter !== 'all' && (
                            <span className="bg-ora-primary text-white text-[10px] px-2 py-0.5 rounded-full font-normal capitalize">
                                Filter: {getFilterLabel(filter)}
                            </span>
                        )}
                    </div>
                </div>
                {/* Internal Filters */}
                {/* Internal Filters Removed as per requirement */}
            </div>

            {/* List View */}
            {
                viewMode === 'list' && (
                    <div className="p-0 overflow-x-auto flex-1">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">{t('th_contract') || "Contract"}</th>
                                    <th className="px-4 py-3 font-semibold">{t('th_stage') || "Stage"}</th>
                                    <th className="px-4 py-3 font-semibold">{t('th_delay') || "DAYS DELAYED"}</th>
                                    <th className="px-4 py-3 font-semibold">{t('th_status') || "Status"}</th>
                                    <th className="px-4 py-3 font-semibold text-right">TARGET & UPDATED</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredData.map((row) => (
                                    <React.Fragment key={row.id}>
                                        <tr className={`hover:bg-gray-50 ${expandedRows[row.id] ? 'bg-gray-50' : ''}`}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-start gap-2">
                                                    {row.products && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}
                                                            className="mt-1 w-4 h-4 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-500 text-[10px] transition-colors"
                                                        >
                                                            <i className={`fa-solid ${expandedRows[row.id] ? 'fa-minus' : 'fa-plus'}`}></i>
                                                        </button>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-800">{row.id}</div>
                                                        <div className="text-xs text-gray-500">{row.brand}</div>
                                                        <div className="text-[10px] text-gray-400 mt-0.5">Signed: {row.signedDate}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${row.type === 'leadtime' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {row.stage}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`font-bold ${row.type === 'materials' ? 'text-orange-500' : 'text-red-500'}`}>{row.delay}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded border text-[10px] ${row.type === 'money' ? 'bg-red-50 text-red-600 border-red-100' :
                                                    row.type === 'materials' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                        'text-gray-500 bg-transparent border-transparent'
                                                    }`}>
                                                    {row.reason}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="font-bold text-gray-700 text-xs">Target: {row.targetDate}</div>
                                                <div className={`text-xs font-bold ${row.overdueDays > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                    {row.overdueDays > 0 ? `+${row.overdueDays} Days Overdue` : `${Math.abs(row.overdueDays)} Days Remaining`}
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">Updated: {row.updated}</div>
                                            </td>
                                        </tr>
                                        {/* Child Rows */}
                                        {expandedRows[row.id] && row.products && row.products.map((child, idx) => (
                                            <tr key={`${row.id}-${idx}`} className="bg-gray-50/50">
                                                <td className="px-4 py-2 pl-12 border-l-4 border-l-transparent">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                                        <div className={`text-xs font-bold ${child.status === 'finished' ? 'text-gray-400' : 'text-gray-700'}`}>
                                                            {child.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${child.status === 'finished' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-700'}`}>
                                                        {child.stage}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`text-xs font-bold ${child.overdueDays > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                        {child.delay}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2"></td>
                                                <td className="px-4 py-2 text-right">
                                                    {child.status === 'finished' ? (
                                                        <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">✔ Finished</span>
                                                    ) : (
                                                        <span className="text-[10px] text-red-500 font-bold">Delay: {child.delay}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-2 text-center text-xs text-gray-400 border-t border-gray-100">
                            {/* Dynamic Footer */}
                            Displaying {filteredData.length} contracts {filter !== 'all' ? `with ${getFilterLabel(filter)}` : ''}.
                        </div>
                    </div>
                )
            }

            {/* Graph View (Matrix) - Simplified Mock for Demo based on HTML */}
            {
                viewMode === 'graph' && (
                    <div className="p-4 overflow-x-auto">
                        <div className="min-w-[600px]">
                            {/* Header */}
                            <div className="grid grid-cols-7 gap-2 mb-2 text-xs font-bold text-gray-500 text-center border-b pb-2">
                                <div className="text-left pl-2">Contract</div>
                                <div>S1 Contract</div>
                                <div>S2 Payment</div>
                                <div>S3 Mat</div>
                                <div>S4 Prod</div>
                                <div>S5 Ship</div>
                                <div className="text-right pr-2">Summary</div>
                            </div>

                            {/* Dynamic Rows */}
                            <div className="space-y-2">
                                {filteredData.map(row => {
                                    const currentStageNum = parseInt(row.stage.substring(1, 2));
                                    const isExpanded = expandedRows[row.id];

                                    // Helper for Data Issue Styling
                                    const getDataIssueStyle = () => ({
                                        backgroundColor: '#E0E0E0',
                                        color: '#374151', // Dark grey text
                                        border: '1px solid #9CA3AF'
                                    });

                                    return (
                                        <div key={row.id} className="transition-all duration-200">
                                            <div
                                                className={`grid grid-cols-7 gap-2 items-center text-xs p-1 rounded cursor-pointer ${isExpanded ? 'bg-gray-50 shadow-inner' : 'hover:bg-gray-50'}`}
                                                onClick={() => row.products && toggleRow(row.id)}
                                            >
                                                <div className="flex items-center gap-2 pl-2">
                                                    {row.products && (
                                                        <i className={`fa-solid ${isExpanded ? 'fa-caret-down' : 'fa-caret-right'} text-gray-400 text-[10px]`}></i>
                                                    )}
                                                    <div className="flex flex-col justify-center">
                                                        <span className="font-bold text-gray-800">{row.id}</span>
                                                        <span className="text-[10px] text-gray-500">{row.brand}</span>
                                                    </div>
                                                </div>

                                                {/* S1 */}
                                                <div className={`flex items-center justify-center rounded h-8 font-bold text-[10px] ${row.isDataIssue && currentStageNum === 1 ? '' : 'bg-green-500 text-white'}`} style={row.isDataIssue && currentStageNum === 1 ? getDataIssueStyle() : {}}>
                                                    {row.isDataIssue && currentStageNum === 1 ? 'Data Error' : 'OK'}
                                                </div>

                                                {/* S2 */}
                                                {currentStageNum === 2 ? (
                                                    row.isDataIssue ? (
                                                        <div className="flex flex-col items-center justify-center h-8 rounded p-1" style={getDataIssueStyle()}>
                                                            <span className="font-bold text-[8px] leading-tight">Data Error</span>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-500 text-white flex flex-col items-center justify-center h-8 rounded p-1">
                                                            <span className="font-bold leading-tight">{row.delay}</span>
                                                            <span className="text-[8px] leading-tight opacity-90">Pending</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className={`h-8 rounded flex items-center justify-center ${currentStageNum > 2 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                                        {currentStageNum > 2 && 'OK'}
                                                    </div>
                                                )}

                                                {/* S3 */}
                                                {currentStageNum === 3 ? (
                                                    row.isDataIssue ? (
                                                        <div className="flex flex-col items-center justify-center h-8 rounded p-1" style={getDataIssueStyle()}>
                                                            <span className="font-bold text-[8px] leading-tight">Data Error</span>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-orange-500 text-white flex flex-col items-center justify-center h-8 rounded p-1">
                                                            <span className="font-bold leading-tight">{row.delay}</span>
                                                            <span className="text-[8px] leading-tight opacity-90">Missing</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className={`h-8 rounded flex items-center justify-center ${currentStageNum > 3 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                                        {currentStageNum > 3 && 'OK'}
                                                    </div>
                                                )}

                                                {/* S4 */}
                                                {currentStageNum === 4 ? (
                                                    row.isDataIssue ? (
                                                        <div className="flex flex-col items-center justify-center h-8 rounded p-1" style={getDataIssueStyle()}>
                                                            <span className="font-bold text-[8px] leading-tight">Data Error</span>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-400 text-white flex flex-col items-center justify-center h-8 rounded p-1">
                                                            <span className="font-bold leading-tight">{row.delay}</span>
                                                            <span className="text-[8px] leading-tight opacity-90">Delay</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className={`h-8 rounded flex items-center justify-center ${currentStageNum > 4 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                                        {currentStageNum > 4 && 'OK'}
                                                    </div>
                                                )}

                                                {/* S5 */}
                                                <div className="bg-gray-100 h-8 rounded"></div>

                                                {/* Summary Column */}
                                                <div className="flex flex-col items-end pr-2 justify-center">
                                                    <div className="font-bold text-gray-700">Target: {row.targetDate}</div>
                                                    <div className={`font-bold ${row.overdueDays > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {row.overdueDays > 0 ? `+${row.overdueDays}d` : `-${Math.abs(row.overdueDays)}d`}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Child Rows in Graph View */}
                                            {isExpanded && row.products && row.products.map((child, idx) => {
                                                const childStageNum = parseInt(child.stage.substring(1, 2));
                                                const isFinished = child.status === 'finished';

                                                return (
                                                    <div key={`${row.id}-child-${idx}`} className="grid grid-cols-7 gap-2 items-center text-xs p-1 pb-2 border-b border-dashed border-gray-100 bg-gray-50/50">
                                                        <div className="pl-6 flex items-center gap-1.5 opacity-80">
                                                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                                            <span className={`font-medium ${isFinished ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {child.name.replace('Vitality-', '')}
                                                            </span>
                                                        </div>

                                                        {/* S1 - Child */}
                                                        <div className={`flex items-center justify-center rounded h-6 font-bold text-[8px] ${isFinished ? 'bg-green-100 text-green-700' : 'bg-green-400 text-white'}`}>OK</div>

                                                        {/* S2 - S5 Child Logic Simplified for Demo (Assuming standard progress) */}
                                                        {[2, 3, 4, 5].map(step => (
                                                            <div key={step} className={`h-6 rounded flex items-center justify-center text-[8px] font-bold
                                                    ${childStageNum === step && !isFinished && child.overdueDays > 0 ? 'bg-red-400 text-white' :
                                                                    childStageNum >= step || isFinished ? (isFinished ? 'bg-green-100 text-green-700' : 'bg-green-400 text-white') : 'bg-gray-100'}
                                                `}>
                                                                {(childStageNum >= step || isFinished) && 'OK'}
                                                                {childStageNum === step && !isFinished && child.overdueDays > 0 && `+${child.overdueDays}d`}
                                                            </div>
                                                        ))}

                                                        <div className="text-right pr-2">
                                                            {isFinished ? (
                                                                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Finished</span>
                                                            ) : (
                                                                <span className="text-red-500 font-bold">{child.delay}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-gray-400 text-center">
                            Color indicates delay severity.
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ContractStatusWidget;
