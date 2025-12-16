import React from 'react';
import { REPORT_DATA, CONTRACT_DATA } from '../../data/mockData';

const TodaysReportWidget = () => {
    // Enrich report data with contract details
    const enrichedData = REPORT_DATA.map(item => {
        const contract = CONTRACT_DATA.find(c => c.no === item.contractNo);
        // Map Status to Chart Colors based on Contracts Table Logic
        // Contracts: New/Pending (Red), Production (Amber), Done (Green)

        let dotColor = 'bg-gray-400';
        let displayStatus = item.status;

        if (item.status === 'Temporary') {
            dotColor = 'bg-[#297A88]'; // Teal
            displayStatus = 'Temporary';
        }
        else if (item.status === 'Pending') {
            dotColor = 'bg-[#EF4444]'; // Red
            displayStatus = 'In Progress'; // Map Pending to In Progress for visual consistency with screenshot
        }
        else if (item.status === 'Production') {
            dotColor = 'bg-[#F59E0B]'; // Amber
            displayStatus = 'In Progress';
        }
        else if (item.status === 'Done') {
            dotColor = 'bg-[#10B981]'; // Green
            displayStatus = 'Completed';
        }
        else if (item.status === 'Completed') { // handling if mock data changes
            dotColor = 'bg-[#10B981]';
            displayStatus = 'Completed';
        }
        else if (item.status === 'In Progress') { // handling if mock data changes
            dotColor = 'bg-[#F59E0B]';
        }

        // Override for demo specific visual match if needed (e.g. Red for one item)
        if (item.contractNo === 'LTUM-202502002' || item.contractNo === 'C2025001') {
            dotColor = 'bg-[#EF4444]';
        }

        return {
            ...item,
            brand: contract ? contract.brand : 'Unknown',
            product: contract ? contract.product : 'Unknown Product',
            dotColor,
            displayStatus
        };
    });

    return (
        <div className="w-80 flex bg-white flex-col rounded shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-gray-700">Today's report</h2>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-600 hover:bg-gray-50">Back Today</button>
                    <button className="px-3 py-1 text-xs bg-[#297A88] text-white rounded font-bold hover:bg-[#236873]">+ Add Temporary Task</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                <div className="text-xs text-gray-400 mb-2 font-mono">&lt; January 1, 2025 &gt;</div>

                {enrichedData.map((task, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative no-stripe">
                        {/* Header: Dot + Title + Badge */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${task.dotColor}`}></div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">{task.brand} vc 10ml 700k</h3>
                                    <div className="text-[10px] text-gray-400 mt-0.5">Contract: {task.contractNo}</div>
                                    <div className="text-[10px] text-gray-400">Task: {task.taskNo}</div>
                                </div>
                            </div>
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-600`}>
                                {task.displayStatus}
                            </span>
                        </div>

                        {/* Progress Section */}
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="text-[10px] text-gray-400">Actual</span>
                                <div className="border border-gray-300 rounded px-2 py-0.5 min-w-[50px] text-center font-bold text-gray-700">
                                    {task.actual || 0}
                                </div>
                                <span className="text-[10px] text-gray-400">/ Planned: {task.planned}</span>
                            </div>

                            {task.isSaved && (
                                <div className="flex items-center gap-1 text-[#10B981] text-xs font-bold">
                                    <i className="fa-solid fa-circle-check"></i> 已保存
                                    <i className="fa-solid fa-ellipsis text-gray-400 ml-2"></i>
                                </div>
                            )}
                            {!task.isSaved && (
                                <div className="flex items-center gap-2">
                                    <button className="bg-[#297A88] text-white text-xs px-3 py-1 rounded font-bold">Save</button>
                                    <i className="fa-solid fa-ellipsis text-gray-400"></i>
                                </div>
                            )}
                        </div>

                        {/* Alert / Warning */}
                        {task.alert && (
                            <div className="mt-3 text-[10px] text-orange-500 flex items-center gap-1 font-bold">
                                <i className="fa-solid fa-circle-exclamation"></i> {task.alert}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodaysReportWidget;
