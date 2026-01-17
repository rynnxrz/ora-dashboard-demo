import React, { useState, useEffect } from 'react';
import { X, Calendar, Pen } from "lucide-react";
import StatusSelect from '../common/StatusSelect';
import EditContractModal from './EditContractModal';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select } from '../ui/select';
import { cn } from '../../lib/utils';

const getBlankFormData = () => ({
    // Contract Level Basic Info
    signingDate: '',
    brand: '',
    contractNo: '',
    estComplete: '',

    // Contract Level Finance
    invoiceNo: '',
    depDate: '',
    depStatus: 'Pending',
    preDate: '',
    preStatus: 'Pending',
    finalDate: '',
    finalStatus: 'Pending',

    // Products List (One to Many)
    products: [{
        id: Date.now(),
        name: '',
        qty: '',
        spec: '',
        gacc: '',
        coding: '',
        ship: '',
        label: '',
        notes: '',
        matStatus: 'Pending',
        pkgStatus: 'Pending',
        arriveDate: '',
        checkStatus: 'Pending',
        line: '',
        schedule: '',
        expectedShip: '',
        qtyActual: '',
        planNotes: ''
    }]
});

const mapInitialDataToForm = (initialData) => {
    if (!initialData) return getBlankFormData();

    const mapQtyActual = (value) => {
        if (value === 0 || value === '0') return '';
        return value ? String(value) : '';
    };

    const mappedProducts = Array.isArray(initialData.products) && initialData.products.length
        ? initialData.products.map((prod, index) => ({
            id: prod.id || Date.now() + index,
            name: prod.name || prod.product || initialData.product || '',
            qty: prod.qty || initialData.qty || '',
            spec: prod.spec || initialData.spec || '',
            gacc: prod.gacc || prod.reqs?.gacc || initialData.reqs?.gacc || '',
            coding: prod.coding || prod.reqs?.coding || initialData.reqs?.coding || '',
            ship: prod.ship || prod.reqs?.ship || initialData.reqs?.ship || '',
            label: prod.label || prod.reqs?.label || initialData.reqs?.label || '',
            notes: prod.notes || prod.reqs?.other || initialData.reqs?.other || '',
            matStatus: prod.matStatus || prod.pkg?.mat_status || initialData.pkg?.mat_status || 'Pending',
            pkgStatus: prod.pkgStatus || prod.pkg?.pkg_status || initialData.pkg?.pkg_status || 'Pending',
            arriveDate: prod.arriveDate || prod.pkg?.arrive_date || initialData.pkg?.arrive_date || '',
            checkStatus: prod.checkStatus || prod.pkg?.check_status || initialData.pkg?.check_status || 'Pending',
            line: prod.line || prod.plan?.line || initialData.plan?.line || '',
            schedule: prod.schedule || prod.plan?.start_date || initialData.plan?.start_date || initialData.date || '',
            expectedShip: prod.expectedShip || '',
            qtyActual: mapQtyActual(prod.qtyActual || prod.plan?.qty_actual || initialData.plan?.qty_actual),
            planNotes: prod.planNotes || prod.plan?.log || initialData.plan?.log || ''
        }))
        : [{
            id: Date.now(),
            name: initialData.product || '',
            qty: initialData.qty || '',
            spec: initialData.spec || '',
            gacc: initialData.reqs?.gacc || '',
            coding: initialData.reqs?.coding || '',
            ship: initialData.reqs?.ship || '',
            label: initialData.reqs?.label || '',
            notes: initialData.reqs?.other || '',
            matStatus: initialData.pkg?.mat_status || 'Pending',
            pkgStatus: initialData.pkg?.pkg_status || 'Pending',
            arriveDate: initialData.pkg?.arrive_date || '',
            checkStatus: initialData.pkg?.check_status || 'Pending',
            line: initialData.plan?.line || '',
            schedule: initialData.plan?.start_date || initialData.date || '',
            expectedShip: '',
            qtyActual: mapQtyActual(initialData.plan?.qty_actual),
            planNotes: initialData.plan?.log || ''
        }];

    return {
        signingDate: initialData.date || '',
        brand: initialData.brand || '',
        contractNo: initialData.no || '',
        estComplete: initialData.plan?.end_date || '',
        invoiceNo: initialData.fin?.inv || '',
        depDate: initialData.fin?.date_dep || '',
        depStatus: initialData.fin?.dep || 'Pending',
        preDate: initialData.fin?.date_pre || '',
        preStatus: initialData.fin?.pre || 'Pending',
        finalDate: initialData.fin?.date_bal || initialData.fin?.final_payment_date || '',
        finalStatus: initialData.fin?.bal || initialData.fin?.final_payment_status || 'Pending',
        products: mappedProducts
    };
};

const ImportContractModal = ({ isOpen, onClose, onSave, initialData, isEditMode = false }) => {
    if (!isOpen) return null;

    // --- State ---
    const [activeTab, setActiveTab] = useState('reqs'); // reqs, pkg, plan
    const [editingProductIndex, setEditingProductIndex] = useState(null);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);

    // Form Data
    const [formData, setFormData] = useState(getBlankFormData);

    // --- Init Data ---
    useEffect(() => {
        if (isOpen) {
            setFormData(mapInitialDataToForm(initialData));
        }
    }, [isOpen, initialData]);

    // --- Handlers ---
    const handleContractChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const displayValue = (value) => {
        if (value === 0 || value === '0') return '0';
        const trimmed = typeof value === 'string' ? value.trim() : value;
        return trimmed ? String(trimmed) : '—';
    };

    // Open Edit Modal for a specific product
    const handleEditProduct = (index) => {
        setEditingProductIndex(index);
        setIsEditProductOpen(true);
    };

    // Save changes from Edit Modal back to product list
    const handleProductUpdate = (updatedContract) => {
        if (editingProductIndex === null) return;

        setFormData(prev => {
            const newProducts = [...prev.products];
            const currentProduct = newProducts[editingProductIndex];

            // Map back fields from Contract structure to Product structure
            newProducts[editingProductIndex] = {
                ...currentProduct,
                name: updatedContract.product || currentProduct.name,

                // Reqs
                gacc: updatedContract.reqs?.gacc || currentProduct.gacc,
                coding: updatedContract.reqs?.coding || currentProduct.coding,
                ship: updatedContract.reqs?.ship || currentProduct.ship,
                label: updatedContract.reqs?.label || currentProduct.label,
                notes: updatedContract.reqs?.other || currentProduct.notes,

                // Pkg
                matStatus: updatedContract.pkg?.mat_status || currentProduct.matStatus,
                pkgStatus: updatedContract.pkg?.pkg_status || currentProduct.pkgStatus,
                arriveDate: updatedContract.pkg?.arrive_date || currentProduct.arriveDate,
                checkStatus: updatedContract.pkg?.check_status || currentProduct.checkStatus,

                // Plan
                line: updatedContract.plan?.mat || updatedContract.plan?.line || currentProduct.line, // 'mat' is used as machine/line in editor
                schedule: updatedContract.date || currentProduct.schedule, // Using date for start schedule proxy
                qtyActual: updatedContract.plan?.qty_actual || currentProduct.qtyActual,
                planNotes: updatedContract.plan?.log || currentProduct.planNotes,
                
                // Extra fields from Edit Modal
                qty: updatedContract.qty || currentProduct.qty,
                spec: updatedContract.spec || currentProduct.spec
            };

            return { ...prev, products: newProducts };
        });
        setIsEditProductOpen(false);
        setEditingProductIndex(null);
    };

    // Construct a "Contract-like" object from the current product for the Editor
    const getCurrentProductAsContract = () => {
        if (editingProductIndex === null) return null;
        const p = formData.products[editingProductIndex];
        return {
            no: formData.contractNo,
            brand: formData.brand,
            product: p.name,
            qty: p.qty, 
            spec: p.spec,
            reqs: {
                gacc: p.gacc,
                coding: p.coding,
                ship: p.ship,
                label: p.label,
                other: p.notes
            },
            pkg: {
                mat_status: p.matStatus,
                pkg_status: p.pkgStatus,
                arrive_date: p.arriveDate,
                check_status: p.checkStatus
            },
            plan: {
                mat: p.line,
                log: p.planNotes,
                qty_actual: p.qtyActual // Include qty_actual for plan tab
            },
            date: p.schedule // Use schedule as the main date for the editor
        };
    };

    // Save
    const handleSave = () => {
        // Construct the object structure to simulate a new contract entry
        // NOTE: In a real app this would likely send the whole structure.
        // For compatibility with the current list view helper, we'll focus on the first product + top level info.

        const mainProd = formData.products[0] || {};

        const newContract = {
            id: Date.now(), // Temp ID
            no: formData.contractNo,
            date: formData.signingDate,
            brand: formData.brand,

            // Fin
            fin: {
                inv: formData.invoiceNo,
                date_dep: formData.depDate,
                dep: formData.depStatus,
                date_pre: formData.preDate,
                pre: formData.preStatus,
                date_bal: formData.finalDate,
                bal: formData.finalStatus,
            },

            // First Product (Display Rep)
            product: mainProd.name,
            qty: mainProd.qty,
            spec: mainProd.spec,
            reqs: {
                gacc: mainProd.gacc,
                coding: mainProd.coding,
                ship: mainProd.ship,
                label: mainProd.label,
                other: mainProd.notes
            },
            pkg: {
                mat_status: mainProd.matStatus,
                pkg_status: mainProd.pkgStatus,
                arrive_date: mainProd.arriveDate,
                check_status: mainProd.checkStatus
            },
            plan: {
                line: mainProd.line,
                log: mainProd.planNotes,
                qty_actual: mainProd.qtyActual
            },

            // Full products array for backend
            products: formData.products,
            status: initialData?.status || 'New'
        };

        onSave(newContract);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Modal Content - Centered & Larger */}
            <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {isEditMode ? 'Edit Contract' : 'Import New Contract'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">

                    {/* 1. Basic Info */}
                    <section className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            Basic Info
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Signing Date</Label>
                                <div className="relative">
                                    <Input
                                        value={formData.signingDate}
                                        onChange={e => handleContractChange('signingDate', e.target.value)}
                                        className="pl-3 pr-10"
                                        placeholder="DD/MM/YYYY"
                                    />
                                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Brand</Label>
                                <Input
                                    value={formData.brand}
                                    onChange={e => handleContractChange('brand', e.target.value)}
                                    placeholder="Brand Name"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Contract Number</Label>
                                <Input
                                    value={formData.contractNo}
                                    onChange={e => handleContractChange('contractNo', e.target.value)}
                                    placeholder="e.g. CON-2025-001"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Est. Complete</Label>
                                <div className="relative">
                                    <Input
                                        value={formData.estComplete}
                                        onChange={e => handleContractChange('estComplete', e.target.value)}
                                        className="pl-3 pr-10"
                                        placeholder="DD/MM/YYYY"
                                    />
                                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100 my-6" />

                    {/* 2. Finance */}
                    <section className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Finance</h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                            {/* Invoice */}
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Invoice Number</Label>
                                <Input
                                    value={formData.invoiceNo}
                                    onChange={e => handleContractChange('invoiceNo', e.target.value)}
                                    placeholder="Enter Invoice No"
                                />
                            </div>
                            {/* Deposit */}
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Deposit Date</Label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Input
                                            value={formData.depDate}
                                            onChange={e => handleContractChange('depDate', e.target.value)}
                                            placeholder="DD/MM/YYYY"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="w-36">
                                        <StatusSelect
                                            value={formData.depStatus}
                                            onChange={val => handleContractChange('depStatus', val)}
                                            options={['Pending', 'Paid', 'Partial']}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pre-Production */}
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Pre-production Payment</Label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Input
                                            value={formData.preDate}
                                            onChange={e => handleContractChange('preDate', e.target.value)}
                                            placeholder="DD/MM/YYYY"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="w-36">
                                        <StatusSelect
                                            value={formData.preStatus}
                                            onChange={val => handleContractChange('preStatus', val)}
                                            options={['Pending', 'Paid', 'Overdue']}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Final Payment */}
                            <div>
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Final Payment Date</Label>
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <Input
                                            value={formData.finalDate}
                                            onChange={e => handleContractChange('finalDate', e.target.value)}
                                            placeholder="DD/MM/YYYY"
                                        />
                                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="w-36">
                                        <StatusSelect
                                            value={formData.finalStatus}
                                            onChange={val => handleContractChange('finalStatus', val)}
                                            options={['Pending', 'Paid', 'Overdue']}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="border-gray-100 my-6" />

                    {/* 3. Products Table */}
                    <section>
                        {/* Tabs */}
                        <div className="flex items-center gap-8 border-b border-gray-200 mb-4">
                            {[
                                { id: 'reqs', label: 'Reqs' },
                                { id: 'pkg', label: 'Pms' },
                                { id: 'plan', label: 'Plan & Report' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "pb-3 text-sm font-semibold border-b-2 transition-all px-1",
                                        activeTab === tab.id
                                            ? "border-[#066070] text-[#066070]"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                                    <tr>
                                        {/* Product Name is always first */}
                                        <th className="px-4 py-3 min-w-[140px]">Product Name</th>

                                        {/* Dynamic Columns */}
                                        {activeTab === 'reqs' && (
                                            <>
                                                <th className="px-4 py-3">GACC</th>
                                                <th className="px-4 py-3">Coding Format</th>
                                                <th className="px-4 py-3">Expected Ship</th>
                                                <th className="px-4 py-3">Additional Notes</th>
                                            </>
                                        )}
                                        {activeTab === 'pkg' && (
                                            <>
                                                <th className="px-4 py-3">Mat Status</th>
                                                <th className="px-4 py-3">Pkg Status</th>
                                                <th className="px-4 py-3">Arrive Date</th>
                                                <th className="px-4 py-3">Check Status</th>
                                            </>
                                        )}
                                        {activeTab === 'plan' && (
                                            <>
                                                <th className="px-4 py-3">Line</th>
                                                <th className="px-4 py-3">Schedule</th>
                                                <th className="px-4 py-3">Act. Qty</th>
                                                <th className="px-4 py-3">Notes</th>
                                            </>
                                        )}
                                        <th className="px-4 py-3 w-20"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {formData.products.map((prod, idx) => (
                                        <tr key={prod.id} className="group hover:bg-gray-50">
                                            {/* Product Name Input */}
                                            <td className="px-4 py-1.5">
                                                <Input
                                                    value={displayValue(prod.name)}
                                                    readOnly
                                                    className="h-8 text-sm bg-gray-50 text-gray-600"
                                                    placeholder="Product Name"
                                                />
                                            </td>

                                            {/* Tab: Reqs */}
                                            {activeTab === 'reqs' && (
                                                <>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.gacc)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.coding)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.ship)} readOnly className="h-8 bg-gray-50 text-gray-600" placeholder="DD/MM" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.notes)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                </>
                                            )}

                                            {/* Tab: Pms (Pkg) */}
                                            {activeTab === 'pkg' && (
                                                <>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.matStatus)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.pkgStatus)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.arriveDate)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.checkStatus)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                </>
                                            )}

                                            {/* Tab: Plan */}
                                            {activeTab === 'plan' && (
                                                <>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.line)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.schedule)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.qtyActual)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                    <td className="px-4 py-1.5"><Input value={displayValue(prod.planNotes)} readOnly className="h-8 bg-gray-50 text-gray-600" /></td>
                                                </>
                                            )}

                                            {/* Actions */}
                                            <td className="px-4 py-1.5 text-center flex items-center justify-end gap-1">
                                                <button onClick={() => handleEditProduct(idx)} className="text-gray-400 hover:text-[#066070] transition-colors p-1" title="Edit Detail">
                                                    <Pen className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Footer Buttons */}
                <div className="px-8 py-4 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-xl shrink-0">
                    <Button variant="outline" onClick={onClose} className="px-6 font-bold text-gray-700">
                        Cancel
                    </Button>
                    <Button variant="brand" onClick={handleSave} className="px-6 font-bold bg-[#297A88] hover:bg-[#20626e]">
                        {isEditMode ? 'Save' : 'Import'}
                    </Button>
                </div>

            </div>

            {/* Nested Edit Product Modal */}
            <EditContractModal
                isOpen={isEditProductOpen}
                onClose={() => setIsEditProductOpen(false)}
                onSave={handleProductUpdate}
                contract={getCurrentProductAsContract()}
                hideFinance={true}
                zIndex={60}
            />
        </div>
    );
};

export default ImportContractModal;
