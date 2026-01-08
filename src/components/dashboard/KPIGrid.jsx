import React from 'react';
import KPICard from './KPICard';
import { useLanguage } from '../../contexts/LanguageContext';

const KPIGrid = ({ activeFilter, onKpiClick }) => {
    const { t, language } = useLanguage();
    const isZh = language === 'zh';

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight border-l-4 border-ora-primary pl-3">
                    {t('p1_title')}
                </h2>
                <span className="text-xs text-gray-400 italic ml-2">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    <span>{t('p1_subtitle')}</span>
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <KPICard
                    id="card-lead-time"
                    title={t('kpi_lead_title') || "Lead Time Breach"}
                    subtitle={t('kpi_lead_sub') || "Cycle > Target"}
                    value="18"
                    total="142"
                    unit={isZh ? "合同" : "Contracts"}
                    colorClass="text-red-600"
                    bgClass="bg-red-100"
                    borderClass="border-red-500"
                    iconClass="fa-solid fa-clock"
                    trend={<span><i className="fa-solid fa-arrow-up"></i> {isZh ? "较上周 +5" : "5 vs last week"}</span>}
                    subtext={isZh ? "最长延误：45天" : "Max Delay: +45d"}
                    isActive={activeFilter === 'delay'} // Maps to 'delay' (Severe Delay)
                    onClick={() => onKpiClick('delay')}
                />
                <KPICard
                    id="card-payment"
                    title={t('kpi_pay_title') || "Payment Blocked"}
                    subtitle={t('kpi_pay_sub') || "Process Blocked"}
                    value="8"
                    unit={isZh ? "合同" : "Contracts"}
                    colorClass="text-orange-500"
                    bgClass="bg-orange-100"
                    borderClass="border-orange-400"
                    iconClass="fa-solid fa-hand-holding-dollar"
                    trend={isZh ? "高优先级" : "High Priority"}
                    subtext={isZh ? "最长等待：12天" : "Longest Pending: 12d"}
                    isActive={activeFilter === 'blocker'} // Maps to 'blocker'
                    onClick={() => onKpiClick('blocker')}
                />
                <KPICard
                    id="card-material"
                    title={t('kpi_mat_title') || "Material Risk"}
                    subtitle={t('kpi_mat_sub') || "Prep Risk"}
                    value="12"
                    unit={isZh ? "合同" : "Contracts"}
                    colorClass="text-yellow-600"
                    bgClass="bg-yellow-100"
                    borderClass="border-yellow-400"
                    iconClass="fa-solid fa-boxes-stacked"
                    trend={isZh ? "需要关注" : "Requires Attention"}
                    subtext={isZh ? "缺料且临近排产" : "Missing + Near Prod"}
                    isActive={activeFilter === 'material'} // Not mapped in HTML but good to have
                    onClick={() => onKpiClick('material')}
                />
                <KPICard
                    id="card-data"
                    title={t('kpi_data_title') || "Data Issues"}
                    subtitle={t('kpi_data_sub') || "INCOMPLETE DATA"}
                    value="15"
                    unit={isZh ? "合同" : "Contracts"}
                    colorClass="text-gray-600"
                    bgClass="bg-gray-100"
                    borderClass="border-gray-400"
                    iconClass="fa-solid fa-database"
                    trend={<span className="text-gray-600 font-medium">{isZh ? "主要原因：缺少发货日期" : "Main Reason: Missing Shipping Date"}</span>}
                    subtext=""
                    isActive={activeFilter === 'data_issue'} // Not mapped in HTML but good to have
                    onClick={() => onKpiClick('data_issue')}
                />
            </div>
        </section>
    );
};

export default KPIGrid;
