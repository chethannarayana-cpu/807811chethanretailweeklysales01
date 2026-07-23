import * as XLSX from 'xlsx';
import { StoreMasterRow, WeeklySalesRow, MergedSalesRecord } from '../types/retail';

export const DEFAULT_STORES: StoreMasterRow[] = [
  { store_id: 'STR-101', store_name: 'Metro Flagship - Downtown', region: 'North', city: 'New York', format: 'Flagship', manager_name: 'Sarah Jenkins', target_sales: 125000 },
  { store_id: 'STR-102', store_name: 'Harbor Express', region: 'North', city: 'Boston', format: 'Express', manager_name: 'David Miller', target_sales: 45000 },
  { store_id: 'STR-103', store_name: 'Liberty Supermarket', region: 'North', city: 'Philadelphia', format: 'Supermarket', manager_name: 'Elena Rostova', target_sales: 85000 },
  { store_id: 'STR-104', store_name: 'Capital Hypermarket', region: 'North', city: 'Washington DC', format: 'Hypermarket', manager_name: 'Marcus Vance', target_sales: 160000 },
  { store_id: 'STR-201', store_name: 'Bayside Flagship', region: 'South', city: 'Miami', format: 'Flagship', manager_name: 'Carlos Rodriguez', target_sales: 110000 },
  { store_id: 'STR-202', store_name: 'Peachtree Supermarket', region: 'South', city: 'Atlanta', format: 'Supermarket', manager_name: 'Aisha Howard', target_sales: 78000 },
  { store_id: 'STR-203', store_name: 'Music City Express', region: 'South', city: 'Nashville', format: 'Express', manager_name: 'James Wright', target_sales: 42000 },
  { store_id: 'STR-204', store_name: 'Space City Hypermarket', region: 'South', city: 'Houston', format: 'Hypermarket', manager_name: 'Priya Sharma', target_sales: 150000 },
  { store_id: 'STR-301', store_name: 'Golden Gate Flagship', region: 'West', city: 'San Francisco', format: 'Flagship', manager_name: 'Alex Chen', target_sales: 135000 },
  { store_id: 'STR-302', store_name: 'Angel City Supermarket', region: 'West', city: 'Los Angeles', format: 'Supermarket', manager_name: 'Rachel Adams', target_sales: 95000 },
  { store_id: 'STR-303', store_name: 'Emerald Express', region: 'West', city: 'Seattle', format: 'Express', manager_name: 'Tom Kowalski', target_sales: 48000 },
  { store_id: 'STR-304', store_name: 'Desert Oasis Hypermarket', region: 'West', city: 'Phoenix', format: 'Hypermarket', manager_name: 'Maria Santos', target_sales: 140000 },
  { store_id: 'STR-401', store_name: 'Windy City Flagship', region: 'Central', city: 'Chicago', format: 'Flagship', manager_name: 'Kevin O\'Connor', target_sales: 120000 },
  { store_id: 'STR-402', store_name: 'Twin Cities Supermarket', region: 'Central', city: 'Minneapolis', format: 'Supermarket', manager_name: 'Laura Peterson', target_sales: 82000 },
  { store_id: 'STR-403', store_name: 'Gateway Express', region: 'Central', city: 'St. Louis', format: 'Express', manager_name: 'Brandon King', target_sales: 39000 },
];

const CATEGORIES = [
  'Consumer Electronics',
  'Apparel & Fashion',
  'Home & Kitchen',
  'Groceries & Fresh',
  'Beauty & Personal Care',
  'Sports & Outdoors',
];

const PRODUCTS_BY_CAT: Record<string, string[]> = {
  'Consumer Electronics': ['Smart OLED TV 55"', 'Noise-Canceling Headphones', 'Wireless Earbuds Pro', 'Smartwatch Series 5', 'Ultra Tablet 10"'],
  'Apparel & Fashion': ['Cotton Crewneck T-Shirt', 'Slim Fit Denim Jeans', 'Lightweight Running Jacket', 'Leather Crossbody Bag', 'Wool Blend Sweater'],
  'Home & Kitchen': ['Espresso Coffee Machine', 'Air Fryer XL 5.5L', 'Robot Vacuum Cleaner', 'Non-stick Cookware Set', 'Blender SmoothPro'],
  'Groceries & Fresh': ['Organic Whole Milk 1L', 'Artisanal Sourdough Bread', 'Premium Olive Oil 750ml', 'Arabica Coffee Beans 1kg', 'Organic Avocado Pack'],
  'Beauty & Personal Care': ['Hydrating Face Serum', 'Sonic Electric Toothbrush', 'Nourishing Shampoo 500ml', 'Sunscreen SPF 50+', 'EAU De Parfum 100ml'],
  'Sports & Outdoors': ['Pro Cushion Running Shoes', 'Yoga Mat Non-Slip', 'Adjustable Dumbbell Set', 'Camping Tent 4-Person', 'Insulated Stainless Flask'],
};

// Seeded random number generator for reproducible sample data
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateSampleWeeklySales(): WeeklySalesRow[] {
  const rows: WeeklySalesRow[] = [];
  let seed = 12345;
  let recordId = 1;

  // 8 Weeks of synthetic data
  for (let w = 1; w <= 8; w++) {
    const weekLabel = `Week ${w}`;
    // Approximate date for early 2026 weeks
    const weekDate = new Date(2026, 0, 5 + (w - 1) * 7).toISOString().split('T')[0];

    DEFAULT_STORES.forEach((store) => {
      CATEGORIES.forEach((category) => {
        const products = PRODUCTS_BY_CAT[category];
        const product = products[Math.floor(pseudoRandom(seed++) * products.length)];
        const productId = `PRD-${category.substring(0, 3).toUpperCase()}-${Math.floor(pseudoRandom(seed++) * 899 + 100)}`;

        // Regional variations & store format factors
        let formatMultiplier = 1.0;
        if (store.format === 'Flagship') formatMultiplier = 1.8;
        if (store.format === 'Hypermarket') formatMultiplier = 2.2;
        if (store.format === 'Supermarket') formatMultiplier = 1.2;
        if (store.format === 'Express') formatMultiplier = 0.6;

        let regionMultiplier = 1.0;
        if (store.region === 'North') regionMultiplier = 1.15;
        if (store.region === 'West') regionMultiplier = 1.10;
        if (store.region === 'South') regionMultiplier = 0.88; // Lower performance for South in synthetic dataset to show worst region insight
        if (store.region === 'Central') regionMultiplier = 0.98;

        // Introduce specific anomalies for insights:
        // High returns in Apparel
        const returnRateBase = category === 'Apparel & Fashion' ? 0.085 : 0.022; // 8.5% return rate for apparel!
        // Stockout anomaly for specific stores/weeks
        const isStockoutProneStore = store.store_id === 'STR-203' || store.store_id === 'STR-403' || (w === 4 && store.store_id === 'STR-102');

        const baseTarget = (store.target_sales / CATEGORIES.length) * (0.85 + pseudoRandom(seed++) * 0.3);
        const grossSales = Math.round(baseTarget * formatMultiplier * regionMultiplier * (0.8 + pseudoRandom(seed++) * 0.45));
        const discountRate = 0.05 + pseudoRandom(seed++) * 0.12;
        const discountAmount = Math.round(grossSales * discountRate);
        const netSales = Math.max(0, grossSales - discountAmount);
        const returnAmount = Math.round(netSales * (returnRateBase + pseudoRandom(seed++) * 0.03));
        const avgPrice = category === 'Consumer Electronics' ? 250 : category === 'Home & Kitchen' ? 90 : 35;
        const transactionCount = Math.max(12, Math.round(netSales / avgPrice));
        const stockoutDays = isStockoutProneStore && pseudoRandom(seed++) > 0.4 ? Math.floor(pseudoRandom(seed++) * 4) + 2 : (pseudoRandom(seed++) > 0.85 ? 1 : 0);
        const inventoryUnits = Math.round(150 + pseudoRandom(seed++) * 300 - stockoutDays * 30);

        rows.push({
          id: `REC-${recordId++}`,
          week: weekLabel,
          date: weekDate,
          store_id: store.store_id,
          product_id: productId,
          product_name: product,
          category: category,
          gross_sales: grossSales,
          discount_amount: discountAmount,
          net_sales: netSales,
          return_amount: returnAmount,
          transaction_count: transactionCount,
          sales_target: Math.round(baseTarget),
          stockout_days: stockoutDays,
          inventory_units: Math.max(0, inventoryUnits),
        });
      });
    });
  }

  return rows;
}

export function mergeSalesWithStoreMaster(
  sales: WeeklySalesRow[],
  stores: StoreMasterRow[]
): MergedSalesRecord[] {
  const storeMap = new Map<string, StoreMasterRow>();
  stores.forEach((s) => storeMap.set(s.store_id.trim().toUpperCase(), s));

  return sales.map((row) => {
    const store = storeMap.get(row.store_id.trim().toUpperCase());
    return {
      ...row,
      store_name: store ? store.store_name : row.store_id,
      region: store ? store.region : 'Unknown',
      city: store ? store.city : 'Unknown',
      format: store ? store.format : 'Standard',
      manager_name: store ? store.manager_name : 'N/A',
    };
  });
}

// Download utility for generating Excel (.xlsx) files
export function downloadExcelFile(data: any[], filename: string, sheetName: string = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}
