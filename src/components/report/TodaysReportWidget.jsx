import React from 'react';
import { REPORT_DATA } from '../../data/mockData';
import { CONTRACT_DATA } from '../../data/mockData';

const TodaysReportWidget = () => {
    // Enrich report data with contract details
    const enrichedData = REPORT_DATA.map(item => {
        const contract = CONTRACT_DATA.find(c => c.no === item.contractNo);
        return {
            ...item,
            brand: contract ? contract.brand : 'Unknown',
            product: contract ? contract.product : 'Unknown Product'
        };
    });

    return (
        <div className="w-80 flex bg-white flex-col rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-[#FAFAFA]">
                <h2 className="font-bold text-lg text-gray-700">Today's Report</h2>
                <div className="text-xs text-gray-400 mt-1">4 Active Production Tasks</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                {enrichedData.map((task, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.bgColor}`}></div>

                        <div className="flex justify-between items-start mb-2 pl-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.badgeBg} ${task.badgeText}`}>
                                {task.status.toUpperCase()}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"><i className="fa-solid fa-ellipsis"></i></button>
                        </div>

                        <div className="pl-2">
                            <h3 className="font-bold text-gray-800 text-sm">{task.brand}</h3>
                            <div className="text-xs text-gray-500 mb-2 truncate">{task.product}</div>

                            <div className="flex justify-between items-end mt-3">
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase">Planned</div>
                                    <div className="font-mono font-bold text-gray-700">{task.planned.toLocaleString()}</div>
                                </div>
                                {task.actual !== null ? (
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-400 uppercase">Actual</div>
                                        <div className={`font-mono font-bold ${task.actual < task.planned ? 'text-orange-500' : 'text-green-600'}`}>
                                            {task.actual.toLocaleString()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-400 uppercase">Status</div>
                                        <div className="text-xs text-gray-400 italic">Not Started</div>
                                    </div>
                                )}
                            </div>

                            {/* Progress Bar if started */}
                            {task.actual !== null && (
                                <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${task.bgColor}`}
                                        style={{ width: `${Math.min((task.actual / task.planned) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            )}

                            {task.alert && (
                                <div className="mt-3 text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100 flex items-center gap-1">
                                    <i className="fa-solid fa-circle-exclamation"></i> {task.alert}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white">
                <button className="w-full py-2 bg-[#297A88] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#236873] transition-colors">
                    Generate Summary
                </button>
            </div>
        </div>
    );
};

export default TodaysReportWidget;
