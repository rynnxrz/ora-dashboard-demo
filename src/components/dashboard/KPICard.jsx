import React from 'react';

const KPICard = ({
    id,
    title,
    subtitle,
    value,
    total,
    unit = '',
    iconClass,
    colorClass,
    bgClass,
    borderClass,
    trend,
    subtext,
    isActive,
    onClick
}) => {
    return (
        <div
            className={`card p-2 border-l-4 cursor-pointer hover:shadow-md transition kpi-card relative overflow-hidden ${borderClass} ${isActive ? 'active-filter bg-white shadow-xl ring-2 ring-offset-2 ring-current transform scale-[1.02] z-10' : ''}`}
            id={id}
            onClick={onClick}
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-sm font-bold text-gray-700 mb-1">{title}</div>
                    <div className="text-xs text-gray-500 uppercase font-bold">{subtitle}</div>
                    <div className={`text-[22px] font-bold mt-1 ${colorClass}`}>
                        {value} <span className="text-sm text-gray-400 font-normal">{total && `/ ${total}`}</span>
                        <div className="text-xs text-gray-400 font-normal mt-0">{unit}</div>
                    </div>
                </div>
                <div className={`${bgClass} p-2 rounded-full ${colorClass}`}>
                    <i className={iconClass}></i>
                </div>
            </div>
            <div className={`mt-2 text-xs font-medium ${colorClass}`}>
                {trend}
            </div>
            <div className="mt-1 text-[10px] text-gray-400">{subtext}</div>

            {/* Active Filter Icon (Pseudo-element mimic) */}
            {isActive && (
                <i className="fa-solid fa-filter absolute top-2 right-2 text-[#2A9D8F] opacity-20 text-3xl pointer-events-none"></i>
            )}
        </div>
    );
};

export default KPICard;
