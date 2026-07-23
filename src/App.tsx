import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FileUploadModal } from './components/FileUploadModal';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { ChartsSection } from './components/ChartsSection';
import { StoreLeaderboard } from './components/StoreLeaderboard';
import { BusinessInsightsSummary } from './components/BusinessInsightsSummary';
import { FormulaValidationModal } from './components/FormulaValidationModal';
import { AiAnalystDrawer } from './components/AiAnalystDrawer';
import { ShareModal } from './components/ShareModal';

import {
  DEFAULT_STORES,
  generateSampleWeeklySales,
  mergeSalesWithStoreMaster,
  downloadExcelFile,
} from './utils/sampleData';

import {
  WeeklySalesRow,
  StoreMasterRow,
  FilterState,
  FormulaConfig,
  BusinessInsightItem,
} from './types/retail';

import {
  DEFAULT_FORMULA_CONFIG,
  calculateDashboardKPIs,
  calculateRegionPerformance,
  calculateCategoryPerformance,
  calculateStorePerformance,
  calculateWeeklyTrends,
  generateBusinessInsights,
} from './utils/analytics';

export default function App() {
  // Raw Data State
  const [weeklySalesData, setWeeklySalesData] = useState<WeeklySalesRow[]>([]);
  const [storeMasterData, setStoreMasterData] = useState<StoreMasterRow[]>(DEFAULT_STORES);
  const [datasetLabel, setDatasetLabel] = useState<string>('Synthetic Default (8 Weeks)');

  // Formula Configuration State (Responsible AI)
  const [formulaConfig, setFormulaConfig] = useState<FormulaConfig>(DEFAULT_FORMULA_CONFIG);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    weeks: [],
    regions: [],
    cities: [],
    formats: [],
    categories: [],
    searchQuery: '',
  });

  // Modal / Drawer UI States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isAiAnalystOpen, setIsAiAnalystOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Verified Insights State (Responsible AI)
  const [verifiedInsightIds, setVerifiedInsightIds] = useState<Record<string, { verifiedBy: string; verifiedAt: string }>>({});

  // Initialize with sample synthetic dataset on boot
  useEffect(() => {
    const sampleWeekly = generateSampleWeeklySales();
    setWeeklySalesData(sampleWeekly);
  }, []);

  // Merged Records
  const mergedRecords = useMemo(() => {
    return mergeSalesWithStoreMaster(weeklySalesData, storeMasterData);
  }, [weeklySalesData, storeMasterData]);

  // Extract available filter options
  const availableWeeks = useMemo(() => {
    const set = new Set<string>();
    mergedRecords.forEach((r) => r.week && set.add(r.week));
    return Array.from(set).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    });
  }, [mergedRecords]);

  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    mergedRecords.forEach((r) => r.region && set.add(r.region));
    return Array.from(set).sort();
  }, [mergedRecords]);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    mergedRecords.forEach((r) => r.city && set.add(r.city));
    return Array.from(set).sort();
  }, [mergedRecords]);

  const availableFormats = useMemo(() => {
    const set = new Set<string>();
    mergedRecords.forEach((r) => r.format && set.add(r.format));
    return Array.from(set).sort();
  }, [mergedRecords]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    mergedRecords.forEach((r) => r.category && set.add(r.category));
    return Array.from(set).sort();
  }, [mergedRecords]);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return mergedRecords.filter((r) => {
      if (filters.weeks.length && !filters.weeks.includes(r.week)) return false;
      if (filters.regions.length && !filters.regions.includes(r.region)) return false;
      if (filters.cities.length && !filters.cities.includes(r.city)) return false;
      if (filters.formats.length && !filters.formats.includes(r.format)) return false;
      if (filters.categories.length && !filters.categories.includes(r.category)) return false;

      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = r.store_name?.toLowerCase().includes(q);
        const matchesCity = r.city?.toLowerCase().includes(q);
        const matchesProduct = r.product_name?.toLowerCase().includes(q);
        const matchesManager = r.manager_name?.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesProduct && !matchesManager) {
          return false;
        }
      }

      return true;
    });
  }, [mergedRecords, filters]);

  // Calculated Metrics
  const dashboardKpis = useMemo(() => {
    return calculateDashboardKPIs(filteredRecords, formulaConfig);
  }, [filteredRecords, formulaConfig]);

  const regionPerformance = useMemo(() => {
    return calculateRegionPerformance(filteredRecords, formulaConfig);
  }, [filteredRecords, formulaConfig]);

  const categoryPerformance = useMemo(() => {
    return calculateCategoryPerformance(filteredRecords, formulaConfig);
  }, [filteredRecords, formulaConfig]);

  const storePerformance = useMemo(() => {
    return calculateStorePerformance(filteredRecords, formulaConfig);
  }, [filteredRecords, formulaConfig]);

  const weeklyTrends = useMemo(() => {
    return calculateWeeklyTrends(filteredRecords);
  }, [filteredRecords]);

  // Raw generated insights
  const rawInsights = useMemo(() => {
    return generateBusinessInsights(filteredRecords, formulaConfig);
  }, [filteredRecords, formulaConfig]);

  // Merge verification state into insights
  const businessInsights: BusinessInsightItem[] = useMemo(() => {
    return rawInsights.map((ins) => {
      const v = verifiedInsightIds[ins.id];
      return {
        ...ins,
        verified: !!v,
        verifiedBy: v?.verifiedBy,
        verifiedAt: v?.verifiedAt,
      };
    });
  }, [rawInsights, verifiedInsightIds]);

  // Handlers
  const handleApplyUploadedData = (
    sales: WeeklySalesRow[],
    stores: StoreMasterRow[],
    datasetName: string
  ) => {
    setWeeklySalesData(sales);
    if (stores.length > 0) {
      setStoreMasterData(stores);
    }
    setDatasetLabel(datasetName);
    setFilters({
      weeks: [],
      regions: [],
      cities: [],
      formats: [],
      categories: [],
      searchQuery: '',
    });
  };

  const handleResetToSampleData = () => {
    const sampleWeekly = generateSampleWeeklySales();
    setWeeklySalesData(sampleWeekly);
    setStoreMasterData(DEFAULT_STORES);
    setDatasetLabel('Synthetic Default (8 Weeks)');
    setFilters({
      weeks: [],
      regions: [],
      cities: [],
      formats: [],
      categories: [],
      searchQuery: '',
    });
  };

  const handleDownloadTemplates = () => {
    // Generate retail_weekly_sales.xlsx
    const sampleWeekly = generateSampleWeeklySales();
    const exportWeekly = sampleWeekly.map((s) => ({
      'Week': s.week,
      'Date': s.date,
      'Store_ID': s.store_id,
      'Product_ID': s.product_id,
      'Product_Name': s.product_name,
      'Category': s.category,
      'Gross_Sales': s.gross_sales,
      'Discount_Amount': s.discount_amount,
      'Net_Sales': s.net_sales,
      'Return_Amount': s.return_amount,
      'Transaction_Count': s.transaction_count,
      'Sales_Target': s.sales_target,
      'Stockout_Days': s.stockout_days,
      'Inventory_Units': s.inventory_units,
    }));
    downloadExcelFile(exportWeekly, 'retail_weekly_sales.xlsx', 'Weekly Sales');

    // Generate store_master.xlsx
    const exportStores = DEFAULT_STORES.map((s) => ({
      'Store_ID': s.store_id,
      'Store_Name': s.store_name,
      'Region': s.region,
      'City': s.city,
      'Format': s.format,
      'Manager_Name': s.manager_name,
      'Target_Sales': s.target_sales,
    }));
    downloadExcelFile(exportStores, 'store_master.xlsx', 'Store Master');
  };

  const handleToggleVerifyInsight = (id: string) => {
    setVerifiedInsightIds((prev) => {
      const copy = { ...prev };
      if (copy[id]) {
        delete copy[id];
      } else {
        copy[id] = {
          verifiedBy: 'Senior BI Analyst',
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenFormula={() => setIsFormulaOpen(true)}
        onOpenAiAnalyst={() => setIsAiAnalystOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onResetData={handleResetToSampleData}
        onDownloadSamples={handleDownloadTemplates}
        activeDatasetLabel={datasetLabel}
        totalRecordCount={filteredRecords.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filter Controls */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          availableWeeks={availableWeeks}
          availableRegions={availableRegions}
          availableCities={availableCities}
          availableFormats={availableFormats}
          availableCategories={availableCategories}
          onReset={() =>
            setFilters({
              weeks: [],
              regions: [],
              cities: [],
              formats: [],
              categories: [],
              searchQuery: '',
            })
          }
        />

        {/* Dashboard KPIs Cards */}
        <KpiCards
          kpis={dashboardKpis}
          config={formulaConfig}
          onOpenFormulaModal={() => setIsFormulaOpen(true)}
        />

        {/* Business Insights Executive Summary */}
        <BusinessInsightsSummary
          insights={businessInsights}
          onToggleVerifyInsight={handleToggleVerifyInsight}
        />

        {/* Charts & Visualizations */}
        <ChartsSection
          weeklyTrends={weeklyTrends}
          regionPerformance={regionPerformance}
          categoryPerformance={categoryPerformance}
        />

        {/* Store Performance Leaderboard */}
        <StoreLeaderboard stores={storePerformance} />
      </main>

      {/* Modals & Drawers */}
      <FileUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onApplyUploadedData={handleApplyUploadedData}
        onLoadSampleData={handleResetToSampleData}
        onDownloadTemplates={handleDownloadTemplates}
      />

      <FormulaValidationModal
        isOpen={isFormulaOpen}
        onClose={() => setIsFormulaOpen(false)}
        config={formulaConfig}
        onChangeConfig={setFormulaConfig}
      />

      <AiAnalystDrawer
        isOpen={isAiAnalystOpen}
        onClose={() => setIsAiAnalystOpen(false)}
        kpis={dashboardKpis}
        regions={regionPerformance}
        categories={categoryPerformance}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        activeDatasetLabel={datasetLabel}
      />
    </div>
  );
}
