import {
  MergedSalesRecord,
  DashboardKPIs,
  RegionPerformance,
  CategoryPerformance,
  StorePerformance,
  WeeklyTrend,
  BusinessInsightItem,
  FormulaConfig,
} from '../types/retail';

export const DEFAULT_FORMULA_CONFIG: FormulaConfig = {
  returnRateFormula: 'net_sales',
  targetMetThreshold: 90,
  highReturnThresholdPct: 5.0,
  stockoutRiskThresholdDays: 2,
};

export function calculateDashboardKPIs(
  records: MergedSalesRecord[],
  config: FormulaConfig = DEFAULT_FORMULA_CONFIG
): DashboardKPIs {
  if (!records.length) {
    return {
      netSales: 0,
      grossSales: 0,
      targetSales: 0,
      targetAchievementPct: 0,
      averageTransactionValue: 0,
      returnRatePct: 0,
      discountRatePct: 0,
      totalReturnAmount: 0,
      totalDiscountAmount: 0,
      totalTransactions: 0,
      totalStockoutDays: 0,
      stockoutStoresCount: 0,
      totalRecords: 0,
    };
  }

  let netSales = 0;
  let grossSales = 0;
  let targetSales = 0;
  let returnAmount = 0;
  let discountAmount = 0;
  let totalTransactions = 0;
  let stockoutDays = 0;
  const stockoutStoresSet = new Set<string>();

  records.forEach((r) => {
    netSales += r.net_sales || 0;
    grossSales += r.gross_sales || 0;
    targetSales += r.sales_target || 0;
    returnAmount += r.return_amount || 0;
    discountAmount += r.discount_amount || 0;
    totalTransactions += r.transaction_count || 0;
    stockoutDays += r.stockout_days || 0;
    if (r.stockout_days > 0) {
      stockoutStoresSet.add(r.store_id);
    }
  });

  const targetAchievementPct = targetSales > 0 ? (netSales / targetSales) * 100 : 0;
  const averageTransactionValue = totalTransactions > 0 ? netSales / totalTransactions : 0;

  // Formula validation option
  const returnDenominator = config.returnRateFormula === 'gross_sales' ? grossSales : netSales;
  const returnRatePct = returnDenominator > 0 ? (returnAmount / returnDenominator) * 100 : 0;

  const grossSalesBase = grossSales > 0 ? grossSales : netSales + discountAmount;
  const discountRatePct = grossSalesBase > 0 ? (discountAmount / grossSalesBase) * 100 : 0;

  return {
    netSales,
    grossSales,
    targetSales,
    targetAchievementPct,
    averageTransactionValue,
    returnRatePct,
    discountRatePct,
    totalReturnAmount: returnAmount,
    totalDiscountAmount: discountAmount,
    totalTransactions,
    totalStockoutDays: stockoutDays,
    stockoutStoresCount: stockoutStoresSet.size,
    totalRecords: records.length,
  };
}

export function calculateRegionPerformance(
  records: MergedSalesRecord[],
  config: FormulaConfig = DEFAULT_FORMULA_CONFIG
): RegionPerformance[] {
  const regionMap = new Map<
    string,
    {
      netSales: number;
      targetSales: number;
      returnAmount: number;
      stockoutDays: number;
      storeSet: Set<string>;
    }
  >();

  records.forEach((r) => {
    const reg = r.region || 'Unassigned';
    if (!regionMap.has(reg)) {
      regionMap.set(reg, {
        netSales: 0,
        targetSales: 0,
        returnAmount: 0,
        stockoutDays: 0,
        storeSet: new Set(),
      });
    }

    const item = regionMap.get(reg)!;
    item.netSales += r.net_sales || 0;
    item.targetSales += r.sales_target || 0;
    item.returnAmount += r.return_amount || 0;
    item.stockoutDays += r.stockout_days || 0;
    item.storeSet.add(r.store_id);
  });

  const result: RegionPerformance[] = [];
  regionMap.forEach((val, region) => {
    const achievementPct = val.targetSales > 0 ? (val.netSales / val.targetSales) * 100 : 0;
    const returnRatePct = val.netSales > 0 ? (val.returnAmount / val.netSales) * 100 : 0;
    result.push({
      region,
      netSales: val.netSales,
      targetSales: val.targetSales,
      achievementPct,
      returnAmount: val.returnAmount,
      returnRatePct,
      stockoutDays: val.stockoutDays,
      storeCount: val.storeSet.size,
    });
  });

  return result.sort((a, b) => b.netSales - a.netSales);
}

export function calculateCategoryPerformance(
  records: MergedSalesRecord[],
  config: FormulaConfig = DEFAULT_FORMULA_CONFIG
): CategoryPerformance[] {
  const catMap = new Map<
    string,
    {
      netSales: number;
      grossSales: number;
      returnAmount: number;
      discountAmount: number;
      stockoutDays: number;
      transactionCount: number;
    }
  >();

  records.forEach((r) => {
    const cat = r.category || 'General';
    if (!catMap.has(cat)) {
      catMap.set(cat, {
        netSales: 0,
        grossSales: 0,
        returnAmount: 0,
        discountAmount: 0,
        stockoutDays: 0,
        transactionCount: 0,
      });
    }

    const item = catMap.get(cat)!;
    item.netSales += r.net_sales || 0;
    item.grossSales += r.gross_sales || 0;
    item.returnAmount += r.return_amount || 0;
    item.discountAmount += r.discount_amount || 0;
    item.stockoutDays += r.stockout_days || 0;
    item.transactionCount += r.transaction_count || 0;
  });

  const result: CategoryPerformance[] = [];
  catMap.forEach((val, category) => {
    const returnDenominator = config.returnRateFormula === 'gross_sales' ? val.grossSales : val.netSales;
    const returnRatePct = returnDenominator > 0 ? (val.returnAmount / returnDenominator) * 100 : 0;
    const grossBase = val.grossSales > 0 ? val.grossSales : val.netSales + val.discountAmount;
    const discountRatePct = grossBase > 0 ? (val.discountAmount / grossBase) * 100 : 0;

    result.push({
      category,
      netSales: val.netSales,
      grossSales: val.grossSales,
      returnAmount: val.returnAmount,
      returnRatePct,
      discountRatePct,
      stockoutDays: val.stockoutDays,
      transactionCount: val.transactionCount,
    });
  });

  return result.sort((a, b) => b.netSales - a.netSales);
}

export function calculateStorePerformance(
  records: MergedSalesRecord[],
  config: FormulaConfig = DEFAULT_FORMULA_CONFIG
): StorePerformance[] {
  const storeMap = new Map<
    string,
    {
      storeName: string;
      region: string;
      city: string;
      format: string;
      managerName: string;
      netSales: number;
      targetSales: number;
      returnAmount: number;
      discountAmount: number;
      grossSales: number;
      stockoutDays: number;
      transactionCount: number;
    }
  >();

  records.forEach((r) => {
    const id = r.store_id;
    if (!storeMap.has(id)) {
      storeMap.set(id, {
        storeName: r.store_name || id,
        region: r.region || 'Unassigned',
        city: r.city || 'Unknown',
        format: r.format || 'Standard',
        managerName: r.manager_name || 'N/A',
        netSales: 0,
        targetSales: 0,
        returnAmount: 0,
        discountAmount: 0,
        grossSales: 0,
        stockoutDays: 0,
        transactionCount: 0,
      });
    }

    const item = storeMap.get(id)!;
    item.netSales += r.net_sales || 0;
    item.targetSales += r.sales_target || 0;
    item.returnAmount += r.return_amount || 0;
    item.discountAmount += r.discount_amount || 0;
    item.grossSales += r.gross_sales || 0;
    item.stockoutDays += r.stockout_days || 0;
    item.transactionCount += r.transaction_count || 0;
  });

  const result: StorePerformance[] = [];
  storeMap.forEach((val, storeId) => {
    const achievementPct = val.targetSales > 0 ? (val.netSales / val.targetSales) * 100 : 0;
    const returnRatePct = val.netSales > 0 ? (val.returnAmount / val.netSales) * 100 : 0;
    const grossBase = val.grossSales > 0 ? val.grossSales : val.netSales + val.discountAmount;
    const discountRatePct = grossBase > 0 ? (val.discountAmount / grossBase) * 100 : 0;
    const averageTransactionValue = val.transactionCount > 0 ? val.netSales / val.transactionCount : 0;

    let status: StorePerformance['status'] = 'on_track';
    if (achievementPct >= 105) {
      status = 'exceeding';
    } else if (achievementPct >= config.targetMetThreshold) {
      status = 'on_track';
    } else if (achievementPct >= 75) {
      status = 'lagging';
    } else {
      status = 'critical';
    }

    result.push({
      storeId,
      storeName: val.storeName,
      region: val.region,
      city: val.city,
      format: val.format,
      managerName: val.managerName,
      netSales: val.netSales,
      targetSales: val.targetSales,
      achievementPct,
      returnAmount: val.returnAmount,
      returnRatePct,
      discountRatePct,
      stockoutDays: val.stockoutDays,
      transactionCount: val.transactionCount,
      averageTransactionValue,
      status,
    });
  });

  return result.sort((a, b) => b.netSales - a.netSales);
}

export function calculateWeeklyTrends(records: MergedSalesRecord[]): WeeklyTrend[] {
  const weekMap = new Map<
    string,
    {
      date: string;
      netSales: number;
      targetSales: number;
      returnAmount: number;
      discountAmount: number;
      stockoutDays: number;
    }
  >();

  records.forEach((r) => {
    const wk = r.week || 'Week 1';
    if (!weekMap.has(wk)) {
      weekMap.set(wk, {
        date: r.date || '',
        netSales: 0,
        targetSales: 0,
        returnAmount: 0,
        discountAmount: 0,
        stockoutDays: 0,
      });
    }

    const item = weekMap.get(wk)!;
    item.netSales += r.net_sales || 0;
    item.targetSales += r.sales_target || 0;
    item.returnAmount += r.return_amount || 0;
    item.discountAmount += r.discount_amount || 0;
    item.stockoutDays += r.stockout_days || 0;
  });

  const result: WeeklyTrend[] = [];
  weekMap.forEach((val, week) => {
    const achievementPct = val.targetSales > 0 ? (val.netSales / val.targetSales) * 100 : 0;
    result.push({
      week,
      date: val.date,
      netSales: val.netSales,
      targetSales: val.targetSales,
      returnAmount: val.returnAmount,
      discountAmount: val.discountAmount,
      stockoutDays: val.stockoutDays,
      achievementPct,
    });
  });

  // Sort weeks numerically if possible (e.g. Week 1, Week 2...)
  return result.sort((a, b) => {
    const numA = parseInt(a.week.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.week.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });
}

export function generateBusinessInsights(
  records: MergedSalesRecord[],
  config: FormulaConfig = DEFAULT_FORMULA_CONFIG
): BusinessInsightItem[] {
  if (!records.length) return [];

  const insights: BusinessInsightItem[] = [];
  const regions = calculateRegionPerformance(records, config);
  const stores = calculateStorePerformance(records, config);
  const categories = calculateCategoryPerformance(records, config);

  // 1. Best Performing Region
  if (regions.length > 0) {
    const bestReg = regions[0];
    insights.push({
      id: 'ins-best-region',
      type: 'best_region',
      title: `Top Performing Region: ${bestReg.region}`,
      description: `${bestReg.region} generated $${bestReg.netSales.toLocaleString()} in net sales with a ${bestReg.achievementPct.toFixed(1)}% target achievement rate across ${bestReg.storeCount} stores.`,
      metric: `$${bestReg.netSales.toLocaleString()} (${bestReg.achievementPct.toFixed(1)}% target met)`,
      severity: 'success',
      region: bestReg.region,
      verified: false,
    });
  }

  // 2. Worst Performing Region
  if (regions.length > 1) {
    const worstReg = regions[regions.length - 1];
    insights.push({
      id: 'ins-worst-region',
      type: 'worst_region',
      title: `Region Needing Attention: ${worstReg.region}`,
      description: `${worstReg.region} logged the lowest target achievement at ${worstReg.achievementPct.toFixed(1)}% ($${worstReg.netSales.toLocaleString()} net sales, missing target by $${Math.max(0, worstReg.targetSales - worstReg.netSales).toLocaleString()}).`,
      metric: `${worstReg.achievementPct.toFixed(1)}% of target`,
      severity: 'danger',
      region: worstReg.region,
      verified: false,
    });
  }

  // 3. Stores Missing Targets
  const laggingStores = stores.filter((s) => s.achievementPct < config.targetMetThreshold);
  if (laggingStores.length > 0) {
    const worstStore = laggingStores.sort((a, b) => a.achievementPct - b.achievementPct)[0];
    insights.push({
      id: 'ins-target-miss',
      type: 'target_miss',
      title: `${laggingStores.length} Stores Missing Sales Target (<${config.targetMetThreshold}%)`,
      description: `Critical gap identified at ${worstStore.storeName} (${worstStore.city}) running at only ${worstStore.achievementPct.toFixed(1)}% target met. Managed by ${worstStore.managerName}.`,
      metric: `${laggingStores.length} stores underperforming`,
      severity: 'warning',
      storeId: worstStore.storeId,
      verified: false,
    });
  }

  // 4. Categories with High Return Rates
  const highReturnCats = categories.filter((c) => c.returnRatePct >= config.highReturnThresholdPct);
  if (highReturnCats.length > 0) {
    const topReturnCat = highReturnCats.sort((a, b) => b.returnRatePct - a.returnRatePct)[0];
    insights.push({
      id: 'ins-high-returns',
      type: 'high_returns',
      title: `Elevated Returns in ${topReturnCat.category}`,
      description: `${topReturnCat.category} recorded a return rate of ${topReturnCat.returnRatePct.toFixed(1)}% ($${topReturnCat.returnAmount.toLocaleString()} total returns), exceeding the ${config.highReturnThresholdPct}% benchmark.`,
      metric: `${topReturnCat.returnRatePct.toFixed(1)}% Return Rate`,
      severity: 'warning',
      category: topReturnCat.category,
      verified: false,
    });
  }

  // 5. Stockout Risk Indicator
  const stockoutProneStores = stores.filter((s) => s.stockoutDays >= config.stockoutRiskThresholdDays);
  if (stockoutProneStores.length > 0) {
    const topStockoutStore = stockoutProneStores.sort((a, b) => b.stockoutDays - a.stockoutDays)[0];
    insights.push({
      id: 'ins-stockout-risk',
      type: 'stockout_risk',
      title: `Stockout Bottleneck at ${topStockoutStore.storeName}`,
      description: `Logged ${topStockoutStore.stockoutDays} out-of-stock days across filtered period. Re-order lead times and supply chain distribution require urgent audit.`,
      metric: `${topStockoutStore.stockoutDays} Stockout Days`,
      severity: 'danger',
      storeId: topStockoutStore.storeId,
      verified: false,
    });
  }

  return insights;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '' : ''}${value.toFixed(1)}%`;
}
