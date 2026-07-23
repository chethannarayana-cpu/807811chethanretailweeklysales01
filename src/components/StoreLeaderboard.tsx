import React, { useState } from 'react';
import {
  Trophy,
  ArrowUpDown,
  Download,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { StorePerformance } from '../types/retail';
import { formatCurrency, formatPercent } from '../utils/analytics';
import { downloadExcelFile } from '../utils/sampleData';

interface StoreLeaderboardProps {
  stores: StorePerformance[];
}

export const StoreLeaderboard: React.FC<StoreLeaderboardProps> = ({ stores }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<keyof StorePerformance>('netSales');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key: keyof StorePerformance) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.managerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const sortedStores = [...filteredStores].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }

    const strA = String(valA || '').toLowerCase();
    const strB = String(valB || '').toLowerCase();
    return sortAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
  });

  const handleExportCSV = () => {
    const exportData = sortedStores.map((s, idx) => ({
      Rank: idx + 1,
      'Store ID': s.storeId,
      'Store Name': s.storeName,
      Region: s.region,
      City: s.city,
      Format: s.format,
      Manager: s.managerName,
      'Net Sales ($)': s.netSales,
      'Target Sales ($)': s.targetSales,
      'Target Met (%)': s.achievementPct.toFixed(1),
      'Return Rate (%)': s.returnRatePct.toFixed(1),
      'Stockout Days': s.stockoutDays,
      'Avg Transaction Value ($)': s.averageTransactionValue.toFixed(2),
      Status: s.status,
    }));

    downloadExcelFile(exportData, 'store_performance_leaderboard.xlsx', 'Leaderboard');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Store Performance Leaderboard</h3>
            <p className="text-xs text-slate-400">
              Stores ranked by sales achievement and target met metrics ({sortedStores.length} stores)
            </p>
          </div>
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                statusFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({stores.length})
            </button>
            <button
              onClick={() => setStatusFilter('exceeding')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                statusFilter === 'exceeding' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Exceeding
            </button>
            <button
              onClick={() => setStatusFilter('lagging')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                statusFilter === 'lagging' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lagging
            </button>
            <button
              onClick={() => setStatusFilter('critical')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                statusFilter === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Critical
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Export Leaderboard
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter store leaderboard..."
          className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3 w-12 text-center">Rank</th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('storeName')}>
                <div className="flex items-center space-x-1">
                  <span>Store Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('region')}>
                <div className="flex items-center space-x-1">
                  <span>Region / City</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('format')}>
                Format
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('netSales')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Net Sales</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('targetSales')}>
                Target
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('achievementPct')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Target Met %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('returnRatePct')}>
                Return %
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-white text-center" onClick={() => handleSort('stockoutDays')}>
                Stockouts
              </th>
              <th className="py-3 px-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {sortedStores.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  No stores match the selected filter query.
                </td>
              </tr>
            ) : (
              sortedStores.map((store, idx) => {
                return (
                  <tr key={store.storeId} className="hover:bg-slate-800/60 transition">
                    <td className="py-2.5 px-3 font-bold text-center text-slate-400">
                      {idx === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-xs border border-amber-500/30">
                          1
                        </span>
                      ) : idx === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 font-extrabold text-xs border border-slate-300/30">
                          2
                        </span>
                      ) : idx === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 font-extrabold text-xs border border-amber-700/30">
                          3
                        </span>
                      ) : (
                        idx + 1
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-semibold text-slate-100">
                      <div>{store.storeName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{store.storeId} • Mgr: {store.managerName}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-medium text-slate-200">{store.region}</span>
                      <span className="text-slate-400 block text-[10px]">{store.city}</span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                        {store.format}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 font-bold text-slate-100 text-right">
                      {formatCurrency(store.netSales)}
                    </td>

                    <td className="py-2.5 px-3 text-slate-400 text-right">
                      {formatCurrency(store.targetSales)}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`font-bold ${
                          store.achievementPct >= 100
                            ? 'text-emerald-400'
                            : store.achievementPct >= 90
                            ? 'text-blue-400'
                            : store.achievementPct >= 75
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {formatPercent(store.achievementPct)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={store.returnRatePct >= 5.0 ? 'text-amber-400 font-semibold' : 'text-slate-300'}
                      >
                        {formatPercent(store.returnRatePct)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      {store.stockoutDays > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                          {store.stockoutDays} days
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge status={store.status} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: StorePerformance['status'] }> = ({ status }) => {
  switch (status) {
    case 'exceeding':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
          <TrendingUp className="w-3 h-3 mr-1" /> Exceeding
        </span>
      );
    case 'on_track':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60">
          <CheckCircle className="w-3 h-3 mr-1" /> On Track
        </span>
      );
    case 'lagging':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
          <AlertTriangle className="w-3 h-3 mr-1" /> Lagging
        </span>
      );
    case 'critical':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
          <XCircle className="w-3 h-3 mr-1" /> Critical
        </span>
      );
  }
};
