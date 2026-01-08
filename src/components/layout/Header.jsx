import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = () => {
    const { language } = useLanguage();
    const isZh = language === 'zh';
    return (
        <header id="shared-header" className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 flex-shrink-0 z-20 relative">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-ora-primary/20 text-ora-primary flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm cursor-pointer hover:ring-ora-primary/50 transition">
                    {isZh ? '用户' : 'JD'}
                </div>
            </div>
        </header>
    );
};

export default Header;
