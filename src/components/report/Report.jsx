import React from 'react';
import TodaysReportWidget from './TodaysReportWidget';
import ProductionCalendarWidget from './ProductionCalendarWidget';

const Report = () => {
    return (
        <div id="page-report" className="flex-1 flex overflow-hidden relative h-full bg-gray-100 p-6 gap-6">
            <TodaysReportWidget />
            <ProductionCalendarWidget />
        </div>
    );
};

export default Report;
