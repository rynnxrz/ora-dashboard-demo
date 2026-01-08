import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import slogo from '../../assets/images/ora-web/slogo.png';
import vector from '../../assets/images/ora-web/Vector.webp';
import contractsIcon from '../../assets/images/ora-web/Contracts_icon.png';
import reportIcon from '../../assets/images/ora-web/Vector Report.png';
import calendarIcon from '../../assets/images/ora-web/Vector Calendar.png';

const Sidebar = ({ activePage, onSwitchPage }) => {
    const { language } = useLanguage();
    const isZh = language === 'zh';
    return (
        <aside className="w-14 flex-shrink-0 flex flex-col z-20 shadow-sm transition-all bg-[#297A88]">
            <div className="h-14 flex items-center justify-center bg-white border-b border-gray-100">
                <img src={slogo} alt={isZh ? '欧拉' : 'Ora'} className="w-10 h-10 object-contain" />
            </div>
            <nav className="flex-1 overflow-y-auto flex flex-col items-center gap-0 bg-[#297A88]">
                {/* Dashboard (Active) */}
                <button
                    onClick={() => onSwitchPage('dashboard')}
                    className={`w-full h-14 flex items-center justify-center transition-all shadow-inner ${activePage === 'dashboard' ? 'bg-[#066070]' : 'text-white/70 hover:bg-[#066070]/30'}`}
                >
                    <img src={vector} alt={isZh ? '仪表盘' : 'Dashboard'} className="w-6 h-6" />
                </button>
                {/* Contracts */}
                <button
                    onClick={() => onSwitchPage('contracts')}
                    className={`w-full h-14 flex items-center justify-center transition-all group ${activePage === 'contracts' ? 'bg-[#066070]' : 'text-white/70 hover:bg-[#066070]/30'}`}
                >
                    <img src={contractsIcon} alt={isZh ? '合同' : 'Contracts'} className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
                {/* Report */}
                <button
                    onClick={() => onSwitchPage('report')}
                    className="w-full h-14 flex items-center justify-center text-white/70 hover:bg-[#066070]/30 transition-all group"
                >
                    <img src={reportIcon} alt={isZh ? '日报' : 'Report'} className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
                {/* Calendar */}
                <button
                    className="w-full h-14 flex items-center justify-center text-white/70 hover:bg-[#066070]/30 transition-all group"
                >
                    <img src={calendarIcon} alt={isZh ? '日历' : 'Calendar'} className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                </button>
            </nav>
        </aside>
    );
};


export default Sidebar;
