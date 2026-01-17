import React, { useState, useRef, useEffect } from 'react';

// Status Configuration Maps
export const STATUS_CONFIG = {
    // Generic / Common
    'Pending': { color: 'bg-gray-400', label: 'Pending' },
    'Done': { color: 'bg-green-500', label: 'Done' },
    'Overdue': { color: 'bg-red-500', label: 'Overdue' },

    // Finance / Packaging Specifics
    'Paid': { color: 'bg-green-500', label: 'Paid' },
    'Unpaid': { color: 'bg-gray-400', label: 'Unpaid' },
    'Received': { color: 'bg-green-500', label: 'Received' },
    'Arrived': { color: 'bg-green-500', label: 'Arrived' },
    'Checked': { color: 'bg-green-500', label: 'Checked' },

    'In-Transit': { color: 'bg-yellow-500', label: 'In-Transit' },
    'Partial': { color: 'bg-yellow-500', label: 'Partial' },
    'Checking': { color: 'bg-yellow-500', label: 'Checking' },

    // Default fallback
    'default': { color: 'bg-gray-300', label: 'Select Status' }
};

const StatusSelect = ({ value, onChange, options = ['Pending', 'Arrived'] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const currentConfig = STATUS_CONFIG[value] || STATUS_CONFIG['default'] || { color: 'bg-gray-300', label: value };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (opt) => {
        onChange(opt);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 bg-white text-sm focus:outline-none focus:border-[#297A88] transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentConfig.color}`}></span>
                    <span className="text-gray-700 font-medium">{value || 'Select...'}</span>
                </div>
                <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                    {options.map((opt) => {
                        const config = STATUS_CONFIG[opt] || STATUS_CONFIG['default'] || { color: 'bg-gray-300', label: opt };
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => handleSelect(opt)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
                            >
                                <span className={`w-2 h-2 rounded-full ${config.color}`}></span>
                                <span className="text-gray-700">{opt}</span>
                                {value === opt && <i className="fa-solid fa-check text-xs text-[#297A88] ml-auto"></i>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StatusSelect;
