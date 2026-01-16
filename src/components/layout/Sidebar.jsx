import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import slogo from '../../assets/images/ora-web/clear_logo.webp';
import { CalendarDays, FileSignature, FileText, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
    const { language } = useLanguage();
    const isZh = language === 'zh';

    const linkBaseClass = "w-full h-14 flex items-center justify-center transition-all relative group focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-0";
    const activeClass = "bg-[#066070] text-white";
    const inactiveClass = "text-white/70 hover:bg-[#066070]/30";

    return (
        <aside className="w-14 flex-shrink-0 flex flex-col z-20 shadow-sm transition-all bg-[#297A88]">
            <div className="h-14 flex items-center justify-center bg-white border-b border-gray-100">
                <img src={slogo} alt={isZh ? '欧拉' : 'Ora'} className="w-10 h-10 object-contain" />
            </div>
            <nav className="flex-1 overflow-y-auto flex flex-col items-center gap-0 bg-[#297A88]">
                {/* Dashboard */}
                <NavLink
                    to="/"
                    className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`absolute left-0 h-7 w-1 rounded-r-full bg-white transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}></span>
                            <LayoutDashboard className={`w-5 h-5 stroke-[2.2] transition-colors ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} aria-hidden="true" />
                            <span className="sr-only">{isZh ? '仪表盘' : 'Dashboard'}</span>
                        </>
                    )}
                </NavLink>

                {/* Contracts */}
                <NavLink
                    to="/contracts"
                    className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`absolute left-0 h-7 w-1 rounded-r-full bg-white transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}></span>
                            <FileSignature className={`w-5 h-5 stroke-[2.2] transition-colors ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} aria-hidden="true" />
                            <span className="sr-only">{isZh ? '合同' : 'Contracts'}</span>
                        </>
                    )}
                </NavLink>

                {/* Report */}
                <NavLink
                    to="/report"
                    className={({ isActive }) => `${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
                >
                    {({ isActive }) => (
                        <>
                            <span className={`absolute left-0 h-7 w-1 rounded-r-full bg-white transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}></span>
                            <FileText className={`w-5 h-5 stroke-[2.2] transition-colors ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} aria-hidden="true" />
                            <span className="sr-only">{isZh ? '日报' : 'Report'}</span>
                        </>
                    )}
                </NavLink>

                {/* Calendar (Stub) */}
                <div className="w-full h-14 flex items-center justify-center text-white/40 transition-all cursor-default">
                    <CalendarDays className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                    <span className="sr-only">{isZh ? '日历' : 'Calendar'}</span>
                </div>
            </nav>
        </aside>
    );
};


export default Sidebar;
