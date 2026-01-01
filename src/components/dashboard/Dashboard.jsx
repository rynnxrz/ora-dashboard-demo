import React, { useState } from 'react';
import DashboardFilters from './DashboardFilters';
import KPIGrid from './KPIGrid';
import ContractStatusWidget from './ContractStatusWidget';

import DataQualityWidget from './DataQualityWidget';
import ProcessLeadTimeWidget from './ProcessLeadTimeWidget';
import ClientRadarWidget from './ClientRadarWidget';

const Dashboard = () => {
    // Shared State for interactions
    const [kpiFilter, setKpiFilter] = useState(null); // 'delay', 'blocker', etc.

    const handleKpiClick = (type) => {
        // Toggle if clicking same type
        setKpiFilter(prev => prev === type ? null : type);
    };

    return (
        <div id="page-dashboard" className="flex-1 flex flex-col overflow-hidden relative h-full">
            {/* Scrollable Area */}
            <div id="main-scroller" className="flex-1 overflow-y-auto bg-gray-50 p-6 scroller space-y-8 scroll-smooth">

                <DashboardFilters />

                {/* PART 1: INTERNAL EXCEPTION RADAR */}
                <KPIGrid activeFilter={kpiFilter} onKpiClick={handleKpiClick} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pass filter to Contract Status Widget */}
                    <ContractStatusWidget externalFilter={kpiFilter} />

                    <DataQualityWidget />
                </div>

                <ProcessLeadTimeWidget />
                <ClientRadarWidget />
            </div>
        </div>
    );
};

export default Dashboard;
