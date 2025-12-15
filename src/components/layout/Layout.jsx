import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, activePage, onSwitchPage }) => {
    const [isFullscreenMode, setIsFullscreenMode] = useState(false);

    // Auto-scale Logic from HTML
    useEffect(() => {
        const handleResize = () => {
            setIsFullscreenMode(window.innerWidth > 1024);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="bg-gray-50 h-screen w-full overflow-hidden text-gray-800">
            <div
                id="desktop-scaler"
                className={`flex h-full overflow-hidden transition-all duration-300 ${isFullscreenMode ? 'w-full h-full scale-100 origin-top-left' : 'w-[200%] h-[200%] scale-50 origin-top-left flex-row'}`}
            >
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
