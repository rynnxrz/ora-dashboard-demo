import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Plus, Pen, Image as ImageIcon } from "lucide-react";
import StatusSelect from '../common/StatusSelect';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select } from '../ui/select';

const EditContractModal = ({ isOpen, onClose, contract }) => {
    // Return null immediately if not open to keep DOM clean.
    // For simple implementation, we'll rely on CSS animation on mount.
    if (!isOpen) return null;

    // --- State for Active Tab ---
    const [activeTab, setActiveTab] = useState('reqs');

    // --- Refs for Scrolling ---
    const reqsRef = useRef(null);
    const finRef = useRef(null);
    const pkgRef = useRef(null);
    const planRef = useRef(null);

    // --- State for Form Fields ---
    const [formData, setFormData] = useState({
        productName: '',
        totalQty: '',
        totalQtyUnit: 'sachet',
        pkgQty: '',
        pkgQtyUnit: 'ml',
        gacc: '',
        coding: '',
        shipping: '',
        labeling: '',
        notes: '',

        // Finance
        depStatus: 'Pending',
        depDate: '',
        preStatus: 'Pending',
        preDate: '',
        finalStatus: 'Pending', // Rename from bal
        finalDate: '',

        matStatus: 'Pending',
        pkgStatus: 'Pending',
        arriveDate: '',
        checkStatus: 'Pending',
        scheduleNotes: '',
        machine: '',
        startDate: '',
        endDate: '',
        qtyDetail: []
    });

    // --- Bind Data when contract changes ---
    useEffect(() => {
        if (contract) {
            // Helper to parse "10ml/sachet" or "30g/pack"
            const parseSpec = (specStr) => {
                const parts = specStr ? specStr.split('/') : ['', ''];
                return { val: parts[0] || '', unit: parts[1] || '' };
            };
            const specData = parseSpec(contract.spec);

            setFormData({
                productName: contract.product || '',
                totalQty: contract.qty || '', // Assuming qty is simple string like "50,000"
                totalQtyUnit: 'sachet', // Default, logic to extract from qty string if complex?
                pkgQty: specData.val,
                pkgQtyUnit: specData.unit,
                gacc: contract.reqs?.gacc || '',
                coding: contract.reqs?.coding || '',
                shipping: contract.reqs?.ship || '',
                labeling: contract.reqs?.label || '',
                notes: contract.reqs?.other || '',

                // Finance
                depStatus: contract.fin?.dep || 'Pending',
                depDate: contract.fin?.date_dep || '',
                preStatus: contract.fin?.pre || 'Pending',
                preDate: contract.fin?.date_pre || '',
                finalStatus: contract.fin?.bal || contract.fin?.final_payment_status || 'Pending',
                finalDate: contract.fin?.date_bal || contract.fin?.final_payment_date || '',

                matStatus: contract.pkg?.mat_status || 'Pending',
                pkgStatus: contract.pkg?.pkg_status || 'Pending',
                arriveDate: contract.pkg?.arrive_date || '',
                checkStatus: contract.pkg?.check_status || 'Pending',
                scheduleNotes: contract.plan?.log || '',
                machine: contract.plan?.mat || '', // Using 'mat' as proxy
                startDate: contract.date || '',
                endDate: '',
                qtyDetail: []
            });
        }
    }, [contract]);

    // Simple handler to update state
    // Simple handler to update state
    const handleChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-update stats to 'In-Transit' if date is entered and status is 'Pending'
            if (field === 'depDate' && value && prev.depStatus === 'Pending') newData.depStatus = 'In-Transit';
            if (field === 'preDate' && value && prev.preStatus === 'Pending') newData.preStatus = 'In-Transit';
            if (field === 'finalDate' && value && prev.finalStatus === 'Pending') newData.finalStatus = 'In-Transit';

            return newData;
        });
    };

    // Scroll Helper
    const scrollToSection = (ref, tabName) => {
        setActiveTab(tabName);
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Background Overlay */}
            <div
                className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Slide-over Panel */}
            <div className="fixed inset-y-0 right-0 max-w-2xl w-full flex pointer-events-none">
                <div className="pointer-events-auto relative w-full h-full bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0 animate-[slideInRight_0.3s_ease-out]">

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                Edit Product
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">{contract?.no} - {contract?.brand}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">

                        {/* 1. Specification */}
                        <div className="px-6 pt-6 mb-8">
                            <h4 className="border-b border-gray-200 pb-2 mb-5 font-bold text-gray-800 text-sm uppercase tracking-wide">Specification</h4>

                            <div className="mb-5">
                                <Label className="mb-1.5 uppercase text-gray-500 text-xs">Product 1 Name</Label>
                                <Input
                                    value={formData.productName}
                                    onChange={(e) => handleChange('productName', e.target.value)}
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Total Quantity / Sale Unit</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.totalQty}
                                            onChange={(e) => handleChange('totalQty', e.target.value)}
                                            className="flex-1"
                                        />
                                        <div className="w-24">
                                            <Select
                                                value={formData.totalQtyUnit}
                                                onChange={(val) => handleChange('totalQtyUnit', val)}
                                                options={['sachet', 'bottle', 'pack', 'tub']}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Packaging Quantity / Unit</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.pkgQty}
                                            onChange={(e) => handleChange('pkgQty', e.target.value)}
                                            className="w-24"
                                            placeholder="e.g., 100"
                                        />
                                        <div className="flex-1">
                                            <Select
                                                value={formData.pkgQtyUnit}
                                                onChange={(val) => handleChange('pkgQtyUnit', val)}
                                                options={['ml', 'g', 'ct', 'kg']}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Navigation - Sticky & Pill Style */}
                        <div className="sticky top-0 z-20 bg-white px-6 py-3 mb-6 border-b border-gray-100 shadow-sm">
                            <div className="flex items-center p-1 bg-gray-100/80 rounded-lg w-fit">
                                {['reqs', 'fin', 'pkg', 'plan'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => scrollToSection({ reqs: reqsRef, pkg: pkgRef, fin: finRef, plan: planRef }[tab], tab)}
                                        className={activeTab === tab
                                            ? "px-4 py-1.5 rounded-md text-xs font-bold transition-all bg-white text-gray-950 shadow-sm"
                                            : "px-4 py-1.5 rounded-md text-xs font-medium text-gray-500 hover:text-gray-900 transition-all hover:bg-white/50"}
                                    >
                                        {tab === 'reqs' ? 'Reqs' : tab === 'pkg' ? 'Pkg' : tab === 'fin' ? 'Finance' : 'Plan & Report'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Requirments */}
                        <div ref={reqsRef} className="px-6 mb-8 scroll-mt-32">
                            <h4 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
                                Requirements <span className="text-xs font-normal text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">Part I</span>
                            </h4>

                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">GACC</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={formData.gacc}
                                            onChange={(e) => handleChange('gacc', e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button variant="outline" size="icon" className="shrink-0 w-10">
                                            <ImageIcon className="h-4 w-4 text-gray-500" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Coding Format</Label>
                                    <textarea
                                        value={formData.coding}
                                        onChange={(e) => handleChange('coding', e.target.value)}
                                        className="flex min-h-[42px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 resize-none font-mono"
                                        placeholder="BN:XXXXXX&#10;EXP:DD/MM/YYYY"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Expected Shipping Method</Label>
                                    <Input
                                        value={formData.shipping}
                                        onChange={(e) => handleChange('shipping', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Labeling Req.</Label>
                                    <Input
                                        value={formData.labeling}
                                        onChange={(e) => handleChange('labeling', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-5">
                                <Label className="mb-1.5 uppercase text-gray-500 text-xs">Additional Notes</Label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleChange('notes', e.target.value)}
                                    className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 resize-none"
                                />
                            </div>
                        </div>

                        {/* 2.5 Finance */}
                        <div ref={finRef} className="px-6 mb-8 scroll-mt-32">
                            <h4 className="text-gray-800 font-bold mb-4">Finance</h4>
                            <div className="grid grid-cols-1 gap-4 mb-5">
                                {/* Deposit */}
                                <div className="grid grid-cols-2 gap-4 items-end">
                                    <div>
                                        <Label className="mb-1.5 uppercase text-gray-500 text-xs">Deposit</Label>
                                        <StatusSelect
                                            value={formData.depStatus}
                                            onChange={(val) => handleChange('depStatus', val)}
                                            options={['Received', 'In-Transit', 'Pending', 'Overdue']}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Input
                                            value={formData.depDate}
                                            onChange={(e) => handleChange('depDate', e.target.value)}
                                            placeholder="Date (YYYY-MM-DD)"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Pre-payment */}
                                <div className="grid grid-cols-2 gap-4 items-end">
                                    <div>
                                        <Label className="mb-1.5 uppercase text-gray-500 text-xs">Pre-payment</Label>
                                        <StatusSelect
                                            value={formData.preStatus}
                                            onChange={(val) => handleChange('preStatus', val)}
                                            options={['Received', 'In-Transit', 'Pending', 'Overdue']}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Input
                                            value={formData.preDate}
                                            onChange={(e) => handleChange('preDate', e.target.value)}
                                            placeholder="Date (YYYY-MM-DD)"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Final Payment */}
                                <div className="grid grid-cols-2 gap-4 items-end">
                                    <div>
                                        <Label className="mb-1.5 uppercase text-gray-500 text-xs">Final Payment</Label>
                                        <StatusSelect
                                            value={formData.finalStatus}
                                            onChange={(val) => handleChange('finalStatus', val)}
                                            options={['Received', 'In-Transit', 'Pending', 'Overdue']}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Input
                                            value={formData.finalDate}
                                            onChange={(e) => handleChange('finalDate', e.target.value)}
                                            placeholder="Date (YYYY-MM-DD)"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Packaging Materials Storage */}
                        <div ref={pkgRef} className="px-6 mb-8 scroll-mt-32">
                            <h4 className="text-gray-800 font-bold mb-4">Packaging Materials Storage</h4>

                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Materials Status</label>
                                    <StatusSelect
                                        value={formData.matStatus}
                                        onChange={(val) => handleChange('matStatus', val)}
                                        options={['Pending', 'Partial', 'Arrived']}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Packaging Status</label>
                                    <StatusSelect
                                        value={formData.pkgStatus}
                                        onChange={(val) => handleChange('pkgStatus', val)}
                                        options={['Pending', 'Partial', 'Arrived']}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Arrive Date</Label>
                                    <div className="relative">
                                        <Input
                                            value={formData.arriveDate}
                                            onChange={(e) => handleChange('arriveDate', e.target.value)}
                                            placeholder="yyyy-mm-dd"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Check Status</label>
                                    <StatusSelect
                                        value={formData.checkStatus}
                                        onChange={(val) => handleChange('checkStatus', val)}
                                        options={['Pending', 'Checking', 'Checked']}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. Plan & Report */}
                        <div ref={planRef} className="px-6 mb-4 pb-6 scroll-mt-32">
                            <h4 className="text-gray-800 font-bold mb-4">Plan & Report</h4>

                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Schedule Notes</Label>
                                    <textarea
                                        value={formData.scheduleNotes}
                                        onChange={(e) => handleChange('scheduleNotes', e.target.value)}
                                        className="flex min-h-[60px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 resize-none"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Production Line</Label>
                                    <Select
                                        value={formData.machine}
                                        onChange={(val) => handleChange('machine', val)}
                                        options={['Line A', 'Line B', 'Line C', 'Line D']}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5 mb-5 w-full">
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">Start Date</Label>
                                    <div className="relative">
                                        <Input
                                            value={formData.startDate}
                                            onChange={(e) => handleChange('startDate', e.target.value)}
                                            placeholder="yyyy-mm-dd"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <Label className="mb-1.5 uppercase text-gray-500 text-xs">End Date</Label>
                                    <div className="relative">
                                        <Input
                                            value={formData.endDate}
                                            onChange={(e) => handleChange('endDate', e.target.value)}
                                            placeholder="yyyy-mm-dd"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <Label className="mb-1.5 uppercase text-gray-500 text-xs shadow-none border-none">Quantity Detail</Label>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold text-gray-500 w-1/3">Date</th>
                                                <th className="px-4 py-3 font-semibold text-gray-500 text-center border-l border-gray-200">Planned Qty</th>
                                                <th className="px-4 py-3 font-semibold text-gray-500 text-center border-l border-gray-200">Actual Qty</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td className="px-4 py-3 text-gray-700 font-medium">{formData.startDate || '—'} Mon</td>
                                                <td className="px-4 py-3 text-center border-l border-gray-100 text-gray-400">—</td>
                                                <td className="px-4 py-3 text-center border-l border-gray-100 text-gray-400">—</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                                        <button className="text-[#297A88] text-xs font-bold hover:underline">
                                            <i className="fa-solid fa-pen mr-1"></i> Edit Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer - Fixed at bottom of panel */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-row-reverse gap-3 shrink-0">
                        <Button variant="brand" onClick={onClose} className="px-6 font-bold">
                            Save Changes
                        </Button>
                        <Button variant="outline" onClick={onClose} className="px-6 font-bold text-gray-700">
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditContractModal;
