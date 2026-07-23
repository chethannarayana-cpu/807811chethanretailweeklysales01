import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ComposedChart,
} from 'recharts';
import { WeeklyTrend, RegionPerformance, CategoryPerformance } from '../types/retail';
import { formatCurrency, formatPercent } from '../utils/analytics';
import { TrendingUp, BarChart3, PieChart, AlertCircle } from 'lucide-react';

interface ChartsSectionProps {
  weeklyTrends: WeeklyTrend[];
  regionPerformance: RegionPerformance[];
  categoryPerformance: CategoryPerformance[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({
  weeklyTrends,
  regionPerformance,
  categoryPerformance,
}) => {
  const [trendMetric, setTrendMetric] = useState<'sales' | 'returns' | 'stockout'>('sales');

  const regionColors: Record<string, string> = {
    North: '#3b82f6', // blue
    South: '#e11d48', // rose
    East: '#10b981', // emerald
    West: '#8b5cf6', // purple
    Central: '#f59e0b', // amber
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Weekly Sales Trend Line Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600/20 p-2 rounded-xl text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Weekly Sales & Target Trend</h3>
              <p className="text-[11px] text-slate-400">Net Sales performance against Target over time</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setTrendMetric('sales')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                trendMetric === 'sales'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Net Sales
            </button>
            <button
              onClick={() => setTrendMetric('returns')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                trendMetric === 'returns'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Returns
            </button>
            <button
              onClick={() => setTrendMetric('stockout')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                trendMetric === 'stockout'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Stockout Days
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) =>
                  trendMetric === 'stockout' ? `${val}d` : `$${(val / 1000).toFixed(0)}k`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [
                  trendMetric === 'stockout'
                    ? `${value} Days`
                    : formatCurrency(Number(value)),
                  name === 'netSales'
                    ? 'Net Sales'
                    : name === 'targetSales'
                    ? 'Target'
                    : name === 'returnAmount'
                    ? 'Returns'
                    : 'Stockout Days',
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {trendMetric === 'sales' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="netSales"
                    name="Net Sales"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="targetSales"
                    name="Sales Target"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </>
              )}

              {trendMetric === 'returns' && (
                <Line
                  type="monotone"
                  dataKey="returnAmount"
                  name="Return Amount"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f59e0b' }}
                />
              )}

              {trendMetric === 'stockout' && (
                <Line
                  type="monotone"
                  dataKey="stockoutDays"
                  name="Stockout Days"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f43f5e' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Sales by Region Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-600/20 p-2 rounded-xl text-emerald-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Sales & Target Met by Region</h3>
              <p className="text-[11px] text-slate-400">Regional sales breakdown and target achievement %</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="region" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [
                  name === 'netSales' || name === 'targetSales'
                    ? formatCurrency(Number(value))
                    : `${value}%`,
                  name === 'netSales'
                    ? 'Net Sales'
                    : name === 'targetSales'
                    ? 'Sales Target'
                    : 'Target Met %',
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="netSales" name="Net Sales" radius={[6, 6, 0, 0]}>
                {regionPerformance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={regionColors[entry.region] || '#3b82f6'}
                  />
                ))}
              </Bar>
              <Bar dataKey="targetSales" name="Target" fill="#334155" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Category Performance & Return Rate */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600/20 p-2 rounded-xl text-purple-400">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Category Sales & Return Rate %</h3>
              <p className="text-[11px] text-slate-400">Product categories ranked by sales volume vs return rate</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={categoryPerformance}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                type="number"
                stroke="#94a3b8"
                fontSize={11}
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
              />
              <YAxis
                dataKey="category"
                type="category"
                stroke="#94a3b8"
                fontSize={10}
                width={120}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any) => [
                  name === 'netSales'
                    ? formatCurrency(Number(value))
                    : `${Number(value).toFixed(1)}%`,
                  name === 'netSales' ? 'Net Sales' : 'Return Rate %',
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="netSales" name="Net Sales" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Stockout Risk Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <div className="bg-rose-600/20 p-2 rounded-xl text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Stockout Risk by Category</h3>
              <p className="text-[11px] text-slate-400">Cumulative stockout days per product category</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} interval={0} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => `${val} days`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(value: any) => [`${value} Stockout Days`, 'Stockout Duration']}
              />
              <Bar dataKey="stockoutDays" name="Stockout Days" fill="#f43f5e" radius={[6, 6, 0, 0]}>
                {categoryPerformance.map((entry, idx) => (
                  <Cell
                    key={`stockout-cell-${idx}`}
                    fill={entry.stockoutDays > 5 ? '#f43f5e' : '#fb7185'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
