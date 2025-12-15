import React, { useState } from 'react';
import KPICard from './KPICard';

const KPIGrid = () => {
    const [activeKpi, setActiveKpi] = useState(null);

    const handleKpiClick = (id) => {
        setActiveKpi(activeKpi === id ? null : id);
        // In a real app, this would trigger a filter update in context or parent
    };

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-l-4 border-ora-primary pl-3" data-i18n="p1_title">
                    Part 1. 内部异常雷达 (Internal Exception Radar)
                </h2>
                <span className="text-xs text-gray-400 italic ml-2">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    <span data-i18n="p1_subtitle">Click cards to filter details</span>
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <KPICard
                    id="card-lead-time"
                    title="Lead Time Breach"
                    subtitle="整体周期超出内部目标"
                    value="18"
                    total="142"
                    colorClass="text-red-600"
                    bgClass="bg-red-100" // Note: Text color passed as prop is used for icon too, need care or split props
                    borderClass="border-red-500"
                    iconClass="fa-solid fa-clock"
                    trend={<span><i className="fa-solid fa-arrow-up"></i> 5 vs last week</span>}
                    subtext="Stage SLA > 目标"
                    isActive={activeKpi === 'card-lead-time'}
                    onClick={() => handleKpiClick('card-lead-time')}
                />
                <KPICard
                    id="card-payment"
                    title="Payment Blocked"
                    subtitle="收款环节有阻塞"
                    value="8"
                    unit="Contracts"
                    colorClass="text-orange-500"
                    bgClass="bg-orange-100"
                    borderClass="border-orange-400"
                    iconClass="fa-solid fa-hand-holding-dollar"
                    trend="High Priority"
                    subtext="款项待确认 > 3 天"
                    isActive={activeKpi === 'card-payment'}
                    onClick={() => handleKpiClick('card-payment')}
                />
                <KPICard
                    id="card-material"
                    title="Material Risk"
                    subtitle="物料准备存在风险"
                    value="12"
                    unit="Contracts"
                    colorClass="text-yellow-600"
                    bgClass="bg-yellow-100"
                    borderClass="border-yellow-400"
                    iconClass="fa-solid fa-boxes-stacked"
                    trend="Requires Attention"
                    subtext="物料未到+临近排产"
                    isActive={activeKpi === 'card-material'}
                    onClick={() => handleKpiClick('card-material')}
                />
                <KPICard
                    id="card-data"
                    title="Data Quality"
                    subtitle="数据记录需补充"
                    value="15"
                    unit="Records"
                    colorClass="text-gray-600"
                    bgClass="bg-gray-100"
                    borderClass="border-gray-400"
                    iconClass="fa-solid fa-database"
                    trend={<span className="text-red-500">Affects Forecast</span>}
                    subtext="字段缺失/异常"
                    isActive={activeKpi === 'card-data'}
                    onClick={() => handleKpiClick('card-data')}
                />
            </div>
        </section>
    );
};

export default KPIGrid;
