import React from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FINANCIAL_TIPS = [
  "Track every expense, no matter how small. Awareness is the first step to control.",
  "Follow the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
  "Build an emergency fund that covers 3-6 months of your essential living expenses.",
  "Pay yourself first. Automate a portion of your income to savings as soon as you get paid.",
  "Wait 24 hours before making a non-essential purchase to avoid impulse buying.",
  "Review your subscriptions monthly. Cancel anything you haven't used in the last 30 days.",
  "Use cash or debit instead of credit for daily purchases to stay within your actual budget.",
  "Set clear, specific financial goals (e.g., 'Save $5,000 for a house deposit by December').",
  "Cook at home more often. Dining out is often one of the largest 'hidden' expenses.",
  "Understand the difference between a 'need' and a 'want' before every transaction.",
  "Avoid lifestyle creep. When your income increases, keep your expenses the same and save the difference.",
  "Invest in your financial education. The more you know, the better your decisions will be."
];

interface FinancialTipProps {
  tip: string | null;
  onRefresh: () => void;
}

export const FinancialTip: React.FC<FinancialTipProps> = ({ tip, onRefresh }) => {
  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="glass-card p-6 border-brand-100 bg-brand-50/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Lightbulb className="w-16 h-16 text-brand-600" />
        </div>
        
        <div className="flex items-start gap-4 relative z-10">
          <div className="bg-brand-600 p-2 rounded-lg text-white shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-brand-900 uppercase tracking-wider">Financial Discipline Tip</h4>
              <button 
                onClick={onRefresh}
                className="p-1 hover:bg-brand-100 rounded-md transition-colors text-brand-600"
                title="Get another tip"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={tip}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="text-slate-700 leading-relaxed font-medium italic"
              >
                "{tip}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
