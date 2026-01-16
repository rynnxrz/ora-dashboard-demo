import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import TitleWithIcon from '../common/TitleWithIcon';

const DashboardFilters = ({ activeTab, onSwitchTab, tabs }) => {
    const { t, toggleLanguage, language } = useLanguage();
    const isZh = language === 'zh';

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col gap-2">
                <div>
                    <TitleWithIcon as="h1" size="lg" iconClass="fa-solid fa-chart-line" className="text-xl font-bold text-gray-800 tracking-tight">
                        {t('header_title') || "OraNutrition Internal Process & Client Insights Overview"}
                    </TitleWithIcon>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                        <span>{t('header_update') || "Last Update: 2024-11-28 09:00 AM"}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-green-600 font-bold"><i className="fa-solid fa-circle-check"></i> {isZh ? '系统正常' : 'System Online'}</span>
                    </p>
                </div>

                {/* INTEGRATED TABS */}
                {tabs ? (
                    <div role="tablist" className="flex space-x-1 bg-gray-100 p-0.5 rounded-md w-fit mt-1 border border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                onClick={() => onSwitchTab(tab.id)}
                                className={`
                                    px-3 py-1 text-xs font-bold rounded-sm transition-all duration-200
                                    ${activeTab === tab.id
                                        ? 'bg-white text-blue-700 shadow-sm border border-gray-200/50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {/* Global Filters */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white hover:shadow-sm rounded transition-all">
                        <i className="fa-regular fa-calendar"></i>
                        <span>{t('filter_time_q4') || "This Quarter (Q4)"}</span>
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white hover:shadow-sm rounded transition-all">
                        <i className="fa-solid fa-filter"></i>
                        <span>{t('filter_brand_all') || "Brand: All"}</span>
                    </button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white hover:shadow-sm rounded transition-all">
                        <i className="fa-solid fa-layer-group"></i>
                        <span>{t('filter_line_all') || "Line: All"}</span>
                    </button>
                </div>

                <div className="w-px h-8 bg-gray-200 hidden md:block"></div>

                <button className="flex items-center gap-2 bg-ora-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#05505c] transition-colors shadow-sm active:scale-95">
                    <i className="fa-solid fa-rotate"></i>
                    <span>{t('refresh_data') || "Refresh Data"}</span>
                </button>

                <button onClick={toggleLanguage} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                    <i className="fa-solid fa-globe"></i>
                    <span>{language === 'en' ? '中文' : '英文'}</span>
                </button>
            </div>
        </div>
    );
};

export default DashboardFilters;
