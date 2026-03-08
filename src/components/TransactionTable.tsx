import React from 'react';
import { Transaction } from '../services/geminiService';
import { Download, ArrowUpRight, ArrowDownLeft, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface TransactionTableProps {
  transactions: Transaction[];
  onDownload?: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDownload }) => {
  const downloadCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Category', 'Notes'];
    const rows = transactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.category,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `statement_extraction_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onDownload) onDownload();
  };

  if (transactions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Extracted Transactions</h2>
          <p className="text-sm text-slate-500">{transactions.length} entries found</p>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-semibold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 active:scale-95"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t, i) => (
                <tr key={i} className="data-table-row">
                  <td className="px-6 py-4 text-sm font-mono text-slate-600 whitespace-nowrap">
                    {t.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                    <span className={t.amount >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                      <span className="flex items-center justify-end gap-1">
                        {t.amount >= 0 ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      <Tag className="w-3 h-3" />
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 italic max-w-xs truncate">
                    {t.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
