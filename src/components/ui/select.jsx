import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from "lucide-react";

// Simplified Select that mimics Shadcn Select visual
// Props: value, onChange, options, placeholder
const Select = ({ value, onChange, options = [], placeholder = "Select...", className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

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

    const handleSelect = (optValue) => {
        onChange(optValue);
        setIsOpen(false);
    };

    // Find label if options are objects, else use value
    const displayValue = options.find(o => (typeof o === 'object' ? o.value === value : o === value));
    const label = typeof displayValue === 'object' ? displayValue.label : displayValue;

    return (
        <div className={`relative w-full ${className || ''}`} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <span className={!value ? "text-gray-400" : "text-gray-900"}>
                    {label || value || placeholder}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                    <div className="p-1">
                        {options.map((opt) => {
                            const optVal = typeof opt === 'object' ? opt.value : opt;
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            const isSelected = value === optVal;

                            return (
                                <div
                                    key={optVal}
                                    onClick={() => handleSelect(optVal)}
                                    className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-gray-100 hover:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-gray-100' : ''}`}
                                >
                                    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                        {isSelected && <Check className="h-4 w-4" />}
                                    </span>
                                    <span className="truncate">{optLabel}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export { Select };
