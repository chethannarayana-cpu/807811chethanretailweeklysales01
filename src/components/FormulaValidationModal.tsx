import React from 'react';
import { X, ShieldCheck, Calculator, Check, RotateCcw } from 'lucide-react';
import { FormulaConfig } from '../types/retail';
import { DEFAULT_FORMULA_CONFIG } from '../utils/analytics';

interface FormulaValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FormulaConfig;
  onChangeConfig: (newConfig: FormulaConfig) => void;
}

export const FormulaValidationModal: React.FC<FormulaValidationModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-100 relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-100">Formula & Calculation Audit</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60">
                  Responsible AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audit and customize KPI logic & insight thresholds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formula Controls */}
        <div className="space-y-4">
          {/* Formula 1: Return Rate Denominator */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              Return Rate Calculation Formula
            </label>
            <p className="text-[11px] text-slate-400">
              Choose the baseline denominator for Return Rate % calculation
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onChangeConfig({ ...config, returnRateFormula: 'net_sales' })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between transition ${
                  config.returnRateFormula === 'net_sales'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <span>Return / Net Sales</span>
                {config.returnRateFormula === 'net_sales' && <Check className="w-4 h-4 text-white" />}
              </button>

              <button
                onClick={() => onChangeConfig({ ...config, returnRateFormula: 'gross_sales' })}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center justify-between transition ${
                  config.returnRateFormula === 'gross_sales'
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <span>Return / Gross Sales</span>
                {config.returnRateFormula === 'gross_sales' && <Check className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>

          {/* Formula 2: Target Met Threshold */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Target Achievement Benchmark (%)</span>
              <span className="font-mono text-blue-400 font-bold">{config.targetMetThreshold}%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Stores below this % are flagged as lagging in business insights
            </p>
            <input
              type="range"
              min={70}
              max={100}
              step={1}
              value={config.targetMetThreshold}
              onChange={(e) => onChangeConfig({ ...config, targetMetThreshold: Number(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Formula 3: High Return Rate Threshold */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">High Return Alert Threshold (%)</span>
              <span className="font-mono text-amber-400 font-bold">{config.highReturnThresholdPct}%</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Categories exceeding this return % generate high-return risk warnings
            </p>
            <input
              type="range"
              min={2.0}
              max={12.0}
              step={0.5}
              value={config.highReturnThresholdPct}
              onChange={(e) => onChangeConfig({ ...config, highReturnThresholdPct: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Formula 4: Stockout Risk Threshold Days */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Stockout Risk Threshold (Days)</span>
              <span className="font-mono text-rose-400 font-bold">{config.stockoutRiskThresholdDays} Days</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Stores with stockout duration equal or higher are flagged as critical risk
            </p>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={config.stockoutRiskThresholdDays}
              onChange={(e) => onChangeConfig({ ...config, stockoutRiskThresholdDays: Number(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onChangeConfig(DEFAULT_FORMULA_CONFIG)}
            className="text-xs text-slate-400 hover:text-amber-400 flex items-center transition"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            Done Auditing
          </button>
        </div>
      </div>
    </div>
  );
};
