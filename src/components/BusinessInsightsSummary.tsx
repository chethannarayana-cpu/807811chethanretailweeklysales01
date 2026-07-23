import React, { useState } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  Download,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { BusinessInsightItem } from '../types/retail';

interface BusinessInsightsSummaryProps {
  insights: BusinessInsightItem[];
  onToggleVerifyInsight: (id: string) => void;
  userEmail?: string;
}

export const BusinessInsightsSummary: React.FC<BusinessInsightsSummaryProps> = ({
  insights,
  onToggleVerifyInsight,
  userEmail = 'Analyst / Manager',
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const verifiedCount = insights.filter((i) => i.verified).length;

  const handleExportInsightsBrief = () => {
    const textContent = `================================================
RETAIL SALES INTELLIGENCE - EXECUTIVE BRIEFING
Generated: ${new Date().toLocaleDateString()}
Audit Status: ${verifiedCount} of ${insights.length} Insights Human-Verified
================================================

1. BUSINESS INSIGHTS SUMMARY:
${insights
  .map(
    (ins, idx) => `
[${idx + 1}] ${ins.title.toUpperCase()}
Metric: ${ins.metric}
Details: ${ins.description}
Human Verification Status: ${ins.verified ? `VERIFIED by ${ins.verifiedBy || userEmail} at ${ins.verifiedAt}` : 'PENDING HUMAN VALIDATION'}
`
  )
  .join('\n')}

================================================
Calculations performed under Responsible AI Human-in-the-loop Protocol.
================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'retail_business_insights_briefing.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-amber-500 to-indigo-600 p-2.5 rounded-xl shadow-md text-white">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-100">Automated Business Insights</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> Human-in-the-Loop Validation
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Algorithmic highlights for regions, store targets, return rates, and stockouts ({verifiedCount}/{insights.length} audited)
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExportInsightsBrief}
          className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" /> Export Executive Brief
        </button>
      </div>

      {/* Insight List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item) => {
          const isVerified = item.verified;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition relative flex flex-col justify-between ${
                item.severity === 'success'
                  ? 'bg-emerald-950/20 border-emerald-800/40'
                  : item.severity === 'danger'
                  ? 'bg-rose-950/20 border-rose-800/40'
                  : item.severity === 'warning'
                  ? 'bg-amber-950/20 border-amber-800/40'
                  : 'bg-blue-950/20 border-blue-800/40'
              }`}
            >
              <div>
                {/* Header Icon + Title */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    {item.severity === 'success' && <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {item.severity === 'danger' && <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />}
                    {item.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                    {item.severity === 'info' && <RotateCcw className="w-4 h-4 text-blue-400 shrink-0" />}
                    <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 shrink-0">
                    {item.metric}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>

              {/* Responsible AI Verification Toggle Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {isVerified ? (
                      <span className="text-emerald-400 font-semibold">
                        Verified by {item.verifiedBy || 'Analyst'} at {item.verifiedAt}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Requires human validation</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={() => onToggleVerifyInsight(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center transition ${
                    isVerified
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 mr-1 ${isVerified ? 'text-white' : 'text-slate-400'}`} />
                  {isVerified ? 'Verified' : 'Verify & Sign-off'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
