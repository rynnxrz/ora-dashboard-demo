import React from 'react';

const DashboardFilters = () => {
    return (
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900" id="header-title" data-i18n="header_title">
                        OraNutrition 内部流程与客户洞察总览
                    </h1>
                    <p className="text-xs text-gray-500" id="header-update" data-i18n="header_update">
                        上次更新: 2024-11-28 09:00 AM
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    {/* Date Range */}
                    <select className="text-xs border-gray-300 rounded shadow-sm focus:border-ora-primary py-1.5 px-2 bg-gray-50">
                        <option data-i18n="filter_time_q4">📅 时间范围: 本季度 (Q4)</option>
                        <option>📅 2024-06-01 ~ 2024-08-31 (Previous)</option>
                    </select>
                    {/* Brand */}
                    <select className="text-xs border-gray-300 rounded shadow-sm focus:border-ora-primary py-1.5 px-2 bg-gray-50">
                        <option data-i18n="filter_brand_all">品牌: 全部</option>
                        <option>Little Umbrella</option>
                        <option>PowerGums</option>
                    </select>
                    {/* Line Category */}
                    <select className="text-xs border-gray-300 rounded shadow-sm focus:border-ora-primary py-1.5 px-2 bg-gray-50">
                        <option data-i18n="filter_line_all">产线类型: 全部</option>
                        <option>Gummies</option>
                        <option>Powder</option>
                    </select>
                    {/* Status Filter */}
                    <button className="bg-[#297A88] text-white px-4 py-1.5 rounded text-sm hover:bg-[#066070] transition shadow-sm font-bold flex items-center">
                        <i className="fa-solid fa-rotate-right mr-1"></i>
                        <span data-i18n="refresh_data">刷新数据</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardFilters;
