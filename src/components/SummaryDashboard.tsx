import React from 'react';
import { Transaction } from '../services/geminiService';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Hash, Scale } from 'lucide-react';

interface SummaryDashboardProps {
  transactions: Transaction[];
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ transactions }) => {
  if (transactions.length === 0) return null;

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpending = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalIncome - totalSpending;
  const recordCount = transactions.length;

  const stats = [
    {
      label: 'Total Records',
      value: recordCount,
      icon: <Hash className="w-5 h-5" />,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200'
    },
    {
      label: 'Total Income',
      value: `$${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    {
      label: 'Total Spending',
      value: `$${totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100'
    },
    {
      label: 'Net Balance',
      value: `$${netBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <Scale className="w-5 h-5" />,
      color: netBalance >= 0 ? 'text-brand-600' : 'text-rose-700',
      bgColor: netBalance >= 0 ? 'bg-brand-50' : 'bg-rose-50',
      borderColor: netBalance >= 0 ? 'border-brand-100' : 'border-rose-100'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`glass-card p-6 border ${stat.borderColor} flex flex-col gap-3`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {stat.label}
            </span>
            <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
          <div className={`text-2xl font-bold tracking-tight ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </motion.div>
  );
};
