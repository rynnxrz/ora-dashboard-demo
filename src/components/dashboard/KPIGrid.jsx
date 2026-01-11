import React from 'react';
import KPICard from './KPICard';
import { useLanguage } from '../../contexts/LanguageContext';
import TitleWithIcon from '../common/TitleWithIcon';

const KPIGrid = ({ activeFilter, onKpiClick }) => {
    const { t, language } = useLanguage();
    const isZh = language === 'zh';

    // Helper: Dynamic Color Logic
    const getCardColor = (val) => {
        const value = parseInt(val, 10) || 0;
        if (value >= 10) {
            return {
                text: 'text-red-700',
                bg: 'bg-red-50',
                border: 'border-red-200',
                icon: 'text-red-500'
            };
        } else if (value >= 5) {
            return {
                text: 'text-orange-700',
                bg: 'bg-orange-50',
                border: 'border-orange-200',
                icon: 'text-orange-500'
            };
        } else {

            return {
                text: 'text-gray-700',
                bg: 'bg-gray-50',
                border: 'border-gray-200',
                icon: 'text-gray-400'
            };
        }
    };

    // Helper to render card with automatic styling
    const renderCard = (id, title, subtitle, value, unit, icon, trend, subtext, filterType) => {
        const styles = getCardColor(value);
        return (
            <KPICard
                id={id}
                title={title}
                subtitle={subtitle}
                value={value}
                unit={unit}
                colorClass={styles.text}
                bgClass={styles.bg}
                borderClass={styles.border}
                iconClass={`${icon} ${styles.icon}`}
                trend={trend}
                subtext={subtext}
                isActive={activeFilter === filterType}
                onClick={filterType ? () => onKpiClick(filterType) : undefined}
            />
        );
    };

    return (
        <section>
            <div className="flex items-center gap-2 mb-4">
                <TitleWithIcon as="h2" size="lg" className="text-2xl font-extrabold text-slate-800 tracking-tight">
                    {t('p1_title')}
                </TitleWithIcon>
                <span className="text-xs text-gray-400 italic ml-2">
                    <i className="fa-solid fa-circle-info mr-1"></i>
                    <span>{t('p1_subtitle')}</span>
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {renderCard(
                    "card-lead-time",
                    t('kpi_lead_title') || "Lead Time Breach",
                    t('kpi_lead_sub') || "Cycle > Target",
                    "20",
                    isZh ? "合同" : "Contracts",
                    "fa-solid fa-clock",
                    <span><i className="fa-solid fa-arrow-up"></i> {isZh ? "较上周 +5" : "5 vs last week"}</span>,
                    isZh ? "最长延误：45天" : "Max Delay: +45d",
                    'delay'
                )}

                {renderCard(
                    "card-payment",
                    t('kpi_pay_title') || "Payment Blocked",
                    t('kpi_pay_sub') || "Process Blocked",
                    "8",
                    isZh ? "合同" : "Contracts",
                    "fa-solid fa-hand-holding-dollar",
                    isZh ? "高优先级" : "High Priority",
                    isZh ? "最长等待：12天" : "Longest Pending: 12d",
                    'blocker'
                )}

                {renderCard(
                    "card-material",
                    t('kpi_mat_title') || "Material Risk",
                    t('kpi_mat_sub') || "Prep Risk",
                    "12",
                    isZh ? "合同" : "Contracts",
                    "fa-solid fa-boxes-stacked",
                    isZh ? "需要关注" : "Requires Attention",
                    isZh ? "缺料且临近排产" : "Missing + Near Prod",
                    'material'
                )}

                {renderCard(
                    "card-production",
                    t('kpi_prod_title') || "Production Issues",
                    t('kpi_prod_sub') || "Lines Halted",
                    "5",
                    isZh ? "合同" : "Contracts",
                    "fa-solid fa-industry",
                    isZh ? "影响产出" : "Impacts Output",
                    isZh ? "产出与进度受影响" : "Output & Schedule Impacted",
                    'production'
                )}

                {renderCard(
                    "card-data",
                    t('kpi_data_title') || "Data Issues",
                    t('kpi_data_sub') || "INCOMPLETE DATA",
                    "15",
                    isZh ? "合同" : "Contracts",
                    "fa-solid fa-database",
                    <span className="font-medium">{isZh ? "主要原因：缺少发货日期" : "Main Reason: Missing Shipping Date"}</span>,
                    "",
                    'data_issue'
                )}
            </div>
        </section>
    );
};

export default KPIGrid;
