import { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { TransactionTable } from './components/TransactionTable';
import { SummaryDashboard } from './components/SummaryDashboard';
import { CategoryChart } from './components/CategoryChart';
import { Transaction, extractTransactions } from './services/geminiService';
import { Wallet, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ total: number; completed: number; pending: number; currentFile?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelect = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setTransactions([]);
    setProgress({ total: files.length, completed: 0, pending: files.length });

    const allTransactions: Transaction[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(prev => prev ? { ...prev, currentFile: file.name, pending: files.length - i } : null);

        const fileData = await new Promise<{ base64: string; mimeType: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve({ base64, mimeType: file.type });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Process each file individually to show progress
        const results = await extractTransactions([fileData]);
        allTransactions.push(...results);

        setProgress(prev => prev ? { ...prev, completed: i + 1, pending: files.length - (i + 1) } : null);
      }

      setTransactions(allTransactions);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during extraction.");
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-100 selection:text-brand-700">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-600 p-2 rounded-xl text-white shadow-lg shadow-brand-600/20">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Statement<span className="text-brand-600">Lens</span>
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure OCR
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Gemini Powered
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-12">
          {/* Hero Section */}
          <div className="text-center max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4"
            >
              Turn Bank Statements into <span className="text-brand-600">Clean Data</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 leading-relaxed"
            >
              Upload your PDF or image statements. Our AI extracts every transaction, 
              categorizes them, and prepares a CSV for your accounting.
            </motion.p>
          </div>

          {/* Uploader */}
          <FileUploader 
            onFilesSelect={handleFilesSelect} 
            isProcessing={isProcessing} 
            progress={progress}
            error={error}
          />

          {/* Results Summary Dashboard */}
          <SummaryDashboard transactions={transactions} />

          {/* Visualization Section */}
          <div className="w-full grid grid-cols-1 gap-8">
            <CategoryChart transactions={transactions} />
          </div>

          {/* Results Table */}
          <TransactionTable transactions={transactions} />

          {/* Features Grid (Only show when no results) */}
          {transactions.length === 0 && !isProcessing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
              {[
                {
                  title: "Multi-Page Support",
                  desc: "Handles complex, multi-page PDF statements with ease.",
                  icon: <Zap className="w-6 h-6" />
                },
                {
                  title: "Smart Categorization",
                  desc: "Automatically detects spending categories like Groceries or Bills.",
                  icon: <ShieldCheck className="w-6 h-6" />
                },
                {
                  title: "Clean Export",
                  desc: "Get a standardized CSV ready for Excel, Sheets, or QuickBooks.",
                  icon: <Wallet className="w-6 h-6" />
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} StatementLens OCR. Powered by Gemini 2.0 Flash.</p>
        </div>
      </footer>
    </div>
  );
}
