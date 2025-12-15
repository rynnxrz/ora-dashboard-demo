import React, { useState, useEffect, useMemo } from 'react';
import { CONTRACT_DATA } from '../../data/mockData';
import { TRANSLATIONS } from '../../data/translations';

const Contracts = () => {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, pending, ongoing, done
    const [activeTab, setActiveTab] = useState('reqs'); // reqs, fin, pkg, plan
    const [isMoreOpen, setIsMoreOpen] = useState(false);

    // --- Localization ---
    // Simple hook-like logic for now since we don't have a global context yet
    const getLang = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('lang') || 'en';
    };
    const lang = getLang();
    const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

    // --- Filtering Logic ---
    const filteredContracts = useMemo(() => {
        return CONTRACT_DATA.filter(c => {
            // Text Search
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                c.no.toLowerCase().includes(searchLower) ||
                c.brand.toLowerCase().includes(searchLower) ||
                c.product.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            // Status Filter
            // status in data: New, Pending, Production, Done
            // filter keys: all, pending (mapped to New/Pending), ongoing (Production), done (Done)
            if (activeFilter === 'all') return true;
            if (activeFilter === 'pending') return ['New', 'Pending'].includes(c.status);
            if (activeFilter === 'ongoing') return c.status === 'Production';
            if (activeFilter === 'done') return c.status === 'Done';

            return true;
        });
    }, [searchTerm, activeFilter]);

    // Counts for filters
    const counts = useMemo(() => {
        return {
            all: CONTRACT_DATA.length,
            pending: CONTRACT_DATA.filter(c => ['New', 'Pending'].includes(c.status)).length,
            ongoing: CONTRACT_DATA.filter(c => c.status === 'Production').length,
            done: CONTRACT_DATA.filter(c => c.status === 'Done').length
        };
    }, []);

    // --- Helpers ---
    // Helper for Reqs/Fin cells (Check mark logic)
    const renderCellWithCheck = (text, className = "") => {
        if (['Done', 'Confirmed', 'Paid', 'Check'].includes(text)) {
            return (
                <span className="text-green-600 font-medium flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> {text}
                </span>
            );
        } else if (text === 'Pending') {
            return <span className="text-gray-400">Pending</span>;
        }
        return <span className={className}>{text}</span>;
    };

    // --- Handlers ---
    const handleMoreClick = () => setIsMoreOpen(!isMoreOpen);
    const selectMoreFilter = (filter) => {
        setActiveFilter(filter);
        setIsMoreOpen(false);
    };

    // Helper for "More" button label
    const getMoreLabel = () => {
        if (activeFilter === 'ongoing') return `${t.ct_status_ongoing_2 || 'On-Going'} · ${counts.ongoing}`;
        if (activeFilter === 'done') return `${t.ct_status_done || 'Done'} · ${counts.done}`;
        return t.ct_filter_more || 'More';
    };

    // Common Button Style
    const btnActive = "bg-[#066070] text-white shadow-sm";
    const btnInactive = "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50";

    return (
        <div id="page-contracts" className="flex-1 flex flex-col overflow-hidden relative h-full bg-white">
            {/* Header / Toolbar */}
            <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800" data-i18n="ct_title">{t.ct_title}</h1>
                        <p className="text-xs text-gray-400 mt-1" data-i18n="ct_date_range">{t.ct_date_range}</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                            <input
                                type="text"
                                placeholder={t.ct_search}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#066070] w-64"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-[#066070] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#05505c] transition-colors shadow-sm">
                            <i className="fa-solid fa-file-import"></i>
                            <span data-i18n="ct_import">{t.ct_import}</span>
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex justify-between items-center">
                    {/* Status Filters */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeFilter === 'all' ? btnActive : btnInactive}`}
                        >
                            {t.ct_filter_all} · {counts.all}
                        </button>
                        <button
                            onClick={() => setActiveFilter('pending')}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${activeFilter === 'pending' ? btnActive : btnInactive}`}
                        >
                            {t.ct_status_pending_2 || 'Pending Sched'} · {counts.pending}
                        </button>

                        {/* More Dropdown */}
                        <div className="relative">
                            <button
                                onClick={handleMoreClick}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${['ongoing', 'done'].includes(activeFilter) ? btnActive : btnInactive}`}
                            >
                                {getMoreLabel()} <i className="fa-solid fa-chevron-down text-[10px] ml-1"></i>
                            </button>
                            {isMoreOpen && (
                                <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-10 py-1">
                                    <button
                                        onClick={() => selectMoreFilter('ongoing')}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex justify-between"
                                    >
                                        <span>{t.ct_status_ongoing_2}</span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 rounded-full">{counts.ongoing}</span>
                                    </button>
                                    <button
                                        onClick={() => selectMoreFilter('done')}
                                        className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex justify-between"
                                    >
                                        <span>{t.ct_status_done}</span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 rounded-full">{counts.done}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Role Tabs */}
                    <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                        {[
                            { id: 'reqs', label: t.ct_role_reqs },
                            { id: 'fin', label: t.ct_role_fin },
                            { id: 'pkg', label: t.ct_role_pkg },
                            { id: 'plan', label: t.ct_role_plan },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-1.5 rounded-md text-xs transition-all ${activeTab === tab.id ? 'bg-white text-[#066070] shadow-sm font-bold' : 'hover:text-gray-700 text-gray-500 font-medium'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-[5] shadow-sm">
                        <tr>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.ct_th_date}</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.ct_th_no}</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.ct_th_brand}</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.ct_th_prod}</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{t.ct_th_spec}</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap text-right w-20">{t.ct_th_qty}</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">{t.ct_th_status}</th>
                            <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-8"></th>

                            {/* Dynamic Headers */}
                            {activeTab === 'reqs' && (
                                <>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-purple-50/50 border-l border-purple-100">{t.ct_th_reqs_gacc}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-purple-50/50">{t.ct_th_reqs_code}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-purple-50/50">{t.ct_th_reqs_ship}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-purple-50/50">{t.ct_th_reqs_label}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-purple-50/50">{t.ct_th_reqs_other}</th>
                                </>
                            )}
                            {activeTab === 'fin' && (
                                <>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-blue-50/50 border-l border-blue-100">{t.ct_th_fin_inv}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-blue-50/50">{t.ct_th_fin_dep}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-blue-50/50">{t.ct_th_fin_pre}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-blue-50/50">{t.ct_th_fin_bal}</th>
                                </>
                            )}
                            {activeTab === 'pkg' && (
                                <>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-orange-50/50 border-l border-orange-100">{t.ct_th_pkg_inv}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-orange-50/50">{t.ct_th_pkg_dep}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-orange-50/50">{t.ct_th_pkg_pre}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-orange-50/50">{t.ct_th_pkg_bal}</th>
                                </>
                            )}
                            {activeTab === 'plan' && (
                                <>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-teal-50/50 border-l border-teal-100 w-32">{t.ct_th_plan_mat}</th>
                                    <th className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-teal-50/50">{t.ct_th_plan_sch}</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white text-[13px]">
                        {filteredContracts.map((row, index) => {
                            // Status Cell Logic
                            let statusDotColor = "bg-gray-400";
                            let statusTitle = row.status;
                            let statusSub = "";

                            if (row.status === 'New') {
                                statusDotColor = "bg-[#EF4444]";
                                statusTitle = t.ct_status_new_1 || "New";
                                statusSub = t.ct_status_new_2 || "Contract";
                            } else if (row.status === 'Pending') {
                                statusDotColor = "bg-[#EF4444]";
                                statusTitle = t.ct_status_pending_1 || "Pending";
                                statusSub = t.ct_status_pending_2 || "Preparation";
                            } else if (row.status === 'Production') {
                                statusDotColor = "bg-[#F59E0B]";
                                statusTitle = t.ct_status_ongoing_1 || "Production";
                                statusSub = t.ct_status_ongoing_2 || "On-Going";
                            } else if (row.status === 'Done') {
                                statusDotColor = "bg-[#10B981]";
                                statusTitle = t.ct_status_done || "Done";
                                statusSub = "";
                            }

                            return (
                                <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{row.date}</td>
                                    <td className="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">{row.no}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-700">{row.brand}</td>
                                    <td className="px-3 py-2 text-gray-700 truncate max-w-[160px]" title={row.product}>{row.product}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-gray-500">{row.spec}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-right font-medium text-gray-700">{row.qty}</td>

                                    {/* Complex Status Cell */}
                                    <td className="px-3 py-2">
                                        <div className="flex flex-row items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${statusDotColor} flex-shrink-0`}></div>
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-bold text-gray-800">{statusTitle}</span>
                                                {statusSub && <span className="text-[10px] text-gray-500">{statusSub}</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 text-center text-gray-400">
                                        <button className="hover:text-[#297A88] transition-colors p-1">
                                            <i className="fa-solid fa-ellipsis"></i>
                                        </button>
                                    </td>

                                    {/* Dynamic Cells */}
                                    {activeTab === 'reqs' && (
                                        <>
                                            <td className="px-3 py-2 whitespace-nowrap border-l border-gray-100">{renderCellWithCheck(row.reqs.gacc, "text-gray-400")}</td>
                                            <td className="px-3 py-2 whitespace-nowrap text-gray-400">{row.reqs.coding}</td>
                                            <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-700">{row.reqs.ship}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{renderCellWithCheck(row.reqs.label, "text-gray-400")}</td>
                                            <td className="px-3 py-2 whitespace-nowrap text-gray-400">{row.reqs.other}</td>
                                        </>
                                    )}
                                    {activeTab === 'fin' && (
                                        <>
                                            <td className="px-3 py-2 whitespace-nowrap border-l border-gray-100 font-mono text-xs text-gray-600">{row.fin.inv}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{renderCellWithCheck(row.fin.dep, "text-gray-600")}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{renderCellWithCheck(row.fin.pre, "text-gray-600")}</td>
                                            <td className="px-3 py-2 whitespace-nowrap">{renderCellWithCheck(row.fin.bal, "text-gray-600")}</td>
                                        </>
                                    )}
                                    {activeTab === 'pkg' && (
                                        <>
                                            <td className="px-3 py-2 whitespace-nowrap border-l border-gray-100 text-gray-400">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap text-gray-400">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap text-gray-400">—</td>
                                            <td className="px-3 py-2 whitespace-nowrap text-gray-400">—</td>
                                        </>
                                    )}
                                    {activeTab === 'plan' && (
                                        <>
                                            <td className="px-3 py-2 whitespace-nowrap border-l border-gray-100">
                                                {row.plan.mat === 'Ready' && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">Ready</span>}
                                                {row.plan.mat === 'Partial' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold">Partial</span>}
                                                {row.plan.mat === 'Missing' && <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-[10px] font-bold">Missing</span>}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap text-gray-500">{row.plan.log}</td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredContracts.length === 0 && (
                    <div className="p-10 text-center text-gray-400">
                        No contracts found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contracts;
