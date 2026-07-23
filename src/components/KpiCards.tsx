import React from 'react';
import {
  DollarSign,
  Target,
  ShoppingBag,
  RotateCcw,
  Tag,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { DashboardKPIs, FormulaConfig } from '../types/retail';
import { formatCurrency, formatPercent } from '../utils/analytics';

interface KpiCardsProps {
  kpis: DashboardKPIs;
  config: FormulaConfig;
  onOpenFormulaModal: () => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ kpis, config, onOpenFormulaModal }) => {
  const isTargetAchieved = kpis.targetAchievementPct >= config.targetMetThreshold;
  const isReturnHigh = kpis.returnRatePct >= config.highReturnThresholdPct;
  const isStockoutAlert = kpis.stockoutStoresCount > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* KPI 1: Net Sales */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Net Sales</span>
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl font-bold text-slate-100 tracking-tight">
            {formatCurrency(kpis.netSales)}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400">
            <span>Target: {formatCurrency(kpis.targetSales)}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Gross: {formatCurrency(kpis.grossSales)}</span>
          <button
            onClick={onOpenFormulaModal}
            className="hover:text-blue-400 flex items-center transition"
            title="Formula: Gross Sales - Discount Amount"
          >
            <HelpCircle className="w-3 h-3 mr-0.5 text-slate-400" /> Audit
          </button>
        </div>
      </div>

      {/* KPI 2: Target Achievement */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Target Achievement</span>
          <div
            className={`p-2 rounded-xl border ${
              isTargetAchieved
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            <Target className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <span
              className={`text-xl font-bold tracking-tight ${
                isTargetAchieved ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatPercent(kpis.targetAchievementPct)}
            </span>
            {isTargetAchieved ? (
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-400" />
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isTargetAchieved ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, kpis.targetAchievementPct))}%` }}
            />
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Threshold: {config.targetMetThreshold}%</span>
          <button
            onClick={onOpenFormulaModal}
            className="hover:text-blue-400 flex items-center transition"
            title="Formula: (Net Sales / Target Sales) * 100"
          >
            <HelpCircle className="w-3 h-3 mr-0.5 text-slate-400" /> Audit
          </button>
        </div>
      </div>

      {/* KPI 3: Average Transaction Value */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Avg Transaction Value</span>
          <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 text-blue-400">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl font-bold text-slate-100 tracking-tight">
            ${kpis.averageTransactionValue.toFixed(2)}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400">
            <span>Transactions: {kpis.totalTransactions.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>ATV = Net Sales / Orders</span>
          <button
            onClick={onOpenFormulaModal}
            className="hover:text-blue-400 flex items-center transition"
            title="Formula: Net Sales / Total Transaction Count"
          >
            <HelpCircle className="w-3 h-3 mr-0.5 text-slate-400" /> Audit
          </button>
        </div>
      </div>

      {/* KPI 4: Return Rate */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Return Rate</span>
          <div
            className={`p-2 rounded-xl border ${
              isReturnHigh
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`text-xl font-bold tracking-tight ${
              isReturnHigh ? 'text-amber-400' : 'text-slate-100'
            }`}
          >
            {formatPercent(kpis.returnRatePct)}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400">
            <span>Returns: {formatCurrency(kpis.totalReturnAmount)}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Base: {config.returnRateFormula === 'gross_sales' ? 'Gross' : 'Net'} Sales</span>
          <button
            onClick={onOpenFormulaModal}
            className="hover:text-blue-400 flex items-center transition"
            title="Formula: (Return Amount / Net Sales) * 100"
          >
            <HelpCircle className="w-3 h-3 mr-0.5 text-slate-400" /> Audit
          </button>
        </div>
      </div>

      {/* KPI 5: Discount Rate */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Discount Rate</span>
          <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Tag className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl font-bold text-slate-100 tracking-tight">
            {formatPercent(kpis.discountRatePct)}
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400">
            <span>Total Discounts: {formatCurrency(kpis.totalDiscountAmount)}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Discounts / Gross Sales</span>
          <button
            onClick={onOpenFormulaModal}
            className="hover:text-blue-400 flex items-center transition"
            title="Formula: (Discount Amount / Gross Sales) * 100"
          >
            <HelpCircle className="w-3 h-3 mr-0.5 text-slate-400" /> Audit
          </button>
        </div>
      </div>

      {/* KPI 6: Stockout Indicators */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm relative group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Stockout Alerts</span>
          <div
            className={`p-2 rounded-xl border ${
              isStockoutAlert
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div
            className={`text-xl font-bold tracking-tight ${
              isStockoutAlert ? 'text-rose-400' : 'text-slate-100'
            }`}
          >
            {kpis.totalStockoutDays} Days
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-400">
            <span>Affected Stores: {kpis.stockoutStoresCount}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Out of Stock Events</span>
          <button
            onClick={onOpenFormulaModal}
            className="hover:text-blue-400 flex items-center transition"
            title="Formula: Sum of Stockout Days across products/stores"
          >
            <HelpCircle className="w-3 h-3 mr-0.5 text-slate-400" /> Audit
          </button>
        </div>
      </div>
    </div>
  );
};
