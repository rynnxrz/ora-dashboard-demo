export const CONTRACT_DATA = [
    // 1. New / Contract (Red)
    {
        date: "07/01/2025",
        no: "LTUM-202502001",
        brand: "Little",
        product: "Liquid Calcium (Xylitol verison 2)",
        spec: "10ml/sachet",
        qty: "900,000",
        status: "New", // mapped to new_1/new_2
        reqs: { gacc: "—", coding: "—", ship: "FOB Shanghai", label: "—", other: "—" },
        fin: { inv: "INV-2024001", dep: "Paid", pre: "Pending", bal: "Pending" },
        plan: { mat: "Partial", log: "Scheduled: 2025-02-10" }
    },
    {
        date: "07/05/2025",
        no: "LTUM-202502005",
        brand: "PowerGums",
        product: "Energy Gels (Caffeine Boost)",
        spec: "30g/pack",
        qty: "50,000",
        status: "New",
        reqs: { gacc: "Check", coding: "—", ship: "FOB Shenzhen", label: "Draft", other: "—" },
        fin: { inv: "INV-2024012", dep: "Pending", pre: "Pending", bal: "Pending" },
        plan: { mat: "Missing", log: "TBD" }
    },

    // 2. Pending / Preparation (Red/Pending)
    {
        date: "07/01/2025",
        no: "LTUM-202502002",
        brand: "Little",
        product: "Liquid Calcium (Xylitol verison 2)",
        spec: "10ml/sachet",
        qty: "900,000",
        status: "Pending",
        reqs: { gacc: "Done", coding: "Inkjet", ship: "CIF Melbourne", label: "Confirmed", other: "—" },
        fin: { inv: "INV-2024002", dep: "Paid", pre: "Paid", bal: "Pending" },
        plan: { mat: "Ready", log: "Batch-A start 2025/02/15" }
    },
    {
        date: "06/28/2025",
        no: "PG-2025-003",
        brand: "PowerGums",
        product: "Vitamin C Gummies (Lemon)",
        spec: "60ct/bottle",
        qty: "20,000",
        status: "Pending",
        reqs: { gacc: "Done", coding: "Laser", ship: "CIF LA", label: "Reviewing", other: "—" },
        fin: { inv: "INV-2024009", dep: "Paid", pre: "Pending", bal: "Pending" },
        plan: { mat: "Partial", log: "Awaiting Artwork" }
    },
    {
        date: "06/30/2025",
        no: "VT-2025-010",
        brand: "Vitality",
        product: "Protein Powder (Vanilla)",
        spec: "1kg/tub",
        qty: "5,000",
        status: "Pending",
        reqs: { gacc: "Start", coding: "Inkjet", ship: "EXW", label: "Confirmed", other: "Cert needed" },
        fin: { inv: "INV-2024015", dep: "Pending", pre: "Pending", bal: "Pending" },
        plan: { mat: "Ready", log: "Slot: Wk 35" }
    },

    // 3. Production / Ongoing (Amber)
    {
        date: "07/01/2025",
        no: "LTUM-202502003",
        brand: "Little",
        product: "Liquid Calcium (Xylitol verison 2)",
        spec: "10ml/sachet",
        qty: "900,000",
        status: "Production",
        reqs: { gacc: "Done", coding: "Inkjet", ship: "CIF Melbourne", label: "Confirmed", other: "Palletized" },
        fin: { inv: "INV-2024003", dep: "Paid", pre: "Paid", bal: "Pending" },
        plan: { mat: "Ready", log: "In Production (Stage 3)" }
    },
    {
        date: "06/15/2025",
        no: "OR-2025-088",
        brand: "OraNutrition",
        product: "Collagen Peptides",
        spec: "300g/tub",
        qty: "15,000",
        status: "Production",
        reqs: { gacc: "Done", coding: "Inkjet", ship: "CIF NY", label: "Confirmed", other: "—" },
        fin: { inv: "INV-2024005", dep: "Paid", pre: "Paid", bal: "Pending" },
        plan: { mat: "Ready", log: "Packing Stage" }
    },
    {
        date: "06/20/2025",
        no: "LTUM-202502006",
        brand: "Little",
        product: "Zinc Drops",
        spec: "30ml/bottle",
        qty: "100,000",
        status: "Production",
        reqs: { gacc: "Done", coding: "Laser", ship: "CIF Melbourne", label: "Confirmed", other: "—" },
        fin: { inv: "INV-2024006", dep: "Paid", pre: "Paid", bal: "Pending" },
        plan: { mat: "Ready", log: "Filling Stage" }
    },

    // 4. Done (Green)
    {
        date: "07/01/2025",
        no: "LTUM-202502004",
        brand: "Little",
        product: "Liquid Calcium (Xylitol verison 3)",
        spec: "10ml/sachet",
        qty: "900,000",
        status: "Done",
        reqs: { gacc: "Done", coding: "Inkjet", ship: "CIF Melbourne", label: "Confirmed", other: "—" },
        fin: { inv: "INV-2024004", dep: "Paid", pre: "Paid", bal: "Paid" },
        plan: { mat: "Ready", log: "Shipped 2025-01-20" }
    },
    {
        date: "05/10/2025",
        no: "PG-2025-001",
        brand: "PowerGums",
        product: "Caffeine Mints",
        spec: "50ct/tin",
        qty: "100,000",
        status: "Done",
        reqs: { gacc: "Done", coding: "—", ship: "FOB Shenzhen", label: "Confirmed", other: "—" },
        fin: { inv: "INV-2024001", dep: "Paid", pre: "Paid", bal: "Paid" },
        plan: { mat: "Ready", log: "Delivered" }
    },
    {
        date: "05/20/2025",
        no: "VT-2025-005",
        brand: "Vitality",
        product: "Magnesium Tablets",
        spec: "120ct/bottle",
        qty: "10,000",
        status: "Done",
        reqs: { gacc: "Done", coding: "Inkjet", ship: "CIF LA", label: "Confirmed", other: "—" },
        fin: { inv: "INV-2024000", dep: "Paid", pre: "Paid", bal: "Paid" },
        plan: { mat: "Ready", log: "Delivered" }
    }
];

export const MACHINE_DATA = [
    { name: 'Square Sachet', displayName: 'Square Sachet', lines: ['Powder stick sachet', 'PSS', 'PSS R'] },
    { name: 'Sachet Filling', displayName: 'Sachet Fill', lines: ['SF R1', 'SF R2'] },
    { name: 'Tablets', displayName: 'Tablets', lines: [] },
    { name: 'Liquid Sachet', displayName: 'Liquid Sachet', lines: ['LS01 L', 'LS01 R', 'LS02', 'LS03', 'LS04 R'] },
    { name: 'Packing', displayName: 'Packing', lines: ['Bottle 1', 'Bottle 2', 'Bottle 3'] },
    { name: 'Hard Cap', displayName: 'Hard Cap', lines: ['Cap 1', 'Cap 2'] },
    { name: 'Soft Cap', displayName: 'Soft Cap', lines: ['Cap 1', 'Cap 2'] },
    { name: 'Pouch', displayName: 'Pouch', lines: ['Liquid Pouch'] },
    { name: 'Gel Candy', displayName: 'Gel Candy', lines: ['Gel Candy Blister'] }
];

export const REPORT_DATA = [
    {
        contractNo: "LTUM-202502001", // Links to CONTRACT_DATA[0]
        taskNo: "T-2025-001",
        status: "Temporary", // Specific report status
        color: "#297A88",
        bgColor: "bg-[#297A88]",
        badgeBg: "bg-[#E0F7FA]",
        badgeText: "text-[#006064]",
        planned: 1000,
        actual: 800,
        isSaved: true,
        alert: "Remaining 200 units carried over to Jan 2"
    },
    {
        contractNo: "LTUM-202502002", // Links to CONTRACT_DATA[2]
        taskNo: "T-2025-002",
        status: "Pending",
        color: "#EF4444",
        bgColor: "bg-[#EF4444]",
        badgeBg: "bg-red-50",
        badgeText: "text-red-600",
        planned: 1000,
        actual: null,
        isSaved: false
    },
    {
        contractNo: "LTUM-202502003", // Links to CONTRACT_DATA[5]
        taskNo: "T-2025-003",
        status: "Production",
        color: "#F59E0B",
        bgColor: "bg-[#F59E0B]",
        badgeBg: "bg-orange-50",
        badgeText: "text-orange-600",
        planned: 5000,
        actual: 2500,
        isSaved: false
    },
    {
        contractNo: "OR-2025-088", // Links to CONTRACT_DATA[6]
        taskNo: "T-2025-004",
        status: "Done",
        color: "#10B981",
        bgColor: "bg-[#10B981]",
        badgeBg: "bg-green-50",
        badgeText: "text-green-600",
        planned: 2000,
        actual: 2000,
        isSaved: true
    }
];

// --- Helper to generate Lead Time Mock Data (for Lead Time Deep Dive Widget) ---
// Logic: 100 completed contracts. 82 are <= 90 days. Median is 42.
const generateLeadTimeContracts = () => {
    const contracts = [];
    // 1. Generate 82 "On-time" contracts (Duration <= 90)
    // Target Median: 42.
    // We need indices 49 and 50 (0-indexed) to be 42.
    // Distribution:
    // - 45 items: 20-41 days
    // - 10 items: 42 days (covers indices 45-54)
    // - 27 items: 43-90 days
    // Total On-time: 45+10+27 = 82.
    for (let i = 0; i < 82; i++) {
        let duration;
        if (i < 45) {
            duration = 20 + Math.floor(Math.random() * 22); // 20 to 41
        } else if (i < 55) {
            duration = 42; // Exact median anchor
        } else {
            duration = 43 + Math.floor(Math.random() * 48); // 43 to 90
        }
        contracts.push({ id: `C-OT-${i}`, duration, onTime: true });
    }

    // 2. Generate 18 "Late" contracts (Duration > 90)
    for (let i = 0; i < 18; i++) {
        const duration = 91 + Math.floor(Math.random() * 60); // 91 to 150
        contracts.push({ id: `C-LT-${i}`, duration, onTime: false });
    }

    return contracts;
};

export const LEAD_TIME_CONTRACTS = generateLeadTimeContracts();

