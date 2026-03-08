import React from 'react';
import { Transaction } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#0ea5e9', // brand-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#84cc16', // lime-500
];

export const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  if (transactions.length === 0) return null;

  // Filter only spending (negative amounts)
  const spendingTransactions = transactions.filter(t => t.amount < 0);
  
  if (spendingTransactions.length === 0) return null;

  // Group by category
  const categoryDataMap = spendingTransactions.reduce((acc, t) => {
    const category = t.category || 'Uncategorized';
    const amount = Math.abs(t.amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryDataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value as number;
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
          <p className="text-sm font-bold text-slate-800">{payload[0].name}</p>
          <p className="text-sm text-brand-600 font-mono">
            ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full glass-card p-8"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Spending by Category</h3>
        <p className="text-sm text-slate-500">Breakdown of your expenses across different categories</p>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-xs font-medium text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
