import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, RefreshCw } from 'lucide-react';
import { DashboardKPIs, RegionPerformance, CategoryPerformance } from '../types/retail';

interface AiAnalystDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: DashboardKPIs;
  regions: RegionPerformance[];
  categories: CategoryPerformance[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export const AiAnalystDrawer: React.FC<AiAnalystDrawerProps> = ({
  isOpen,
  onClose,
  kpis,
  regions,
  categories,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: "Hello! I am your AI Retail Analyst powered by Gemini. Ask me about regional sales trends, store performance gaps, return rate mitigation, or stockout recommendations.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const summaryData = {
        totalNetSales: kpis.netSales,
        targetAchievementPct: kpis.targetAchievementPct,
        averageTransactionValue: kpis.averageTransactionValue,
        returnRatePct: kpis.returnRatePct,
        totalStockoutDays: kpis.totalStockoutDays,
        topRegion: regions[0]?.region || 'N/A',
        lowestRegion: regions[regions.length - 1]?.region || 'N/A',
        topCategory: categories[0]?.category || 'N/A',
      };

      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryData, question: textToSend }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.response || 'Sorry, I could not process that query.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ast-err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to connect to AI server. Please check network connection.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Gemini AI Retail Analyst</h3>
            <p className="text-[11px] text-slate-400">Natural language data Q&A</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSendQuery('Why is return rate elevated in Apparel?')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 shrink-0"
        >
          Apparel Returns
        </button>
        <button
          onClick={() => handleSendQuery('How to improve target achievement in South region?')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 shrink-0"
        >
          South Region Strategy
        </button>
        <button
          onClick={() => handleSendQuery('What are top actions to resolve store stockouts?')}
          className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 shrink-0"
        >
          Stockout Actions
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : ''}`}
          >
            {m.sender === 'assistant' && (
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>
              <div className="mt-1 text-[9px] text-right opacity-60">{m.time}</div>
            </div>

            {m.sender === 'user' && (
              <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-400 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Gemini AI is analyzing dataset metrics...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Gemini AI a question..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
