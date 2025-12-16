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
        <div id="page-contracts" className="flex-1 flex flex-col h-full bg-[#F5F7FA] overflow-hidden p-6 gap-6">
            {/* 1. Page Header (Title & Date) */}
            <div className="flex-shrink-0 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900" data-i18n="ct_title">{t.ct_title}</h1>

                    {/* Date Picker styled as control */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm cursor-pointer hover:border-gray-300 transition-colors">
                        <i className="fa-regular fa-calendar text-gray-500 text-xs"></i>
                        <span className="text-sm font-medium text-gray-700">{t.ct_date_range || '01/01/2025 - 28/02/2025'}</span>
                    </div>
                </div>
            </div>

            {/* 2. Unified Card (Controls + Table) */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">

                {/* Card Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">

                        {/* Left: Filters & Tabs */}
                        <div className="flex items-center gap-4">
                            {/* Status Filters */}
                            <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                                <button
                                    onClick={() => setActiveFilter('all')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeFilter === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {t.ct_filter_all} <span className="ml-1 opacity-60">· {counts.all}</span>
                                </button>
                                <div className="w-px h-3 bg-gray-200 mx-1"></div>
                                <button
                                    onClick={() => setActiveFilter('pending')}
                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeFilter === 'pending' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {t.ct_status_pending_2 || 'Pending'} <span className="ml-1 opacity-60">· {counts.pending}</span>
                                </button>

                                {/* More Dropdown */}
                                <div className="relative flex">
                                    <button
                                        onClick={handleMoreClick}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${['ongoing', 'done'].includes(activeFilter) ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        {getMoreLabel()} <i className="fa-solid fa-chevron-down text-[10px] ml-1 opacity-60"></i>
                                    </button>
                                    {isMoreOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 shadow-xl rounded-lg z-20 py-1">
                                            <button
                                                onClick={() => selectMoreFilter('ongoing')}
                                                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex justify-between items-center group"
                                            >
                                                <span>{t.ct_status_ongoing_2 || 'On-Going'}</span>
                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full group-hover:bg-white border border-transparent group-hover:border-gray-200 transition-colors">{counts.ongoing}</span>
                                            </button>
                                            <button
                                                onClick={() => selectMoreFilter('done')}
                                                className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 flex justify-between items-center group"
                                            >
                                                <span>{t.ct_status_done || 'Done'}</span>
                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full group-hover:bg-white border border-transparent group-hover:border-gray-200 transition-colors">{counts.done}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-6 bg-gray-200"></div>

                            {/* Role Tabs */}
                            <div className="flex gap-1">
                                {[
                                    { id: 'reqs', label: t.ct_role_reqs },
                                    { id: 'fin', label: t.ct_role_fin },
                                    { id: 'pkg', label: t.ct_role_pkg },
                                    { id: 'plan', label: t.ct_role_plan },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-3 py-1.5 rounded-md text-xs transition-all ${activeTab === tab.id ? 'bg-[#E0F2F1] text-[#006064] font-bold' : 'text-gray-500 font-medium hover:text-gray-800 hover:bg-gray-50'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: Search & Import */}
                        <div className="flex gap-3">
                            <div className="relative">
                                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                                <input
                                    type="text"
                                    placeholder={t.ct_search}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#066070] w-56 shadow-sm transition-all hover:border-gray-400"
                                />
                            </div>
                            <button className="flex items-center gap-2 bg-[#066070] text-white px-4 py-1.5 rounded-md text-sm font-bold hover:bg-[#05505c] transition-colors shadow-sm active:scale-95">
                                <i className="fa-solid fa-plus"></i>
                                <span data-i18n="ct_import">{t.ct_import || 'Import New'}</span>
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 px-2 transition-colors">
                                <i className="fa-solid fa-gear"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="flex-1 overflow-auto bg-white">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-[5] shadow-sm text-xs border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">{t.ct_th_date}</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">{t.ct_th_no}</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-20">{t.ct_th_brand}</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_prod}</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">{t.ct_th_spec}</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-24">{t.ct_th_qty}</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider w-40">{t.ct_th_status}</th>
                                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider w-10"></th>

                                {/* Dynamic Headers */}
                                {activeTab === 'reqs' && (
                                    <>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider border-l border-gray-200">{t.ct_th_reqs_gacc}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_reqs_code}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_reqs_ship}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_reqs_label}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_reqs_other}</th>
                                    </>
                                )}
                                {activeTab === 'fin' && (
                                    <>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider border-l border-gray-200">{t.ct_th_fin_inv}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_fin_dep}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_fin_pre}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_fin_bal}</th>
                                    </>
                                )}
                                {activeTab === 'pkg' && (
                                    <>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider border-l border-gray-200">{t.ct_th_pkg_inv}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_pkg_dep}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_pkg_pre}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_pkg_bal}</th>
                                    </>
                                )}
                                {activeTab === 'plan' && (
                                    <>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider border-l border-gray-200 w-32">{t.ct_th_plan_mat}</th>
                                        <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t.ct_th_plan_sch}</th>
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
        </div>
    );
};

export default Contracts;
