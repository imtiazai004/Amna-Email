import React from 'react';
import { 
  CreditCard, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardianSummary } from '../hooks/useGuardianSummary';
import { cn } from '@/lib/utils';

export const GuardianFees = () => {
  const { summary, isLoading } = useGuardianSummary();

  if (!localStorage.getItem('activeGuardianId')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
        <div className="w-20 h-20 bg-bg border border-border-theme rounded-[32px] flex items-center justify-center text-indigo-900 shadow-inner">
           <ShieldCheck size={40} className="opacity-20" />
        </div>
        <div>
           <h3 className="text-sm font-black text-text-main uppercase tracking-widest italic">Identity Sync Required</h3>
           <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-2 max-w-xs leading-relaxed">Please initialize your session in the Guardian Hub via your registered mobile node.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Fees & Disbursements</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Institutional Billing Ledger & Financial Synchronicity</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-8 py-3.5 bg-indigo-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
            <CreditCard size={16} />
            Bulk Disbursement
          </button>
        </div>
      </header>

      {summary.map((item: any, idx: number) => {
        const totalPending = item.fees.reduce((acc: number, f: any) => acc + (f.status === 'Pending' ? (f.category?.amount || 0) : 0), 0);
        const totalPaid = item.fees.reduce((acc: number, f: any) => acc + (f.status === 'Paid' ? (f.category?.amount || 0) : 0), 0);

        return (
          <div key={idx} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-bg border border-border-theme text-text-muted rounded text-[10px] font-black uppercase tracking-widest">Student Node</div>
              <h2 className="text-lg font-bold text-text-main">{item.student?.user?.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-indigo-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12" />
                  <div className="relative">
                     <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em]">Master Outstanding Balance</p>
                     <h3 className="text-5xl font-black tabular-nums mt-4 tracking-tighter">${totalPending.toLocaleString()}</h3>
                     <div className="mt-12 flex items-center gap-6">
                        <div className="flex-1 p-5 rounded-2xl bg-white/10 border border-white/10">
                           <p className="text-[9px] font-black opacity-60 uppercase tracking-widest">Next Due Threshold</p>
                           <p className="text-sm font-bold mt-1">October 24, 2023</p>
                        </div>
                        <button className="w-14 h-14 bg-white text-indigo-900 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                           <ChevronRight size={24} />
                        </button>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between">
                     <div>
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                           <CheckCircle2 size={24} />
                        </div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none">Verified Transactions</p>
                        <h4 className="text-2xl font-black text-text-main tabular-nums mt-2">${totalPaid.toLocaleString()}</h4>
                     </div>
                     <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 mt-6 hover:underline">
                        Audit Trail <ArrowRight size={12} />
                     </button>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-border-theme shadow-sm flex flex-col justify-between items-center text-center">
                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                        <TrendingUp size={24} />
                     </div>
                     <div className="mt-4">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Financial Health</p>
                        <h4 className="text-lg font-black text-indigo-900 uppercase tracking-tighter mt-1 italic">Optimal Sync</h4>
                     </div>
                     <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-2">Node stability verified</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-border-theme shadow-sm overflow-hidden mt-8">
               <div className="p-8 border-b border-border-theme bg-bg/20 flex justify-between items-center">
                  <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck size={18} className="text-indigo-600" />
                     Institutional Billing Stream
                  </h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                          <th className="px-8 py-5">Billing Entity</th>
                          <th className="px-8 py-5">Value</th>
                          <th className="px-8 py-5">Threshold Date</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right">Audit</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme">
                       {item.fees.map((f: any) => (
                        <tr key={f.id} className="hover:bg-indigo-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <p className="text-sm font-bold text-text-main">{f.category?.name}</p>
                              <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">Automated Invoice: #{f.id.toUpperCase()}</p>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-bold text-text-main tabular-nums">${(f.category?.amount || 0).toLocaleString()}</p>
                           </td>
                           <td className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest tabular-nums">{f.dueDate}</td>
                           <td className="px-8 py-6">
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full",
                                f.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                              )}>
                                 {f.status === 'Paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                 <span className="text-[10px] font-black uppercase tracking-widest">{f.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2.5 bg-bg border border-border-theme rounded-xl text-text-muted hover:bg-indigo-900 hover:text-white transition-all shadow-sm">
                                 <Download size={14} />
                              </button>
                           </td>
                        </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ArrowRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
