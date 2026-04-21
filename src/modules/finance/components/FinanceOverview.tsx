import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useFinanceOverview } from '../hooks/useFinanceOverview';
import { cn } from '@/lib/utils';

export const FinanceOverview = () => {
  const { overview, isLoading } = useFinanceOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const metrics = [
    { label: 'Total Revenue', value: `$${overview.revenue.toLocaleString()}`, change: '+12.5%', type: 'up', icon: TrendingUp, color: 'emerald' },
    { label: 'Total Expenses', value: `$${overview.expenses.toLocaleString()}`, change: '+2.4%', type: 'up', icon: TrendingDown, color: 'rose' },
    { label: 'Net Profit', value: `$${overview.netProfit.toLocaleString()}`, change: '+18.2%', type: 'up', icon: DollarSign, color: 'indigo' },
    { label: 'Receivables', value: `$${overview.receivables.toLocaleString()}`, change: '-5.1%', type: 'down', icon: Layers, color: 'amber' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Financial Intelligence</h1>
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Real-time Fiscal Telemetry & Institutional Liquidity Hub</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm group hover:border-indigo-600/40 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "p-3 rounded-xl",
                m.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                m.color === 'rose' ? "bg-rose-50 text-rose-600" :
                m.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                "bg-amber-50 text-amber-600"
              )}>
                <m.icon size={20} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full",
                m.type === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {m.type === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {m.change}
              </div>
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{m.label}</p>
            <h3 className="text-2xl font-bold mt-1 text-text-main tabular-nums tracking-tighter">{m.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-theme shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border-theme flex justify-between items-center bg-bg/20">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              Unified Transaction Stream
            </h3>
            <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
               System Audit
               <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-bg/50 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                  <th className="px-8 py-5">Entity / Beneficiary</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Sync Date</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-theme">
                {overview.recentTransactions.map((tx: any, i: number) => (
                  <tr key={i} className="hover:bg-indigo-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-bg border border-border-theme text-text-muted rounded-lg flex items-center justify-center font-black text-[10px] group-hover:bg-indigo-900 group-hover:text-white transition-all">
                          {tx.beneficiary?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-main">{tx.beneficiary}</p>
                          <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mt-0.5">{tx.type} • NODE-SYNC</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{tx.category}</span>
                    </td>
                    <td className="px-8 py-6">
                      <p className={cn(
                        "text-sm font-bold tabular-nums",
                        tx.type === 'Income' ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {tx.type === 'Income' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest">{tx.date}</td>
                    <td className="px-8 py-6 text-right">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1 rounded-full",
                        tx.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", tx.status === 'Paid' ? "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]" : "bg-amber-600")} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{tx.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border-theme p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-900 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-900/20 rotate-3">
             <DollarSign size={40} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-widest">Liquid Reserve Pulse</h3>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest mt-2 leading-relaxed max-w-[200px] mx-auto">Master institutional liquidity is optimized for current operational cycle.</p>
          </div>
          <div className="w-full p-6 bg-bg/50 rounded-2xl border border-border-theme flex justify-between items-center">
             <div className="text-left">
                <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Efficiency Index</p>
                <p className="text-2xl font-bold text-text-main tabular-nums">94.2%</p>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-indigo-600/20 border-t-indigo-600 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
};
