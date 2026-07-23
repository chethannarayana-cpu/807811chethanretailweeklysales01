import React from 'react';
import {
  TrendingUp,
  Upload,
  Download,
  Calculator,
  Share2,
  Sparkles,
  RefreshCw,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenFormula: () => void;
  onOpenAiAnalyst: () => void;
  onOpenShare: () => void;
  onResetData: () => void;
  onDownloadSamples: () => void;
  activeDatasetLabel: string;
  totalRecordCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenFormula,
  onOpenAiAnalyst,
  onOpenShare,
  onResetData,
  onDownloadSamples,
  activeDatasetLabel,
  totalRecordCount,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100">
                  Retail Sales Intelligence
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Human-in-Loop AI
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center space-x-2">
                <span>Dataset: <strong className="text-slate-200 font-medium">{activeDatasetLabel}</strong> ({totalRecordCount} records)</span>
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onDownloadSamples}
              className="hidden lg:inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Download synthetic retail_weekly_sales.xlsx & store_master.xlsx templates"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Excel Templates
            </button>

            <button
              onClick={onOpenUpload}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload Files
            </button>

            <button
              onClick={onOpenFormula}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
              title="Formula & Calculation Validator"
            >
              <Calculator className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Formula Audit
            </button>

            <button
              onClick={onOpenAiAnalyst}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 transition"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-400 animate-pulse" />
              AI Analyst
            </button>

            <button
              onClick={onOpenShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Generate Shareable Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onResetData}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
              title="Reload Default Synthetic Dataset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
