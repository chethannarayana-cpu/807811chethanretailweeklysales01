import React, { useState } from 'react';
import { X, Share2, Copy, Check, Globe } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDatasetLabel: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, activeDatasetLabel }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-100 relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2.5 rounded-xl border border-blue-500/30 text-blue-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Share App & Dashboard State</h2>
              <p className="text-xs text-slate-400">Generate demo URL link for stakeholder presentation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1">
            <span className="text-slate-400">Active Dataset Context:</span>
            <div className="font-semibold text-slate-200 flex items-center">
              <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> {activeDatasetLabel}
            </div>
          </div>

          <label className="text-xs font-semibold text-slate-300 block">Shareable Application Link</label>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none font-mono"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-emerald-300" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
