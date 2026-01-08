import React, { useMemo, useState } from 'react';
import { MACHINE_DATA } from '../../data/mockData';
import { useLanguage } from '../../contexts/LanguageContext';

const ProductionCalendarWidget = () => {
    const { language } = useLanguage();
    const isZh = language === 'zh';
    const [selectedGroupIndex, setSelectedGroupIndex] = useState(0); // Default: Square Sachet
    const [searchTerm, setSearchTerm] = useState('');

    const lineMap = {
        'Powder stick sachet': '粉剂条包',
        'PSS': '粉条1',
        'PSS R': '粉条2',
        'SF R1': '充填1',
        'SF R2': '充填2',
        'LS01 L': '液条1',
        'LS01 R': '液条2',
        'LS02': '液条3',
        'LS03': '液条4',
        'LS04 R': '液条5',
        'Bottle 1': '瓶装1',
        'Bottle 2': '瓶装2',
        'Bottle 3': '瓶装3',
        'Cap 1': '胶囊1',
        'Cap 2': '胶囊2',
        'Liquid Pouch': '液体袋',
        'Gel Candy Blister': '软糖泡罩'
    };
    const machineNameMap = {
        'Square Sachet': '方袋',
        'Sachet Filling': '条包充填',
        'Tablets': '片剂',
        'Liquid Sachet': '液体条包',
        'Packing': '包装',
        'Hard Cap': '硬胶囊',
        'Soft Cap': '软胶囊',
        'Pouch': '袋装',
        'Gel Candy': '软糖'
    };

    const machineData = useMemo(() => {
        if (!isZh) return MACHINE_DATA;
        return MACHINE_DATA.map(group => ({
            ...group,
            name: machineNameMap[group.name] || group.name,
            displayName: machineNameMap[group.displayName] || group.displayName,
            lines: group.lines.map(line => lineMap[line] || line)
        }));
    }, [isZh]);

    const activeGroup = machineData[selectedGroupIndex] || machineData[0];
    // In screenshot: Square Sachet has LS01 L, LS01 R, LS02, LS03.
    // Our mock data might differ slightly, let's allow it but try to map if possible.
    // For "Square Sachet", let's assume we show the lines defined in mock data.
    const lines = activeGroup.lines;

    // Generate dates: Jan 01 - Jan 24 (approx 3 weeks)
    const dates = [];
    const startDate = new Date('2025-01-01');
    for (let i = 0; i < 24; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }

    // Mock Data Placement to match Screenshot examples
    // 01/01 Mon - LS01 L: Little Umbrella / 1000 / 800
    // 01/01 Mon - LS01 L (Row 2? No, seems to be day-based). Screenshot shows a cell with dashed border "Sachet.." on next line? 
    // Actually table seems to have one row per day. 
    // The "Sachet..." dashed box is likely a "Temporary Task" or empty slot indicator.

    const getCellData = (date, lineIndex) => {
        const dateStr = date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });

        // Example 1: 01/01 on LS01 L (Index 0)
        if (dateStr === '01/01' && lineIndex === 0) {
            return {
                product: isZh ? '小雨...' : 'Little U...',
                task: isZh ? '任务-12345' : 'M-12345',
                planned: 1000,
                actual: 800,
                status: 'done'
            };
        }

        // Example: Dashed box on 01/01 LS01 L (implied row underneath or same cell?)
        // The screenshot shows "Sachet..." in a dashed box below "Little U...". 
        // It looks like row spanning or just multiple items per day.
        // For simplicity, let's assume 1 item per day unless purely visual.
        // Actually, looking closely, "Sachet..." is in a dashed box. It might be a second task.

        return null;
    };

    return (
        <div className="flex-1 bg-white flex flex-col h-full rounded shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex justify-between items-center">
                <h2 className="font-bold text-gray-800 text-sm">{isZh ? '生产日历' : 'Production Calendar'}</h2>
            </div>

            {/* Toolbar */}
            <div className="px-4 py-2 border-b border-gray-200 bg-white flex flex-wrap items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-600">{isZh ? '全部' : 'All'}</button>
                    {machineData.map((group, idx) => (
                        <button
                            key={group.name}
                            onClick={() => setSelectedGroupIndex(idx)}
                            className={`px-3 py-1 text-xs border rounded transition-colors ${selectedGroupIndex === idx ? 'bg-gray-100 text-gray-800 font-bold border-gray-300' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
                        >
                            {group.displayName}
                        </button>
                    ))}
                    {/* Mock Dropdown for Liquid Sachet as per screenshot */}
                    <div className="relative border border-gray-300 rounded px-2 py-1 flex items-center gap-2 bg-white">
                        <span className="text-xs text-gray-700">{isZh ? '液体条包' : 'Liquid Sachet'}</span>
                        <i className="fa-solid fa-chevron-down text-[10px] text-gray-400"></i>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <i className="fa-solid fa-magnifying-glass absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input
                            type="text"
                            placeholder={isZh ? '合同编号' : 'Contracts Number'}
                            className="pl-7 pr-3 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#297A88]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex rounded border border-gray-300 overflow-hidden">
                        <button className="px-3 py-1 text-xs bg-[#E0F7FA] text-[#006064] font-bold border-r border-gray-300">{isZh ? '液条1' : 'LS01 L'}</button>
                        <button className="px-3 py-1 text-xs bg-white text-gray-600 hover:bg-gray-50">{isZh ? '液条2' : 'LS01 R'}</button>
                    </div>

                    <button className="flex items-center gap-1 text-xs text-gray-600 px-2">
                        {isZh ? '更多' : 'More'} <i className="fa-solid fa-chevron-down text-[10px]"></i>
                    </button>

                    <button className="text-gray-400 hover:text-gray-600 px-1">
                        <i className="fa-solid fa-gear"></i>
                    </button>
                </div>
            </div>

            {/* Transposed Calendar Grid */}
            <div className="flex-1 overflow-auto bg-white relative">
                <table className="w-full border-collapse text-xs table-fixed" style={{ minWidth: '1000px' }}>
                    <thead className="sticky top-0 bg-white z-20 shadow-sm text-gray-700">
                        {/* Top Header: Lines */}
                        <tr>
                            <th className="w-20 p-2 border border-gray-200 bg-white sticky left-0 z-30"></th>
                            {lines.map((line, idx) => (
                                <th key={idx} colSpan={4} className="p-2 border border-gray-200 bg-gray-50 font-bold text-left text-gray-700 border-l-2 border-l-gray-300">
                                    {line}
                                </th>
                            ))}
                        </tr>
                        {/* Sub Header: Product / Task / Planned / Actual */}
                        <tr>
                            <th className="p-2 border border-gray-200 bg-white sticky left-0 z-30"></th>
                            {lines.map((_, idx) => (
                                <React.Fragment key={idx}>
                                    <th className="p-1 border border-gray-200 bg-white font-bold w-24 truncate">{isZh ? '产品' : 'Product Name'}</th>
                                    <th className="p-1 border border-gray-200 bg-white font-bold w-20 truncate">{isZh ? '任务号' : 'Task Number'}</th>
                                    <th className="p-1 border border-gray-200 bg-white font-bold w-16 truncate">{isZh ? '计划量' : 'Planned Quantity'}</th>
                                    <th className="p-1 border border-gray-200 bg-white font-bold w-16 truncate">{isZh ? '实际量' : 'Actual Quantity'}</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dates.map((d, rowIdx) => {
                            const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                            const dateLabel = d.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
                            const weekDay = d.toLocaleDateString(isZh ? 'zh-CN' : 'en-US', { weekday: 'short' });

                            return (
                                <tr key={rowIdx} className={isWeekend ? 'bg-gray-50/30' : ''}>
                                    {/* Date Column */}
                                    <td className="p-2 border border-gray-200 bg-white sticky left-0 z-10 font-bold text-gray-700 whitespace-nowrap">
                                        <span className="mr-2">{dateLabel}</span>
                                        <span className="text-gray-500 font-normal">{weekDay}</span>
                                    </td>

                                    {/* Data Columns */}
                                    {lines.map((line, colIdx) => {
                                        const data = getCellData(d, colIdx);

                                        // Special mock for the screenshot's "Dashed Box" layout on Row 1, Col 1
                                        // Screenshot has "Little U..." row, then a dashed "Sachet..." box below it but seemingly in same date row
                                        // Let's simluate this by rendering a complex cell content if data exists

                                        return (
                                            <React.Fragment key={colIdx}>
                                                <td className="p-2 border border-gray-200 h-10 align-middle truncate" title={data?.product}>{data?.product}</td>
                                                <td className="p-2 border border-gray-200 h-10 align-middle truncate">{data?.task}</td>
                                                <td className="p-2 border border-gray-200 h-10 align-middle truncate">{data?.planned}</td>
                                                <td className="p-2 border border-gray-200 h-10 align-middle truncate">{data?.actual}</td>
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        {/* Mock Row for the Dashed Box visually as a separate row for 01/01 if needed? 
                             Or actually, the screenshot shows 01/01 has "Little U..." AND "Sachet..." dashed.
                             Let's insert a "sub-row" for the dashed item on 01/01
                         */}
                        <tr>
                            <td className="p-2 border border-gray-200 bg-white sticky left-0 z-10"></td>
                            <td colSpan={2} className="p-1 border border-gray-200 border-dashed border-[#297A88] text-[#297A88] font-medium text-xs bg-[#E0F7FA]/20 relative">
                                <div className="absolute inset-0 border-2 border-dashed border-[#297A88] pointer-events-none opacity-50"></div>
                                <span className="relative z-10 pl-2">{isZh ? '条包...' : 'Sachet...'}</span>
                            </td>
                            <td className="p-2 border border-gray-200"></td>
                            <td className="p-2 border border-gray-200"></td>

                            {/* Fill empty cells for other lines */}
                            {lines.slice(1).map((_, i) => (
                                <React.Fragment key={i}>
                                    <td className="p-2 border border-gray-200"></td>
                                    <td className="p-2 border border-gray-200"></td>
                                    <td className="p-2 border border-gray-200"></td>
                                    <td className="p-2 border border-gray-200"></td>
                                </React.Fragment>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductionCalendarWidget;
