import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, activePage, onSwitchPage }) => {
    return (
        <div className="bg-gray-50 min-h-screen w-full overflow-hidden text-gray-800">
            <div id="desktop-scaler" className="flex min-h-screen overflow-hidden">
                <Sidebar activePage={activePage} onSwitchPage={onSwitchPage} />

                <main className="flex-1 flex flex-col overflow-hidden relative">
                    <Header />
                    <div className="flex-1 flex flex-col overflow-hidden relative h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
