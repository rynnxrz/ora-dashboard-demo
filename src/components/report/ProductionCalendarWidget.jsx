import React, { useState } from 'react';
import { MACHINE_DATA } from '../../data/mockData';

const ProductionCalendarWidget = () => {
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(0); // Default: Square Sachet
    const [filterLine, setFilterLine] = useState('');

    const activeGroup = MACHINE_DATA[selectedGroupIndex];
    const lines = activeGroup.lines;
    const days = 14;
    const startDate = new Date();

    // Generate dates
    const dates = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }

    // Mock Schedule Logic: (Simple Random for Demo, matching logic in HTML)
    const getScheduleForCell = (line, dateDay) => {
        // Deterministic pseudo-random based on line+day char codes
        const val = line.length + dateDay;
        // 30% chance of maintenance, 40% production, 30% free
        // But for visual consistency with HTML, let's keep it simple
        if (val % 5 === 0) return { type: 'maint', label: 'Main' };
        if (val % 3 === 0) return { type: 'prod', label: 'PO-' + (2000 + val) };
        return null; // free
    };

    return (
        <div className="flex-1 bg-white flex flex-col h-full rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-[#FAFAFA]">
                <h2 className="font-bold text-lg text-gray-700 flex items-center gap-2">
                    <i className="fa-solid fa-calendar-days text-[#297A88]"></i> Production Calendar
                </h2>
                <div className="flex gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-[#E0F7FA] border border-[#297A88] rounded-sm"></span> Production</div>
                    <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm"></span> Maintenance</div>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between bg-white">
                {/* Machine Groups */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {MACHINE_DATA.map((group, idx) => (
                        <button
                            key={group.name}
                            onClick={() => setSelectedGroupIndex(idx)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedGroupIndex === idx ? 'bg-[#297A88] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            {group.displayName}
                        </button>
                    ))}
                </div>
                {/* Line Filter */}
                <div className="flex-shrink-0 ml-4">
                    <div className="relative">
                        <i className="fa-solid fa-filter absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                        <select
                            value={filterLine}
                            onChange={(e) => setFilterLine(e.target.value)}
                            className="pl-7 pr-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#297A88] bg-white"
                        >
                            <option value="">All Lines</option>
                            {lines.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto bg-white p-4">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr>
                            <th className="p-2 border border-gray-100 bg-gray-50 text-xs text-gray-500 w-32 min-w-[120px] text-left shadow-sm">Machine Line</th>
                            {dates.map((d, i) => {
                                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                                return (
                                    <th key={i} className={`p-1 border border-gray-100 text-xs w-20 min-w-[80px] text-center ${isWeekend ? 'bg-orange-50 text-orange-800' : 'bg-gray-50 text-gray-700'}`}>
                                        <div className="font-bold">{d.getDate()}</div>
                                        <div className="text-[10px] uppercase">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {lines.filter(l => !filterLine || l === filterLine).map((line, rowIdx) => (
                            <tr key={line}>
                                <td className="p-2 border border-gray-100 text-xs font-bold text-gray-700 bg-gray-50/50 sticky left-0 z-10">{line}</td>
                                {dates.map((d, colIdx) => {
                                    const schedule = getScheduleForCell(line, d.getDate());
                                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                                    let cellContent = null;
                                    if (schedule) {
                                        if (schedule.type === 'prod') {
                                            cellContent = (
                                                <div className="w-full h-10 bg-[#E0F7FA] border-l-2 border-[#297A88] text-[#006064] text-[10px] p-1 rounded-sm shadow-sm flex flex-col justify-center overflow-hidden">
                                                    <div className="font-bold truncate">{schedule.label}</div>
                                                    <div className="text-[9px] opacity-70">Gummies</div>
                                                </div>
                                            );
                                        } else {
                                            cellContent = (
                                                <div className="w-full h-10 bg-gray-100 border border-gray-200 text-gray-400 text-[10px] flex items-center justify-center rounded-sm">
                                                    <i className="fa-solid fa-wrench mr-1"></i> Maint
                                                </div>
                                            );
                                        }
                                    }

                                    return (
                                        <td key={colIdx} className={`p-1 border border-gray-100 h-14 ${isWeekend && !schedule ? 'bg-orange-50/20' : ''}`}>
                                            {cellContent}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        {lines.length === 0 && (
                            <tr>
                                <td colSpan={dates.length + 1} className="p-10 text-center text-gray-400 text-sm">
                                    No lines configured for this machine group.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductionCalendarWidget;
