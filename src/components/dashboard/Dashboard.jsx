import React, { useState } from 'react';
import DashboardFilters from './DashboardFilters';
import KPIGrid from './KPIGrid';
import ContractStatusWidget from './ContractStatusWidget';

import ProcessLeadTimeWidget from './ProcessLeadTimeWidget';
import ClientRadarWidget from './ClientRadarWidget';
import SidebarContainer from './SidebarContainer';

const Dashboard = () => {
    // Shared State for interactions
    const [kpiFilter, setKpiFilter] = useState(null); // 'delay', 'blocker', etc.

    // ---------------------------
    // TAB STATE & LOGIC
    // ---------------------------
    // 1. Helper to read ?tab=... from URL
    const getInitialTab = () => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        // valid tabs: 'overview', 'process', 'clients'
        if (['overview', 'process', 'clients'].includes(tab)) return tab;
        return 'overview';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    // 2. Helper to switch tabs and update URL without reload
    const handleTabSwitch = (tabId) => {
        setActiveTab(tabId);
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('tab', tabId);
        window.history.pushState({}, '', url);
    };

    // 3. Listen for browser back/forward buttons to sync state
    React.useEffect(() => {
        const onPopState = () => {
            setActiveTab(getInitialTab());
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const handleKpiClick = (type) => {
        // Toggle if clicking same type
        setKpiFilter(prev => prev === type ? null : type);
    };

    // Tab Data
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'process', label: 'Process Analysis' },
        { id: 'clients', label: 'Client Radar' },
    ];

    return (
        <div id="page-dashboard" className="flex-1 flex flex-col overflow-hidden relative h-full">
            {/* Scrollable Area */}
            <div id="main-scroller" className="flex-1 overflow-y-auto bg-gray-50 p-6 scroller space-y-6 scroll-smooth">

                <DashboardFilters
                    activeTab={activeTab}
                    onSwitchTab={handleTabSwitch}
                    tabs={tabs}
                />

                {/* CONTENT AREA */}
                <div className="min-h-[500px]"> {/* Min height to reduce layout shift */}

                    {/* PART 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-fadeIn">
                            <KPIGrid activeFilter={kpiFilter} onKpiClick={handleKpiClick} />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <ContractStatusWidget externalFilter={kpiFilter} />
                                <SidebarContainer onRiskClick={(id) => handleKpiClick && handleKpiClick('material')} />
                            </div>
                        </div>
                    )}

                    {/* PART 2: PROCESS */}
                    {activeTab === 'process' && (
                        <div className="animate-fadeIn">
                            <ProcessLeadTimeWidget />
                        </div>
                    )}

                    {/* PART 3: CLIENTS */}
                    {activeTab === 'clients' && (
                        <div className="animate-fadeIn">
                            <ClientRadarWidget />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
