import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const ContractStatusWidget = ({ externalFilter }) => {
    const { t, language } = useLanguage();
    const isZh = language === 'zh';
    const labels = {
        filter: isZh ? '筛选：' : 'Filter:',
        targetUpdated: isZh ? '目标/更新' : 'TARGET & UPDATED',
        signed: isZh ? '签约：' : 'Signed:',
        target: isZh ? '目标：' : 'Target:',
        updated: isZh ? '更新：' : 'Updated:',
        overdue: isZh ? '逾期' : 'Days Overdue',
        remaining: isZh ? '剩余' : 'Days Remaining',
        viewMore: isZh ? '查看更多' : 'Click to view more',
        showLess: isZh ? '收起' : 'Show less',
        contract: isZh ? '合同' : 'Contract',
        summary: isZh ? '汇总' : 'Summary',
        s1: isZh ? '阶段1 合同' : 'S1 Contract',
        s2: isZh ? '阶段2 回款' : 'S2 Payment',
        s3: isZh ? '阶段3 物料' : 'S3 Mat',
        s4: isZh ? '阶段4 生产' : 'S4 Prod',
        s5: isZh ? '阶段5 发货' : 'S5 Ship',
        dataError: isZh ? '数据错误' : 'Data Error',
        ok: isZh ? '正常' : 'OK',
        pending: isZh ? '待处理' : 'Pending',
        missing: isZh ? '缺失' : 'Missing',
        delay: isZh ? '延误' : 'Delay',
        finished: isZh ? '已完成' : 'Finished',
        displayCount: isZh ? '显示' : 'Displaying',
        of: isZh ? '共' : 'of',
        contracts: isZh ? '个合同' : 'contracts',
        with: isZh ? '筛选为' : 'with',
        colorNote: isZh ? '颜色表示延误程度。' : 'Color indicates delay severity.'
    };
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'graph'
    const [filter, setFilter] = useState('all'); // 'all' | 'blocker' | 'delay'
    const [expandedRows, setExpandedRows] = useState({});
    const [showAllRows, setShowAllRows] = useState(false);

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
        {
            id: 'C2411-003',
            brand: isZh ? '小雨伞' : 'Little Umbrella',
            stageNum: 2,
            stage: isZh ? '阶段2 回款' : 'S2 Payment',
            delay: isZh ? '+45天' : '+45d',
            reason: isZh ? '款项未到' : 'Payment Missing',
            overdueDays: 45,
            signedDate: '2024-10-01',
            targetDate: '2024-11-20',
            updated: isZh ? '2天前' : '2d ago',
            isBlocker: true,
            isLimit: false,
            type: 'money'
        },
        {
            id: 'C2411-008',
            brand: isZh ? '能量软糖' : 'PowerGums',
            stageNum: 3,
            stage: isZh ? '阶段3 物料' : 'S3 Material',
            delay: isZh ? '+20天' : '+20d',
            reason: isZh ? '物料未齐' : 'Materials Missing',
            overdueDays: 20,
            signedDate: '2024-10-15',
            targetDate: '2024-12-05',
            updated: isZh ? '1天前' : '1d ago',
            isBlocker: true,
            isLimit: false,
            type: 'materials'
        },
        {
            id: 'C2410-001',
            brand: isZh ? '活力' : 'Vitality',
            // Parent summarizes worst case (Model A)
            stageNum: 4,
            stage: isZh ? '阶段4 生产' : 'S4 Production',
            delay: isZh ? '+15天' : '+15d',
            reason: isZh ? '超出内部目标' : 'Lead Time Breach',
            overdueDays: 15,
            signedDate: '2024-09-28',
            targetDate: '2024-11-15',
            updated: isZh ? '进行中' : 'Active',
            isBlocker: false,
            isLimit: true,
            type: 'leadtime',
            products: [
                {
                    id: 'Model-A',
                    name: isZh ? '型号一' : 'Model-A',
                    stageNum: 4,
                    stage: isZh ? '阶段4 生产' : 'S4 Production',
                    delay: isZh ? '+15天' : '+15d',
                    overdueDays: 15,
                    updated: '2024-10-20',
                    status: 'delayed'
                },
                {
                    id: 'Model-B',
                    name: isZh ? '型号二' : 'Model-B',
                    stageNum: 5,
                    stage: isZh ? '阶段5 发货' : 'S5 Shipping',
                    delay: isZh ? '正常' : 'OK',
                    overdueDays: 0,
                    updated: isZh ? '已完成' : 'Finished',
                    status: 'finished'
                }
            ]
        },
        // Data Issues Mock Objects (Linked to DataQualityWidget)
        {
            id: 'C2411-002',
            brand: isZh ? '样品一' : 'Specimen A',
            stageNum: 3,
            stage: isZh ? '阶段3 物料' : 'S3 Material',
            delay: isZh ? '+5天' : '+5d',
            isDataIssue: true,
            reason: isZh ? '数据错误' : 'Data Error',
            overdueDays: 5,
            signedDate: '2024-11-01',
            targetDate: '2024-12-01',
            updated: isZh ? '1天前' : '1d ago'
        },
        {
            id: 'C2411-005',
            brand: isZh ? '样品二' : 'Specimen B',
            stageNum: 2,
            stage: isZh ? '阶段2 回款' : 'S2 Payment',
            delay: isZh ? '+10天' : '+10d',
            isDataIssue: true,
            reason: isZh ? '数据错误' : 'Data Error',
            overdueDays: 10,
            signedDate: '2024-11-05',
            targetDate: '2024-12-10',
            updated: isZh ? '2天前' : '2d ago'
        },
        {
            id: 'C2411-009',
            brand: isZh ? '样品三' : 'Specimen C',
            stageNum: 4,
            stage: isZh ? '阶段4 生产' : 'S4 Production',
            delay: isZh ? '+8天' : '+8d',
            isDataIssue: true,
            reason: isZh ? '数据错误' : 'Data Error',
            overdueDays: 8,
            signedDate: '2024-10-25',
            targetDate: '2024-12-15',
            updated: isZh ? '3天前' : '3d ago'
        },
        {
            id: 'C2410-022',
            brand: isZh ? '样品四' : 'Specimen D',
            stageNum: 3,
            stage: isZh ? '阶段3 物料' : 'S3 Material',
            delay: isZh ? '+3天' : '+3d',
            isDataIssue: true,
            reason: isZh ? '数据错误' : 'Data Error',
            overdueDays: 3,
            signedDate: '2024-11-10',
            targetDate: '2024-12-05',
            updated: isZh ? '4天前' : '4d ago'
        },
        {
            id: 'C2411-012',
            brand: isZh ? '样品五' : 'Specimen E',
            stageNum: 1,
            stage: isZh ? '阶段1 合同' : 'S1 Contract',
            delay: isZh ? '+2天' : '+2d',
            isDataIssue: true,
            reason: isZh ? '数据错误' : 'Data Error',
            overdueDays: 2,
            signedDate: '2024-11-15',
            targetDate: '2024-12-20',
            updated: isZh ? '5天前' : '5d ago'
        }
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
    const visibleRows = showAllRows ? filteredData : filteredData.slice(0, 4);
    const hiddenCount = Math.max(filteredData.length - visibleRows.length, 0);

    const getFilterLabel = (filterKey) => {
        switch (filterKey) {
            case 'lead-time': return t('kpi_lead_title'); // Map from KPIGrid ID if needed, but externalFilter sends 'delay'
            case 'delay': return t('kpi_lead_title');
            case 'blocker': return t('kpi_pay_title');
            case 'material': return t('kpi_mat_title');
            case 'data': return t('kpi_data_title');
            case 'data_issue': return t('kpi_data_title');
            default: return '';
        }
    };

    return (
        <div className="card lg:col-span-2 h-full flex flex-col">
            <div className="card-header">
                <div className="flex items-center gap-4">
                    <h3 className="card-title flex items-center gap-2">
                        <i className="fa-solid fa-list-check text-ora-primary"></i>
                        <span>{t('p1b_title') || "P1-B. Key Contracts"}</span>
                    </h3>
                    <div className="flex items-center gap-3">
                        <div className="flex bg-gray-100 rounded p-0.5 space-x-1 ml-6">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1 text-xs rounded shadow-sm font-bold border transition-all ${viewMode === 'list' ? 'bg-white text-gray-800 border-gray-200' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                            >
                                {t('btn_list') || "List"}
                            </button>
                            <button
                                onClick={() => setViewMode('graph')}
                                className={`px-3 py-1 text-xs rounded shadow-sm font-bold border transition-all ${viewMode === 'graph' ? 'bg-white text-gray-800 border-gray-200' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                            >
                                {t('btn_graph') || "Graph"}
                            </button>
                        </div>

                        {filter !== 'all' && (
                            <span className="bg-ora-primary text-white text-[10px] px-2 py-0.5 rounded-full font-normal capitalize">
                                {labels.filter} {getFilterLabel(filter)}
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
                    <div className="p-0 overflow-x-auto flex-1 overflow-y-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">{t('th_contract') || "Contract"}</th>
                                    <th className="px-4 py-3 font-semibold">{t('th_stage') || "Stage"}</th>
                                    <th className="px-4 py-3 font-semibold">{t('th_delay') || "DAYS DELAYED"}</th>
                                    <th className="px-4 py-3 font-semibold">{t('th_status') || "Status"}</th>
                                    <th className="px-4 py-3 font-semibold text-right">{labels.targetUpdated}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {visibleRows.map((row) => (
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
                                                        <div className="text-[10px] text-gray-400 mt-0.5">{labels.signed} {row.signedDate}</div>
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
                                                        row.isDataIssue ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                                            'text-gray-500 bg-transparent border-transparent'
                                                    }`}>
                                                    {row.reason}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="font-bold text-gray-700 text-xs">{labels.target} {row.targetDate}</div>
                                                <div className={`text-xs font-bold ${row.overdueDays > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                    {row.overdueDays > 0
                                                        ? (isZh ? `逾期 ${row.overdueDays} 天` : `+${row.overdueDays} Days Overdue`)
                                                        : (isZh ? `剩余 ${Math.abs(row.overdueDays)} 天` : `${Math.abs(row.overdueDays)} Days Remaining`)
                                                    }
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-0.5">{labels.updated} {row.updated}</div>
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
                                                        <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">✔ {labels.finished}</span>
                                                    ) : (
                                                        <span className="text-[10px] text-red-500 font-bold">{labels.delay}：{child.delay}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-2 text-center text-xs text-gray-400 border-t border-gray-100">
                            {isZh
                                ? `显示 ${visibleRows.length}/${filteredData.length} 个合同${filter !== 'all' ? `（${labels.filter}${getFilterLabel(filter)}）` : ''}。`
                                : `Displaying ${visibleRows.length} of ${filteredData.length} contracts ${filter !== 'all' ? `with ${getFilterLabel(filter)}` : ''}.`
                            }
                            {hiddenCount > 0 && (
                                <button
                                    onClick={() => setShowAllRows(true)}
                                    className="ml-2 text-[10px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded border border-dashed border-gray-200 px-2 py-0.5 transition-colors"
                                >
                                    {labels.viewMore}
                                </button>
                            )}
                            {hiddenCount === 0 && showAllRows && filteredData.length > 4 && (
                                <button
                                    onClick={() => setShowAllRows(false)}
                                    className="ml-2 text-[10px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded border border-dashed border-gray-200 px-2 py-0.5 transition-colors"
                                >
                                    {labels.showLess}
                                </button>
                            )}
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
                                <div className="text-left pl-2">{labels.contract}</div>
                                <div>{labels.s1}</div>
                                <div>{labels.s2}</div>
                                <div>{labels.s3}</div>
                                <div>{labels.s4}</div>
                                <div>{labels.s5}</div>
                                <div className="text-right pr-2">{labels.summary}</div>
                            </div>

                            {/* Dynamic Rows */}
                            <div className="space-y-2">
                                {filteredData.map(row => {
                                    const currentStageNum = row.stageNum;
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
                                                    {row.isDataIssue && currentStageNum === 1 ? labels.dataError : labels.ok}
                                                </div>

                                                {/* S2 */}
                                                {currentStageNum === 2 ? (
                                                    row.isDataIssue ? (
                                                        <div className="flex flex-col items-center justify-center h-8 rounded p-1" style={getDataIssueStyle()}>
                                                            <span className="font-bold text-[8px] leading-tight">{labels.dataError}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-500 text-white flex flex-col items-center justify-center h-8 rounded p-1">
                                                            <span className="font-bold leading-tight">{row.delay}</span>
                                                            <span className="text-[8px] leading-tight opacity-90">{labels.pending}</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className={`h-8 rounded flex items-center justify-center ${currentStageNum > 2 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                                        {currentStageNum > 2 && labels.ok}
                                                    </div>
                                                )}

                                                {/* S3 */}
                                                {currentStageNum === 3 ? (
                                                    row.isDataIssue ? (
                                                        <div className="flex flex-col items-center justify-center h-8 rounded p-1" style={getDataIssueStyle()}>
                                                            <span className="font-bold text-[8px] leading-tight">{labels.dataError}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-orange-500 text-white flex flex-col items-center justify-center h-8 rounded p-1">
                                                            <span className="font-bold leading-tight">{row.delay}</span>
                                                            <span className="text-[8px] leading-tight opacity-90">{labels.missing}</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className={`h-8 rounded flex items-center justify-center ${currentStageNum > 3 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                                        {currentStageNum > 3 && labels.ok}
                                                    </div>
                                                )}

                                                {/* S4 */}
                                                {currentStageNum === 4 ? (
                                                    row.isDataIssue ? (
                                                        <div className="flex flex-col items-center justify-center h-8 rounded p-1" style={getDataIssueStyle()}>
                                                            <span className="font-bold text-[8px] leading-tight">{labels.dataError}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-red-400 text-white flex flex-col items-center justify-center h-8 rounded p-1">
                                                            <span className="font-bold leading-tight">{row.delay}</span>
                                                            <span className="text-[8px] leading-tight opacity-90">{labels.delay}</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className={`h-8 rounded flex items-center justify-center ${currentStageNum > 4 ? 'bg-green-500 text-white' : 'bg-gray-100'}`}>
                                                        {currentStageNum > 4 && labels.ok}
                                                    </div>
                                                )}

                                                {/* S5 */}
                                                <div className="bg-gray-100 h-8 rounded"></div>

                                                {/* Summary Column */}
                                                <div className="flex flex-col items-end pr-2 justify-center">
                                                    <div className="font-bold text-gray-700">{labels.target} {row.targetDate}</div>
                                                    <div className={`font-bold ${row.overdueDays > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {row.overdueDays > 0
                                                            ? (isZh ? `+${row.overdueDays}天` : `+${row.overdueDays}d`)
                                                            : (isZh ? `-${Math.abs(row.overdueDays)}天` : `-${Math.abs(row.overdueDays)}d`)
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Child Rows in Graph View */}
                                            {isExpanded && row.products && row.products.map((child, idx) => {
                                                const childStageNum = child.stageNum;
                                                const isFinished = child.status === 'finished';

                                                return (
                                                    <div key={`${row.id}-child-${idx}`} className="grid grid-cols-7 gap-2 items-center text-xs p-1 pb-2 border-b border-dashed border-gray-100 bg-gray-50/50">
                                                        <div className="pl-6 flex items-center gap-1.5 opacity-80">
                                                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                                            <span className={`font-medium ${isFinished ? 'text-gray-400' : 'text-gray-600'}`}>
                                                                {child.name}
                                                            </span>
                                                        </div>

                                                        {/* S1 - Child */}
                                                        <div className={`flex items-center justify-center rounded h-6 font-bold text-[8px] ${isFinished ? 'bg-green-100 text-green-700' : 'bg-green-400 text-white'}`}>{labels.ok}</div>

                                                        {/* S2 - S5 Child Logic Simplified for Demo (Assuming standard progress) */}
                                                        {[2, 3, 4, 5].map(step => (
                                                            <div key={step} className={`h-6 rounded flex items-center justify-center text-[8px] font-bold
                                                    ${childStageNum === step && !isFinished && child.overdueDays > 0 ? 'bg-red-400 text-white' :
                                                                    childStageNum >= step || isFinished ? (isFinished ? 'bg-green-100 text-green-700' : 'bg-green-400 text-white') : 'bg-gray-100'}
                                                `}>
                                                                {(childStageNum >= step || isFinished) && labels.ok}
                                                                {childStageNum === step && !isFinished && child.overdueDays > 0 && (isZh ? `+${child.overdueDays}天` : `+${child.overdueDays}d`)}
                                                            </div>
                                                        ))}

                                                        <div className="text-right pr-2">
                                                            {isFinished ? (
                                                                <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{labels.finished}</span>
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
                            {labels.colorNote}
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ContractStatusWidget;
