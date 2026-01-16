export const CONTRACT_DATA = [
    // 1. New Contract / Data Entry (Flowchart Step 1)
    {
        date: "07/10/2025",
        no: "LTUM-202502010",
        brand: "Little",
        product: "Liquid Calcium (Xylitol verison 2)",
        spec: "10ml/sachet",
        qty: "900,000",
        status: "New",
        reqs: {
            gacc: "Check",
            coding: "—",
            ship: "FOB Shanghai",
            label: "Draft",
            other: "—"
        },
        fin: {
            inv: "INV-2025NEW",
            dep: "Pending", date_dep: "—",
            pre: "Pending", date_pre: "—",
            bal: "Pending", date_bal: "—",
            final_payment_status: "Pending", final_payment_date: "—"
        },
        pkg: {
            mat_status: "Pending",
            pkg_status: "Pending",
            arrive_date: "—",
            check_status: "—"
        },
        plan: {
            line: "—",
            start_date: "—",
            end_date: "—",
            qty_actual: 0,
            mat: "Missing",
            log: "TBD"
        }
    },

    // 2. Pending Preparation / Deposit Paid (Flowchart Step 2)
    {
        date: "07/08/2025",
        no: "PG-202502011",
        brand: "PowerGums",
        product: "Energy Gels (Caffeine Boost)",
        spec: "30g/pack",
        qty: "50,000",
        status: "Pending",
        reqs: {
            gacc: "Done",
            coding: "Inkjet",
            ship: "FOB Shenzhen",
            label: "Reviewing",
            other: "—"
        },
        fin: {
            inv: "INV-2025008",
            dep: "Paid", date_dep: "2025-07-09",
            pre: "Pending", date_pre: "—",
            bal: "Pending", date_bal: "—",
            final_payment_status: "Pending", final_payment_date: "—"
        },
        pkg: {
            mat_status: "Arrived",
            pkg_status: "Pending",
            arrive_date: "2025-07-15 (Est)",
            check_status: "Pending"
        },
        plan: {
            line: "—",
            start_date: "—",
            end_date: "—",
            qty_actual: 0,
            mat: "Partial",
            log: "Awaiting Materials"
        }
    },

    // 3. Pending Scheduling / Material & Pkg Prep (Flowchart Step 3)
    {
        date: "07/01/2025",
        no: "VT-202502012",
        brand: "Vitality",
        product: "Protein Powder (Vanilla)",
        spec: "1kg/tub",
        qty: "5,000",
        status: "Pending",
        reqs: {
            gacc: "Done",
            coding: "Inkjet",
            ship: "EXW",
            label: "Confirmed",
            other: "Cert needed"
        },
        fin: {
            inv: "INV-2025005",
            dep: "Paid", date_dep: "2025-07-02",
            pre: "Paid", date_pre: "2025-07-10",
            bal: "Pending", date_bal: "—",
            final_payment_status: "Pending", final_payment_date: "—"
        },
        pkg: {
            mat_status: "Pending",
            pkg_status: "Pending",
            arrive_date: "—",
            check_status: "Pending"
        },
        plan: {
            line: "—",
            start_date: "—",
            end_date: "—",
            qty_actual: 0,
            mat: "Ready",
            log: "Ready for Schedule"
        }
    },

    // 4. Production Schedule / Pending Production (Flowchart Step 4)
    {
        date: "06/28/2025",
        no: "LTUM-202502015",
        brand: "Little",
        product: "Liquid Calcium (Xylitol verison 2)",
        spec: "10ml/sachet",
        qty: "900,000",
        status: "Production",
        reqs: {
            gacc: "Done",
            coding: "Inkjet",
            ship: "CIF Melbourne",
            label: "Confirmed",
            other: "Palletized"
        },
        fin: {
            inv: "INV-2025015",
            dep: "Paid", date_dep: "2025-06-29",
            pre: "Paid", date_pre: "2025-07-01",
            bal: "Pending", date_bal: "—",
            final_payment_status: "Pending", final_payment_date: "—"
        },
        pkg: {
            mat_status: "Arrived",
            pkg_status: "Arrived",
            arrive_date: "2025-06-30",
            check_status: "Checked"
        },
        plan: {
            line: "Liquid Sachet",
            start_date: "2025-07-12",
            end_date: "2025-07-20",
            qty_actual: 0,
            mat: "Ready",
            log: "Scheduled: 2025-07-12"
        }
    },

    // 5. Planned Production Schedule / Moving to Production (Flowchart Step 5)
    {
        date: "06/25/2025",
        no: "OR-2025-090",
        brand: "OraNutrition",
        product: "Collagen Peptides",
        spec: "300g/tub",
        qty: "15,000",
        status: "Production",
        reqs: {
            gacc: "Done",
            coding: "Laser",
            ship: "CIF NY",
            label: "Confirmed",
            other: "—"
        },
        fin: {
            inv: "INV-2025020",
            dep: "Paid", date_dep: "2025-06-26",
            pre: "Paid", date_pre: "2025-06-28",
            bal: "Pending", date_bal: "—",
            final_payment_status: "Pending", final_payment_date: "—"
        },
        pkg: {
            mat_status: "Arrived",
            pkg_status: "Arrived",
            arrive_date: "2025-06-20",
            check_status: "Checked"
        },
        plan: {
            line: "Packing",
            start_date: "2025-07-05",
            end_date: "2025-07-10",
            qty_actual: 5000,
            mat: "Ready",
            log: "In Production"
        }
    },

    // 6. Pending Production Complete / Finished (Flowchart Step 6)
    {
        date: "06/20/2025",
        no: "LTUM-202502006",
        brand: "Little",
        product: "Zinc Drops",
        spec: "30ml/bottle",
        qty: "100,000",
        status: "Production",
        reqs: {
            gacc: "Done",
            coding: "Laser",
            ship: "CIF Melbourne",
            label: "Confirmed",
            other: "—"
        },
        fin: {
            inv: "INV-2025006",
            dep: "Paid", date_dep: "2025-06-21",
            pre: "Paid", date_pre: "2025-06-25",
            bal: "Pending", date_bal: "—",
            final_payment_status: "Pending", final_payment_date: "—"
        },
        pkg: {
            mat_status: "Arrived",
            pkg_status: "Arrived",
            arrive_date: "2025-06-15",
            check_status: "Checked"
        },
        plan: {
            line: "Filling Stage",
            start_date: "2025-06-28",
            end_date: "2025-07-05",
            qty_actual: 100000,
            mat: "Ready",
            log: "Production Complete"
        }
    },

    // 7. Pending Shipping / Done (Flowchart Step 6->End)
    {
        date: "06/10/2025",
        no: "PG-2025-001",
        brand: "PowerGums",
        product: "Caffeine Mints",
        spec: "50ct/tin",
        qty: "100,000",
        status: "Done",
        reqs: {
            gacc: "Done",
            coding: "—",
            ship: "FOB Shenzhen",
            label: "Confirmed",
            other: "—"
        },
        fin: {
            inv: "INV-2025001",
            dep: "Paid", date_dep: "2025-06-11",
            pre: "Paid", date_pre: "2025-06-15",
            bal: "Paid", date_bal: "2025-07-15",
            final_payment_status: "Paid", final_payment_date: "2025-07-15"
        },
        pkg: {
            mat_status: "Arrived",
            pkg_status: "Arrived",
            arrive_date: "2025-06-05",
            check_status: "Checked"
        },
        plan: {
            line: "Tablets",
            start_date: "2025-06-20",
            end_date: "2025-06-25",
            qty_actual: 100000,
            mat: "Ready",
            log: "Shipped 2025-07-16"
        }
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
        contractNo: "LTUM-202502010", // Links to CONTRACT_DATA[0]
        taskNo: "T-2025-001",
        status: "Temporary",
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
        contractNo: "PG-202502011", // Links to CONTRACT_DATA[1]
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
        contractNo: "LTUM-202502015", // Links to CONTRACT_DATA[3]
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
        contractNo: "PG-2025-001", // Links to CONTRACT_DATA[6]
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
