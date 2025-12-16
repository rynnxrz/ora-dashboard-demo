import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const ZombieWidget = () => {
    const { t } = useLanguage();
    const [view, setView] = useState('contracts'); // 'contracts' | 'inventory'

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">
                    <i className="fa-solid fa-skull text-gray-500"></i>
                    <span>{t('p1c_title') || "P1-C. Zombie Contracts & Inventory"}</span>
                </h3>
                <div className="flex bg-gray-100 rounded p-0.5 space-x-1">
                    <button
                        onClick={() => setView('contracts')}
                        className={`px-3 py-1 text-xs rounded shadow-sm font-bold border transition-all ${view === 'contracts' ? 'bg-white text-gray-800 border-gray-200' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                    >
                        {t('btn_zombie_contracts') || "Inactive Contracts"}
                    </button>
                    <button
                        onClick={() => setView('inventory')}
                        className={`px-3 py-1 text-xs rounded shadow-sm font-bold border transition-all ${view === 'inventory' ? 'bg-white text-gray-800 border-gray-200' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                    >
                        {t('btn_zombie_inventory') || "Stuck Inventory"}
                    </button>
                </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
                {/* View: Contracts */}
                {view === 'contracts' && (
                    <div id="view-zombie-contracts" className="space-y-3">
                        <div className="text-xs text-gray-400 mb-2">{t('zombie_c_sub') || "Inactive > 45d"}</div>
                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-gray-700">C2408-002 (Vitality)</span>
                                    <span className="text-red-500 font-bold">120d</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2" title="120d (Inactive)">
                                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="font-bold text-gray-700">C2409-015 (Muscle)</span>
                                    <span className="text-red-500 font-bold">95d</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2" title="95d (Inactive)">
                                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* View: Inventory */}
                {view === 'inventory' && (
                    <div id="view-zombie-inventory" className="space-y-3">
                        <div className="text-xs text-gray-400 mb-2">{t('zombie_i_sub') || "Overdue > 7d"}</div>
                        <ul className="space-y-2">
                            <li className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100" title="Produced: 5000, Shipped: 0, Stuck: 5000">
                                <div>
                                    <div className="text-xs font-bold text-gray-800">C2410-001 (Gummies)</div>
                                    <div className="text-[10px] text-red-500">Produced but not shipped (15d)</div>
                                </div>
                                <div className="text-xs font-bold text-gray-800">5k Units</div>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="card-footer">Showing Top 5 by Inactive/Overdue Days</div>
        </div>
    );
};

export default ZombieWidget;
