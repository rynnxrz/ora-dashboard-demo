import React, { useState, useEffect, useMemo } from 'react';
import { CONTRACT_DATA } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';
import TitleWithIcon from '../common/TitleWithIcon';
import ImportContractModal from './ImportContractModal';
import EditContractModal from './EditContractModal';
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

const BRAND_MAP = {
    Little: '小雨伞',
    PowerGums: '能量软糖',
    Vitality: '活力',
    OraNutrition: '欧拉营养'
};
const PRODUCT_MAP = {
    'Liquid Calcium (Xylitol verison 2)': '液体钙（木糖醇版2）',
    'Energy Gels (Caffeine Boost)': '能量胶（咖啡因加强）',
    'Vitamin C Gummies (Lemon)': '维C软糖（柠檬）',
    'Protein Powder (Vanilla)': '蛋白粉（香草）',
    'Collagen Peptides': '胶原蛋白肽',
    'Zinc Drops': '锌滴剂',
    'Liquid Calcium (Xylitol verison 3)': '液体钙（木糖醇版3）',
    'Caffeine Mints': '咖啡因薄荷糖',
    'Magnesium Tablets': '镁片'
};
const SPEC_MAP = {
    '10ml/sachet': '10ml/条包',
    '30g/pack': '30g/袋',
    '60ct/bottle': '60粒/瓶',
    '1kg/tub': '1kg/罐',
    '300g/tub': '300g/罐',
    '30ml/bottle': '30ml/瓶',
    '50ct/tin': '50粒/罐',
    '120ct/bottle': '120粒/瓶'
};
const GACC_MAP = {
    Done: '完成',
    Start: '开始',
    Check: '待确认'
};
const CODING_MAP = {
    Inkjet: '喷码',
    Laser: '激光'
};
const SHIP_MAP = {
    'FOB Shanghai': '离岸价 上海',
    'FOB Shenzhen': '离岸价 深圳',
    'CIF Melbourne': '到岸价 墨尔本',
    'CIF LA': '到岸价 洛杉矶',
    'EXW': '工厂交货',
    'CIF NY': '到岸价 纽约'
};
const LABEL_MAP = {
    Draft: '草稿',
    Reviewing: '审核中',
    Confirmed: '已确认'
};
const OTHER_MAP = {
    'Cert needed': '需证书',
    Palletized: '托盘化'
};
const FIN_MAP = {
    Paid: '已付',
    Pending: '待付'
};
const PLAN_MAT_MAP = {
    Ready: '已就绪',
    Partial: '部分到位',
    Missing: '缺失'
};
const PLAN_LOG_MAP = {
    'Scheduled: 2025-02-10': '已排期：2025-02-10',
    'TBD': '待定',
    'Batch-A start 2025/02/15': '批次A 开始 2025/02/15',
    'Awaiting Artwork': '等待包装稿',
    'Slot: Wk 35': '排期：第35周',
    'In Production (Stage 3)': '生产中（阶段3）',
    'Packing Stage': '包装阶段',
    'Filling Stage': '灌装阶段',
    'Shipped 2025-01-20': '已发货 2025-01-20',
    'Delivered': '已交付'
};

const Contracts = () => {
    // --- State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [brandFilter, setBrandFilter] = useState('all');
    const [activeFilter, setActiveFilter] = useState('all'); // all, pending, ongoing, done
    const [activeTab, setActiveTab] = useState('reqs'); // reqs, fin, pkg, plan
    const [date, setDate] = useState({
        from: new Date(2024, 5, 1),
        to: new Date(2024, 7, 31),
    });

    const [activeMenuRow, setActiveMenuRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState(null);
    const [importDraft, setImportDraft] = useState(null);
    const [isImportEditMode, setIsImportEditMode] = useState(false);
    const [contracts, setContracts] = useState(CONTRACT_DATA);

    // --- Updated Logic to handle Update from Modal ---
    const handleContractUpdate = (updatedData) => {
        setContracts(prev => prev.map(c => {
            if (c.no === updatedData.no) {
                const newContract = { ...c, ...updatedData };

                // Auto Logic Check for status
                const finDep = updatedData.fin?.dep || updatedData.depStatus;
                const finPre = updatedData.fin?.pre || updatedData.preStatus;

                const pkgMat = updatedData.pkg?.mat_status || updatedData.matStatus;
                const pkgPkg = updatedData.pkg?.pkg_status || updatedData.pkgStatus;

                // Check if "Paid" (which might be 'Received' in some selects) and "Arrived" / "Received"
                const isFinanceReady = (finDep === 'Paid' || finDep === 'Received') && (finPre === 'Paid' || finPre === 'Received');

                // Pkg Logic: Check if all packages are 'Received' (or 'Checked'/'Arrived')
                const pkgs = updatedData.packages || c.packages || [];
                const isPkgReady = pkgs.length > 0 && pkgs.every(p => ['Received', 'Arrived', 'Checked'].includes(p.status));

                if (isFinanceReady && isPkgReady && (c.status === 'Pending' || c.status === 'New')) {
                    newContract.status = 'Scheduling';
                }

                return newContract;
            }
            return c;
        }));
        setIsEditModalOpen(false);
    };

    const getSchedulingStatus = (contractData, previousStatus) => {
        const depStatus = contractData.fin?.dep;
        const preStatus = contractData.fin?.pre;
        const checkStatus = contractData.pkg?.check_status;
        const arriveDate = contractData.pkg?.arrive_date;

        const isFinanceReady = depStatus === 'Paid' && preStatus === 'Paid';
        const isPkgReady = ['Received', 'Arrived', 'Checked'].includes(checkStatus) && arriveDate && arriveDate !== '—';

        if (isFinanceReady && isPkgReady) {
            return 'Scheduling';
        }
        return previousStatus || contractData.status || 'Pending';
    };

    // --- Logic to handle Create/Edit from Import Modal ---
    const handleContractSave = (newContract) => {
        if (isImportEditMode && importDraft) {
            setContracts(prev => prev.map(c => {
                if (c.no === importDraft.no) {
                    const nextStatus = getSchedulingStatus(newContract, c.status);
                    return { ...c, ...newContract, id: c.id || newContract.id, status: nextStatus };
                }
                return c;
            }));
            setIsImportModalOpen(false);
            setImportDraft(null);
            setIsImportEditMode(false);
            return;
        }
        setContracts(prev => [newContract, ...prev]);
        setIsImportModalOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = () => setActiveMenuRow(null);
        if (activeMenuRow !== null) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeMenuRow]);

    // --- Localization ---
    const { language, t } = useLanguage();
    const isZh = language === 'zh';

    const mapValue = (value, map) => (isZh ? (map[value] || value) : value);

    const displayContracts = useMemo(() => {
        if (!isZh) return contracts;
        return contracts.map(c => ({
            ...c,
            brand: mapValue(c.brand, BRAND_MAP),
            product: mapValue(c.product, PRODUCT_MAP),
            spec: mapValue(c.spec, SPEC_MAP),
            reqs: {
                ...c.reqs,
                gacc: mapValue(c.reqs.gacc, GACC_MAP),
                coding: mapValue(c.reqs.coding, CODING_MAP),
                ship: mapValue(c.reqs.ship, SHIP_MAP),
                labeling: mapValue(c.reqs.label, LABEL_MAP),
                other: mapValue(c.reqs.other, OTHER_MAP)
            },
            fin: {
                ...c.fin,
                dep: mapValue(c.fin.dep, FIN_MAP),
                pre: mapValue(c.fin.pre, FIN_MAP),
                bal: mapValue(c.fin.bal, FIN_MAP)
            },
            plan: {
                ...c.plan,
                mat: mapValue(c.plan.mat, PLAN_MAT_MAP),
                log: mapValue(c.plan.log, PLAN_LOG_MAP)
            }
        }));
    }, [isZh, contracts]);

    const brandOptions = useMemo(() => {
        const brands = new Set(displayContracts.map(c => c.brand).filter(Boolean));
        return Array.from(brands);
    }, [displayContracts]);

    // --- Filtering Logic ---
    const filteredContracts = useMemo(() => {
        return displayContracts.filter(c => {
            // Text Search
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                c.no.toLowerCase().includes(searchLower) ||
                c.brand.toLowerCase().includes(searchLower) ||
                c.product.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;

            if (brandFilter !== 'all' && c.brand !== brandFilter) return false;

            // Status Filter
            if (activeFilter === 'all') return true;
            if (activeFilter === 'pending') return ['New', 'Pending', 'Scheduling'].includes(c.status);
            if (activeFilter === 'ongoing') return c.status === 'Production';
            if (activeFilter === 'done') return c.status === 'Done';

            return true;
        }).sort((a, b) => {
            const statusOrder = {
                'New': 1,
                'Pending': 2,
                'Scheduling': 3,
                'Production': 4,
                'Done': 5
            };
            const orderA = statusOrder[a.status] || 99;
            const orderB = statusOrder[b.status] || 99;
            return orderA - orderB;
        });
    }, [searchTerm, brandFilter, activeFilter, displayContracts]);

    // Counts for filters
    const counts = useMemo(() => {
        return {
            all: contracts.length,
            pending: contracts.filter(c => ['New', 'Pending', 'Scheduling'].includes(c.status)).length,
            ongoing: contracts.filter(c => c.status === 'Production').length,
            done: contracts.filter(c => c.status === 'Done').length
        };
    }, [contracts]);

    // --- Helpers ---
    const renderCellWithCheck = (text, className = "") => {
        const doneValues = ['Done', 'Confirmed', 'Paid', 'Check', '完成', '已确认', '已付', '待确认', 'Received', 'Arrived', 'Checked'];
        const pendingValues = ['Pending', '待处理', '待付'];
        if (doneValues.includes(text)) {
            return (
                <span className="text-green-600 font-medium flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> {text}
                </span>
            );
        } else if (pendingValues.includes(text)) {
            return <span className="text-gray-400">{isZh ? '待处理' : 'Pending'}</span>;
        }
        return <span className={className}>{text}</span>;
    };

    // --- Options ---
    const statusOptions = useMemo(() => [
        { value: 'all', label: `${t('ct_filter_all') || 'All Status'} (${counts.all})` },
        { value: 'pending', label: `${t('ct_status_pending_2') || 'Pending'} (${counts.pending})` },
        { value: 'ongoing', label: `${t('ct_status_ongoing_2') || 'On-Going'} (${counts.ongoing})` },
        { value: 'done', label: `${t('ct_status_done') || 'Done'} (${counts.done})` }
    ], [counts, t]);

    return (
        <div id="page-contracts" className="flex-1 flex flex-col overflow-hidden relative h-full bg-white">
            <div className="flex-1 overflow-auto bg-white relative p-6">

                {/* Header & Toolbar */}
                <div className="flex flex-col gap-6 mb-6">
                    {/* Title Row */}
                    <div className="flex justify-between items-end">
                        <TitleWithIcon as="h1" size="lg" className="text-2xl font-bold text-gray-900 tracking-tight" data-i18n="ct_title">
                            {t('ct_title')}
                            <span className="ml-4 inline-flex items-center px-3 py-2 border border-gray-200 rounded-md bg-white text-sm text-gray-700 shadow-sm font-normal">
                                <i className="fa-regular fa-calendar mr-2 text-gray-400"></i>
                                <span>
                                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </span>
                            </span>
                        </TitleWithIcon>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder={t('ct_search') || "Search contracts..."}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 h-10 w-full bg-white border-gray-200 focus:border-[#066070] focus:ring-[#066070]/20 rounded-lg transition-all"
                                />
                            </div>
                            <Button
                                onClick={() => {
                                    setImportDraft(null);
                                    setIsImportEditMode(false);
                                    setIsImportModalOpen(true);
                                }}
                                className="bg-[#0f172a] text-white hover:bg-[#1e293b] gap-2 shadow-sm"
                            >
                                <i className="fa-solid fa-plus text-xs"></i>
                                <span data-i18n="ct_import">{t('ct_import') || 'Import New'}</span>
                            </Button>
                        </div>
                    </div>

                    {/* Filter Toolbar */}
                    <div className="flex flex-wrap justify-between items-center gap-4 w-full">
                        {/* Left Side: Filters */}
                        <div className="flex items-center gap-3">
                            {/* Status Filter */}
                            <div className="w-56">
                                <Select
                                    value={activeFilter}
                                    onChange={setActiveFilter}
                                    options={statusOptions}
                                    className="w-full h-10 border-gray-200 rounded-lg"
                                />
                            </div>

                            {/* Brand Filter */}
                            <div className="w-48">
                                <Select
                                    value={brandFilter}
                                    onChange={setBrandFilter}
                                    options={[
                                        { value: 'all', label: isZh ? '全部品牌' : 'All Brands' },
                                        ...brandOptions.map(b => ({ value: b, label: b }))
                                    ]}
                                    className="w-full h-10 border-gray-200 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Right Side: Views */}
                        <div className="flex items-center gap-3">
                            {/* View Tabs */}
                            <div className="flex items-center p-1 bg-gray-100/80 rounded-lg border border-gray-200/50 h-10">
                                {[
                                    { id: 'reqs', label: 'Reqs' },
                                    { id: 'fin', label: t('ct_role_fin') || 'Finance' },
                                    { id: 'pkg', label: 'Pkg' },
                                    { id: 'plan', label: 'Plan & Report' },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={activeTab === tab.id
                                            ? 'px-4 h-full rounded-md text-sm font-semibold transition-all bg-white text-[#066070] shadow-sm ring-1 ring-black/5 flex items-center justify-center'
                                            : 'px-4 h-full rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 transition-all flex items-center justify-center'}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto border rounded-lg border-gray-200">
                    <table className="w-full text-left border-collapse whitespace-nowrap table-fixed">
                        <colgroup>
                            {/* Left Fixed Group */}
                            <col style={{ width: '6%' }} />  {/* Date */}
                            <col style={{ width: '8%' }} />  {/* Contract No */}
                            <col style={{ width: '6%' }} />  {/* Brand */}
                            <col style={{ width: '14%' }} /> {/* Product */}
                            <col style={{ width: '8%' }} />  {/* Spec */}
                            <col style={{ width: '6%' }} />  {/* Qty */}
                            <col style={{ width: '8%' }} />  {/* Status */}
                            <col style={{ width: '3%' }} />  {/* Action */}

                            {/* Right Dynamic Group */}
                            {activeTab === 'reqs' && (
                                <>
                                    <col style={{ width: '4%' }} />
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: '12%' }} />
                                    <col style={{ width: '7%' }} />
                                    <col style={{ width: '5%' }} />
                                    <col style={{ width: 'auto' }} />
                                </>
                            )}
                            {activeTab === 'fin' && (
                                <>
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: 'auto' }} />
                                </>
                            )}
                            {activeTab === 'pkg' && (
                                <>
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '6%' }} />
                                    <col style={{ width: 'auto' }} />
                                </>
                            )}
                            {activeTab === 'plan' && (
                                <>
                                    <col style={{ width: '8%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: '6%' }} />
                                    <col style={{ width: '10%' }} />
                                    <col style={{ width: 'auto' }} />
                                </>
                            )}
                        </colgroup>
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-3 py-3 font-semibold">{t('ct_th_date')}</th>
                                <th className="px-3 py-3 font-semibold">{t('ct_th_no')}</th>
                                <th className="px-3 py-3 font-semibold">{t('ct_th_brand')}</th>
                                <th className="px-3 py-3 font-semibold">{t('ct_th_prod')}</th>
                                <th className="px-3 py-3 font-semibold">{t('ct_th_spec')}</th>
                                <th className="px-3 py-3 font-semibold">{t('ct_th_qty')}</th>
                                <th className="px-3 py-3 font-semibold w-32">{t('ct_th_status')}</th>
                                <th className="px-3 py-3 font-semibold text-center w-10"></th>

                                {activeTab === 'reqs' && (
                                    <>
                                        <th className="px-3 py-3 font-semibold border-l border-gray-200">GACC</th>
                                        <th className="px-3 py-3 font-semibold">Coding Format</th>
                                        <th className="px-3 py-3 font-semibold">Shipping Method</th>
                                        <th className="px-3 py-3 font-semibold">Labeling</th>
                                        <th className="px-3 py-3 font-semibold">Notes</th>
                                        <th className="px-3 py-3 font-semibold"></th>
                                    </>
                                )}
                                {activeTab === 'fin' && (
                                    <>
                                        <th className="px-3 py-3 font-semibold border-l border-gray-200">{t('ct_th_fin_inv')}</th>
                                        <th className="px-3 py-3 font-semibold">{t('ct_th_fin_dep')}</th>
                                        <th className="px-3 py-3 font-semibold">{t('ct_th_fin_pre')}</th>
                                        <th className="px-3 py-3 font-semibold">{t('ct_th_fin_bal')}</th>
                                        <th className="px-3 py-3 font-semibold"></th>
                                    </>
                                )}
                                {activeTab === 'pkg' && (
                                    <>
                                        <th className="px-3 py-3 font-semibold border-l border-gray-200">Materials</th>
                                        <th className="px-3 py-3 font-semibold">Packaging</th>
                                        <th className="px-3 py-3 font-semibold">Arrive Date</th>
                                        <th className="px-3 py-3 font-semibold">Check</th>
                                        <th className="px-3 py-3 font-semibold"></th>
                                    </>
                                )}
                                {activeTab === 'plan' && (
                                    <>
                                        <th className="px-3 py-3 font-semibold border-l border-gray-200">Prod Line</th>
                                        <th className="px-3 py-3 font-semibold">Schedule</th>
                                        <th className="px-3 py-3 font-semibold">Actual Qty</th>
                                        <th className="px-3 py-3 font-semibold">Notes</th>
                                        <th className="px-3 py-3 font-semibold"></th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-xs text-gray-700 divide-y divide-gray-100 bg-white">
                            {filteredContracts.map((row, index) => {
                                let statusDotColor = "bg-gray-400";
                                let statusTitle = row.status;
                                let statusSub = "";

                                if (row.status === 'New') {
                                    statusDotColor = "bg-[#EF4444]";
                                    statusTitle = t('ct_status_new_1') || "New";
                                    statusSub = t('ct_status_new_2') || "Contract";
                                } else if (row.status === 'Pending') {
                                    statusDotColor = "bg-[#EF4444]";
                                    statusTitle = t('ct_status_pending_1') || "Pending";
                                    statusSub = t('ct_status_pending_2') || "Preparation";
                                } else if (row.status === 'Scheduling') {
                                    statusDotColor = "bg-[#EF4444]";
                                    statusTitle = "Pending";
                                    statusSub = "Scheduling";
                                } else if (row.status === 'Production') {
                                    statusDotColor = "bg-[#F59E0B]";
                                    statusTitle = t('ct_status_ongoing_1') || "Production";
                                    statusSub = t('ct_status_ongoing_2') || "On-Going";
                                } else if (row.status === 'Done') {
                                    statusDotColor = "bg-[#10B981]";
                                    statusTitle = t('ct_status_done') || "Done";
                                    statusSub = "";
                                }

                                return (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors border-b border-gray-100 group h-16">
                                        <td className="px-3 py-2 text-gray-500 truncate" title={row.date}>{row.date}</td>
                                        <td className="px-3 py-2 font-medium truncate" title={row.no}>{row.no}</td>
                                        <td className="px-3 py-2 truncate" title={row.brand}>{row.brand}</td>
                                        <td className="px-3 py-2 truncate" title={row.product}>{row.product}</td>
                                        <td className="px-3 py-2 text-gray-500 truncate" title={row.spec}>{row.spec}</td>
                                        <td className="px-3 py-2 truncate" title={row.qty}>{row.qty}</td>

                                        <td className="px-3 py-2">
                                            <div className="flex flex-row items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${statusDotColor} flex-shrink-0`}></div>
                                                <div className="flex flex-col leading-tight">
                                                    <span className="font-bold text-gray-800">{statusTitle}</span>
                                                    {statusSub && <span className="text-[10px] text-gray-500">{statusSub}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-center text-gray-500 relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuRow(activeMenuRow === index ? null : index);
                                                }}
                                                className={`hover:text-[#297A88] transition-colors p-1 ${activeMenuRow === index ? 'text-[#297A88]' : ''}`}
                                            >
                                                <i className="fa-solid fa-ellipsis"></i>
                                            </button>
                                            {activeMenuRow === index && (
                                                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 flex flex-col py-1 text-left">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const originalContract = contracts.find(c => c.no === row.no) || row;
                                                            setSelectedContract(row);
                                                            setImportDraft(originalContract);
                                                            setIsImportEditMode(true);
                                                            setIsImportModalOpen(true);
                                                            setActiveMenuRow(null);
                                                        }}
                                                        className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left font-medium"
                                                    >
                                                        Edit Product
                                                    </button>
                                                    <button className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 w-full text-left font-medium">
                                                        Start Scheduling
                                                    </button>
                                                    <button className="px-4 py-2 text-xs text-red-600 hover:bg-gray-50 w-full text-left font-medium">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        {activeTab === 'reqs' && (
                                            <>
                                                <td className="px-3 py-2 whitespace-nowrap border-l border-gray-100 text-gray-400">{renderCellWithCheck(row.reqs.gacc, "text-gray-400")}</td>
                                                <td className="px-3 py-2 truncate text-gray-400" title={row.reqs.coding}>{row.reqs.coding}</td>
                                                <td className="px-3 py-2 truncate font-medium" title={row.reqs.ship}>{row.reqs.ship}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-gray-400">{renderCellWithCheck(row.reqs.label, "text-gray-400")}</td>
                                                <td className="px-3 py-2 truncate text-gray-400" title={row.reqs.other}>{row.reqs.other}</td>
                                                <td className="px-3 py-2"></td>
                                            </>
                                        )}
                                        {activeTab === 'fin' && (
                                            <>
                                                <td className="px-3 py-2 truncate border-l border-gray-100 font-mono" title={row.fin.inv}>{row.fin.inv}</td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {renderCellWithCheck(row.fin.dep, "text-gray-600")}
                                                    {row.fin.date_dep && row.fin.date_dep !== '—' && <div className="text-[10px] text-gray-400">{row.fin.date_dep}</div>}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {renderCellWithCheck(row.fin.pre, "text-gray-600")}
                                                    {row.fin.date_pre && row.fin.date_pre !== '—' && <div className="text-[10px] text-gray-400">{row.fin.date_pre}</div>}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap">
                                                    {renderCellWithCheck(row.fin.bal, "text-gray-600")}
                                                    {row.fin.date_bal && row.fin.date_bal !== '—' && <div className="text-[10px] text-gray-400">{row.fin.date_bal}</div>}
                                                </td>
                                                <td className="px-3 py-2"></td>
                                            </>
                                        )}
                                        {activeTab === 'pkg' && (
                                            <>
                                                <td className="px-3 py-2 whitespace-nowrap border-l border-gray-100">{renderCellWithCheck(row.pkg.mat_status, "text-gray-500")}</td>
                                                <td className="px-3 py-2 whitespace-nowrap">{renderCellWithCheck(row.pkg.pkg_status, "text-gray-500")}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-gray-500">{row.pkg.arrive_date}</td>
                                                <td className="px-3 py-2 whitespace-nowrap">{renderCellWithCheck(row.pkg.check_status, "text-gray-500")}</td>
                                                <td className="px-3 py-2"></td>
                                            </>
                                        )}
                                        {activeTab === 'plan' && (
                                            <>
                                                <td className="px-3 py-2 whitespace-nowrap border-l border-gray-100 text-gray-600 font-medium">{row.plan.line}</td>
                                                <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                                                    {row.plan.start_date !== '—' ? (
                                                        <div className="flex flex-col">
                                                            <span>{row.plan.start_date}</span>
                                                            <span className="text-[10px] text-gray-400">to {row.plan.end_date}</span>
                                                        </div>
                                                    ) : '—'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-gray-600 font-mono">
                                                    {row.plan.qty_actual > 0 ? row.plan.qty_actual.toLocaleString() : '—'}
                                                </td>
                                                <td className="px-3 py-2 truncate text-gray-500" title={row.plan.log}>{row.plan.log}</td>
                                                <td className="px-3 py-2"></td>
                                            </>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredContracts.length === 0 && (
                    <div className="p-10 text-center text-gray-400">
                        {isZh ? '未找到合同。' : 'No contracts found.'}
                    </div>
                )}
            </div>

            {/* Render Both Modals */}
            <ImportContractModal
                isOpen={isImportModalOpen}
                onClose={() => {
                    setIsImportModalOpen(false);
                    setImportDraft(null);
                    setIsImportEditMode(false);
                }}
                onSave={handleContractSave}
                initialData={importDraft}
                isEditMode={isImportEditMode}
            />

            <EditContractModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleContractUpdate}
                contract={selectedContract}
            />
        </div>
    );
};

export default Contracts;
