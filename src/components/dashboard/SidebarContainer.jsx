import React, { useState } from 'react';
import DataQualityWidget from './DataQualityWidget';
import MaterialReadinessWidget from './MaterialReadinessWidget';

const SidebarContainer = ({ onRiskClick }) => {
    const [activeTab, setActiveTab] = useState('dataQuality');

    return (
        <div className="card bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-100 shrink-0">
                <button
                    onClick={() => setActiveTab('dataQuality')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'dataQuality'
                        ? 'text-ora-primary border-b-2 border-ora-primary bg-slate-50'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    Data Quality
                </button>
                <div className="w-[1px] bg-slate-100"></div>
                <button
                    onClick={() => setActiveTab('materialReadiness')}
                    className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'materialReadiness'
                        ? 'text-yellow-600 border-b-2 border-yellow-500 bg-slate-50'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    Material Readiness
                </button>
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
