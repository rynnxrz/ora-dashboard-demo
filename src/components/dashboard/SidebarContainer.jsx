import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import DataQualityWidget from './DataQualityWidget';
import MaterialReadinessWidget from './MaterialReadinessWidget';
import TitleWithIcon from '../common/TitleWithIcon';

const SidebarContainer = ({ onRiskClick }) => {
    const [activeTab, setActiveTab] = useState('dataQuality');
    const { t, language } = useLanguage();
    const isZh = language === 'zh';

    return (
        <div className="card bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            {/* Tabs Header - Segmented Pill Style */}
            <div className="p-3 border-b border-slate-100 shrink-0">
                <TitleWithIcon as="h3" size="sm" iconClass="fa-solid fa-layer-group" className="text-xs font-bold text-slate-600 mb-2">
                    {t('p1c_panel_title')}
                </TitleWithIcon>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('dataQuality')}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'dataQuality'
                            ? 'bg-white text-slate-700 shadow-sm ring-1 ring-black/5'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {isZh ? '数据完整度' : 'Data Quality'}
                    </button>
                    <button
                        onClick={() => setActiveTab('materialReadiness')}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'materialReadiness'
                            ? 'bg-white text-slate-700 shadow-sm ring-1 ring-black/5'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        {isZh ? '物料准备' : 'Material Readiness'}
                    </button>
                </div>
            </div>

            {/* Tab Content Area - No internal padding here, let widgets handle it if needed OR generic padding */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'dataQuality' && (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <DataQualityWidget isEmbedded={true} />
                    </div>
                )}
                {activeTab === 'materialReadiness' && (
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <MaterialReadinessWidget onRiskClick={onRiskClick} isEmbedded={true} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SidebarContainer;
