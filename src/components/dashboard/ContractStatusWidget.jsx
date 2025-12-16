import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const ContractStatusWidget = ({ externalFilter }) => {
    const { t } = useLanguage();
    const [viewMode, setViewMode] = useState('list'); // 'list' | 'graph'
    const [filter, setFilter] = useState('all'); // 'all' | 'blocker' | 'delay'

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
        { id: 'C2411-003', brand: 'Little Umbrella', stage: 'S1 款项', delay: '+45d', reason: '款项未到', time: '45d', updated: '2d ago', isBlocker: true, isLimit: false, type: 'money' },
        { id: 'C2411-008', brand: 'PowerGums', stage: 'S2 物料', delay: '+20d', reason: '物料未齐', time: '20d', updated: '1d ago', isBlocker: true, isLimit: false, type: 'materials' },
        { id: 'C2410-001', brand: 'Vitality', stage: 'S4 生产', delay: '+15d', reason: '超出内部目标', time: '60d', updated: 'Active', isBlocker: false, isLimit: true, type: 'leadtime' },
    ];

    const getFilteredData = () => {
        if (filter === 'blocker') return mockData.filter(d => d.isBlocker);
        if (filter === 'delay') return mockData.filter(d => d.isLimit);
        return mockData;
    };

    const filteredData = getFilteredData();

    return (
        <div className="card lg:col-span-2">
            <div className="card-header">
                <div className="flex items-center gap-4">
                    <h3 className="card-title">
                        <i className="fa-solid fa-list-check text-ora-primary"></i>
                        <span>{t('p1b_title') || "P1-B. Key Contracts"}</span>
                    </h3>
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
                </div>
                {/* Internal Filters */}
                <div className="flex space-x-2 text-xs">
                    <span className="text-gray-400 self-center">Filter:</span>
                    <button onClick={() => setFilter('all')} className={`tab-btn ${filter === 'all' ? 'tab-active text-ora-primary font-bold underline underline-offset-4' : 'tab-inactive text-gray-500 hover:text-gray-900'}`}>{t('Tab_all') || "All"}</button>
                    <button onClick={() => setFilter('blocker')} className={`tab-btn ${filter === 'blocker' ? 'tab-active text-ora-primary font-bold underline underline-offset-4' : 'tab-inactive text-gray-500 hover:text-gray-900'}`}>{t('Tab_blocker') || "Blockers"}</button>
                    <button onClick={() => setFilter('delay')} className={`tab-btn ${filter === 'delay' ? 'tab-active text-ora-primary font-bold underline underline-offset-4' : 'tab-inactive text-gray-500 hover:text-gray-900'}`}>{t('Tab_delay') || "Delay"}</button>
                </div>
            </div>

            {/* List View */}
            {viewMode === 'list' && (
                <div className="p-0 overflow-x-auto flex-1">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold">{t('th_contract') || "Contract"}</th>
                                <th className="px-4 py-3 font-semibold">{t('th_stage') || "Stage"}</th>
                                <th className="px-4 py-3 font-semibold">{t('th_delay') || "Max Delay"}</th>
                                <th className="px-4 py-3 font-semibold">{t('th_status') || "Status"}</th>
                                <th className="px-4 py-3 font-semibold text-right">{t('th_time') || "Time"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-gray-800">{row.id}</div>
                                        <div className="text-[10px] text-gray-500">{row.brand}</div>
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
                                        <div className="font-bold">{row.time}</div>
                                        <div className="text-[10px] text-gray-400">{row.updated}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-2 text-center text-xs text-gray-400 border-t border-gray-100">
                        {t('list_footer') || "Sorted by severity."}
                    </div>
                </div>
            )}

            {/* Graph View (Matrix) - Simplified Mock for Demo based on HTML */}
            {viewMode === 'graph' && (
                <div className="p-4 overflow-x-auto">
                    <div className="min-w-[500px]">
                        {/* Header */}
                        <div className="grid grid-cols-6 gap-1 mb-2 text-xs font-bold text-gray-500 text-center">
                            <div className="text-left pl-2">Contract</div>
                            <div>S1 Money</div>
                            <div>S2 Mat</div>
                            <div>S3 Wait</div>
                            <div>S4 Prod</div>
                            <div>S5 Ship</div>
                        </div>

                        {/* Rows - Hardcoded based on HTML example just for visuals as per plan */}
                        <div className="grid grid-cols-6 gap-1 mb-1 text-xs">
                            <div className="flex flex-col justify-center pl-2">
                                <span className="font-bold">C2411-003</span>
                                <span className="text-[10px] text-gray-400">Little Umbrella</span>
                            </div>
                            <div className="bg-red-500 text-white flex flex-col items-center justify-center p-1 rounded">
                                <span className="font-bold">+45</span>
                                <span className="text-[8px]">Pending</span>
                            </div>
                            <div className="bg-gray-100 rounded"></div>
                            <div className="bg-gray-100 rounded"></div>
                            <div className="bg-gray-100 rounded"></div>
                            <div className="bg-gray-100 rounded"></div>
                        </div>

                        <div className="grid grid-cols-6 gap-1 mb-1 text-xs">
                            <div className="flex flex-col justify-center pl-2">
                                <span className="font-bold">C2411-008</span>
                                <span className="text-[10px] text-gray-400">PowerGums</span>
                            </div>
                            <div className="bg-green-500 text-white flex items-center justify-center rounded font-bold">OK</div>
                            <div className="bg-orange-500 text-white flex flex-col items-center justify-center p-1 rounded">
                                <span className="font-bold">+20</span>
                                <span className="text-[8px]">Missing</span>
                            </div>
                            <div className="bg-gray-100 rounded"></div>
                            <div className="bg-gray-100 rounded"></div>
                            <div className="bg-gray-100 rounded"></div>
                        </div>

                        <div className="grid grid-cols-6 gap-1 mb-1 text-xs">
                            <div className="flex flex-col justify-center pl-2">
                                <span className="font-bold">C2410-001</span>
                                <span className="text-[10px] text-gray-400">Vitality</span>
                            </div>
                            <div className="bg-green-500 text-white flex items-center justify-center rounded font-bold">OK</div>
                            <div className="bg-green-500 text-white flex items-center justify-center rounded font-bold">OK</div>
                            <div className="bg-green-500 text-white flex items-center justify-center rounded font-bold">OK</div>
                            <div className="bg-red-400 text-white flex flex-col items-center justify-center p-1 rounded">
                                <span className="font-bold">+15</span>
                                <span className="text-[8px]">Delay</span>
                            </div>
                            <div className="bg-gray-100 rounded"></div>
                        </div>

                    </div>
                    <div className="mt-4 text-xs text-gray-400 text-center">
                        Color indicates delay severity.
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContractStatusWidget;
