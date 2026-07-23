export interface WeeklySalesRow {
  id: string;
  week: string; // e.g. "Week 1", "Week 2"
  date: string; // e.g. "2026-01-05"
  store_id: string;
  product_id: string;
  product_name: string;
  category: string;
  gross_sales: number;
  discount_amount: number;
  net_sales: number;
  return_amount: number;
  transaction_count: number;
  sales_target: number;
  stockout_days: number;
  inventory_units: number;
}

export interface StoreMasterRow {
  store_id: string;
  store_name: string;
  region: string; // "North", "South", "East", "West", "Central"
  city: string;
  format: string; // "Hypermarket", "Supermarket", "Express", "Flagship"
  manager_name: string;
  target_sales: number; // Base weekly store target
}

export interface MergedSalesRecord extends WeeklySalesRow {
  store_name: string;
  region: string;
  city: string;
  format: string;
  manager_name: string;
}

export interface FilterState {
  weeks: string[];
  regions: string[];
  cities: string[];
  formats: string[];
  categories: string[];
  searchQuery: string;
}

export interface DashboardKPIs {
  netSales: number;
  grossSales: number;
  targetSales: number;
  targetAchievementPct: number;
  averageTransactionValue: number;
  returnRatePct: number;
  discountRatePct: number;
  totalReturnAmount: number;
  totalDiscountAmount: number;
  totalTransactions: number;
  totalStockoutDays: number;
  stockoutStoresCount: number;
  totalRecords: number;
}

export interface RegionPerformance {
  region: string;
  netSales: number;
  targetSales: number;
  achievementPct: number;
  returnAmount: number;
  returnRatePct: number;
  stockoutDays: number;
  storeCount: number;
}

export interface CategoryPerformance {
  category: string;
  netSales: number;
  grossSales: number;
  returnAmount: number;
  returnRatePct: number;
  discountRatePct: number;
  stockoutDays: number;
  transactionCount: number;
}

export interface StorePerformance {
  storeId: string;
  storeName: string;
  region: string;
  city: string;
  format: string;
  managerName: string;
  netSales: number;
  targetSales: number;
  achievementPct: number;
  returnAmount: number;
  returnRatePct: number;
  discountRatePct: number;
  stockoutDays: number;
  transactionCount: number;
  averageTransactionValue: number;
  status: 'exceeding' | 'on_track' | 'lagging' | 'critical';
}

export interface WeeklyTrend {
  week: string;
  date: string;
  netSales: number;
  targetSales: number;
  returnAmount: number;
  discountAmount: number;
  stockoutDays: number;
  achievementPct: number;
}

export interface BusinessInsightItem {
  id: string;
  type: 'best_region' | 'worst_region' | 'target_miss' | 'high_returns' | 'stockout_risk' | 'opportunity';
  title: string;
  description: string;
  metric: string;
  severity: 'success' | 'warning' | 'danger' | 'info';
  category?: string;
  region?: string;
  storeId?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface FormulaConfig {
  returnRateFormula: 'net_sales' | 'gross_sales'; // default: return_amount / net_sales * 100
  targetMetThreshold: number; // default: 90%
  highReturnThresholdPct: number; // default: 5%
  stockoutRiskThresholdDays: number; // default: 3 days
}
