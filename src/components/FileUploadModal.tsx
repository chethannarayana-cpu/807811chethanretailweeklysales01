import React, { useState } from 'react';
import {
  X,
  Upload,
  FileCheck,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { parseWeeklySalesExcel, parseStoreMasterExcel, ParseResult } from '../utils/excelParser';
import { WeeklySalesRow, StoreMasterRow } from '../types/retail';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyUploadedData: (sales: WeeklySalesRow[], stores: StoreMasterRow[], datasetName: string) => void;
  onLoadSampleData: () => void;
  onDownloadTemplates: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyUploadedData,
  onLoadSampleData,
  onDownloadTemplates,
}) => {
  const [salesFile, setSalesFile] = useState<File | null>(null);
  const [storeFile, setStoreFile] = useState<File | null>(null);

  const [salesParseResult, setSalesParseResult] = useState<ParseResult<WeeklySalesRow> | null>(null);
  const [storeParseResult, setStoreParseResult] = useState<ParseResult<StoreMasterRow> | null>(null);

  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingStore, setLoadingStore] = useState(false);

  if (!isOpen) return null;

  const handleSalesFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSalesFile(file);
    setLoadingSales(true);
    const res = await parseWeeklySalesExcel(file);
    setSalesParseResult(res);
    setLoadingSales(false);
  };

  const handleStoreFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStoreFile(file);
    setLoadingStore(true);
    const res = await parseStoreMasterExcel(file);
    setStoreParseResult(res);
    setLoadingStore(false);
  };

  const handleConfirmUpload = () => {
    if (salesParseResult?.data.length) {
      const stores = storeParseResult?.data.length ? storeParseResult.data : [];
      const datasetName = salesFile?.name || 'Uploaded Dataset';
      onApplyUploadedData(salesParseResult.data, stores, datasetName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/30">
              <Upload className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Upload Dataset Files</h2>
              <p className="text-xs text-slate-400">
                Upload <strong>retail_weekly_sales.xlsx</strong> and <strong>store_master.xlsx</strong> (.xlsx, .xls, .csv)
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

        {/* Quick sample option banner */}
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs text-slate-200">Don't have files ready? Test immediately with synthetic sample data.</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownloadTemplates}
              className="px-2.5 py-1 text-xs font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition flex items-center"
            >
              <Download className="w-3 h-3 mr-1" /> Templates
            </button>
            <button
              onClick={() => {
                onLoadSampleData();
                onClose();
              }}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
            >
              Load Sample
            </button>
          </div>
        </div>

        {/* File Upload Inputs */}
        <div className="mt-6 space-y-4">
          {/* File 1: retail_weekly_sales.xlsx */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 mr-2" />
                1. Main Dataset: <span className="text-blue-400 font-mono ml-1">retail_weekly_sales.xlsx</span> *
              </label>
              {salesParseResult?.success && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {salesParseResult.data.length} rows parsed
                </span>
              )}
            </div>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleSalesFileChange}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />

            {loadingSales && <p className="text-xs text-blue-400 animate-pulse">Parsing weekly sales file...</p>}

            {salesParseResult?.errors.length ? (
              <div className="p-2.5 bg-rose-950/50 border border-rose-800/60 rounded-lg text-xs text-rose-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <p className="font-semibold">Parsing Error:</p>
                  <ul className="list-disc list-inside">
                    {salesParseResult.errors.map((e, idx) => (
                      <li key={idx}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>

          {/* File 2: store_master.xlsx */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400 mr-2" />
                2. Store Reference: <span className="text-indigo-300 font-mono ml-1">store_master.xlsx</span> (Optional)
              </label>
              {storeParseResult?.success && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {storeParseResult.data.length} stores mapped
                </span>
              )}
            </div>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleStoreFileChange}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />

            {loadingStore && <p className="text-xs text-indigo-400 animate-pulse">Parsing store master file...</p>}

            {storeParseResult?.errors.length ? (
              <div className="p-2.5 bg-rose-950/50 border border-rose-800/60 rounded-lg text-xs text-rose-300">
                {storeParseResult.errors.join(', ')}
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            disabled={!salesParseResult?.success}
            onClick={handleConfirmUpload}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-lg shadow-blue-600/30 transition flex items-center"
          >
            <FileCheck className="w-4 h-4 mr-1.5" />
            Apply Data to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
