import React, { useState } from 'react';
import { 
  CreditCard, 
  Settings2, 
  Users, 
  AlertCircle, 
  Plus, 
  Download,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFees } from '../hooks/useFees';
import { useQuery } from '@tanstack/react-query';
import { FinanceService } from '@/lib/api';
import { cn } from '@/lib/utils';

type TabType = 'collection' | 'structure' | 'defaulters';

export const FeeManagement = () => {
  const [activeTab, setActiveTab] = useState<TabType>('collection');
  const { fees, isLoading, payFee, isPaying } = useFees();
  
  const { data: categories = [] } = useQuery({
    queryKey: ['fee-categories'],
    queryFn: FinanceService.getFeeCategories,
  });

  const defaulters = fees.filter((f: any) => f.status !== 'Paid');

  const tabs = [
    { id: 'collection', name: 'Master Collection', icon: CreditCard },
    { id: 'structure', name: 'Fee Structure', icon: Settings2 },
    { id: 'defaulters', name: 'Defaulters Intelligence', icon: AlertCircle },
  ];

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
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Billing Governance</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Unified Fiscal Control & Resource Synchronization</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-bg border border-border-theme rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-white transition-all flex items-center justify-center gap-2">
            <Download size={16} />
            Master Audit
          </button>
          <button className="flex-1 md:flex-none px-8 py-3.5 bg-indigo-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <Plus size={16} />
            Generate Invoices
          </button>
        </div>
      </header>

      <nav className="flex items-center gap-2 p-1.5 bg-white border border-border-theme rounded-2xl w-fit shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activeTab === tab.id ? "bg-indigo-900 text-white shadow-lg shadow-indigo-900/20" : "text-text-muted hover:text-indigo-900"
            )}
          >
            <tab.icon size={14} />
            {tab.name}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'collection' && (
            <div className="bg-white rounded-3xl border border-border-theme shadow-sm overflow-hidden">
               <div className="p-8 border-b border-border-theme bg-bg/20 flex justify-between items-center">
                  <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                     <CreditCard size={18} className="text-indigo-600" />
                     Live Collection Ledger
                  </h3>
                  <div className="px-4 py-2 bg-white rounded-xl border border-border-theme text-[9px] font-black text-text-muted uppercase tracking-[0.2em] shadow-sm">
                     Node Sync: Priority-Alpha
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                          <th className="px-8 py-5">Subscribed Entity</th>
                          <th className="px-8 py-5">Billing Categorization</th>
                          <th className="px-8 py-5">Master Balance</th>
                          <th className="px-8 py-5">Due Threshold</th>
                          <th className="px-8 py-5 text-right">Synchronization Command</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme">
                       {fees.map((f: any) => (
                        <tr key={f.id} className="hover:bg-indigo-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-indigo-900 border border-indigo-900/10 text-white rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm">
                                    {f.studentUser?.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-text-main">{f.studentUser?.name}</p>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">{f.student?.id.toUpperCase()}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{f.category?.name}</span>
                              <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-1 italic">{f.category?.frequency}</p>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-sm font-bold text-text-main tabular-nums">${f.amountPaid.toLocaleString()}</p>
                              <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mt-0.5">Disbursed Funds</p>
                           </td>
                           <td className="px-8 py-6 text-[10px] font-black text-text-main uppercase tracking-widest">{f.dueDate}</td>
                           <td className="px-8 py-6 text-right">
                              {f.status !== 'Paid' ? (
                                <button 
                                  onClick={() => payFee({ id: f.id, amount: f.category?.amount })}
                                  disabled={isPaying}
                                  className="px-6 py-2.5 bg-indigo-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 shadow-md shadow-indigo-900/20 transition-all"
                                >
                                  {isPaying ? 'Synchronizing...' : 'Authorize Sync'}
                                </button>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm">
                                   <div className="w-2 h-2 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]" />
                                   <span className="text-[10px] font-black uppercase tracking-widest">Reconciled</span>
                                </div>
                              )}
                           </td>
                        </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-6">
                  {categories.map((cat: any) => (
                    <div key={cat.id} className="bg-white p-8 rounded-3xl border border-border-theme shadow-sm group hover:border-indigo-600 transition-all flex items-center justify-between">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-indigo-900 border border-border-theme group-hover:bg-indigo-900 group-hover:text-white transition-all shadow-inner">
                             <Building2 size={28} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-text-main uppercase tracking-tight">{cat.name}</h4>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-2 py-1 bg-indigo-50 rounded-lg">{cat.frequency} Cycle</span>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Master Node: {cat.id.toUpperCase()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Unit Remuneration</span>
                          <p className="text-2xl font-black text-indigo-900 tabular-nums">${cat.amount.toLocaleString()}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-900/20 flex flex-col justify-between overflow-hidden relative min-h-[400px]">
                  <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-white/10 rounded-full blur-3xl" />
                  <div className="relative space-y-6">
                     <ShieldCheck size={48} className="text-indigo-300" />
                     <h3 className="text-2xl font-black uppercase tracking-tight leading-none italic">Billing Architecture & Protocols</h3>
                     <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-widest">Define master fee parameters for institutional resource allocation. All structural changes resonate across the planetary billing engine.</p>
                  </div>
                  <button className="relative w-full py-4 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl">
                     Initialize New Structure
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'defaulters' && (
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 flex items-center justify-between">
                     <div>
                        <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Identified Defaulters</p>
                        <p className="text-3xl font-black text-rose-900 tabular-nums">{defaulters.length}</p>
                     </div>
                     <AlertCircle size={32} className="text-rose-300" />
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-border-theme shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-border-theme bg-rose-50/30 flex justify-between items-center">
                     <h3 className="text-xs font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={18} className="text-rose-600" />
                        Master Defaulters Intelligence Ledger
                     </h3>
                     <button className="px-4 py-2 bg-rose-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-900/20">
                        Initiate Recovery Sequence
                     </button>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                              <th className="px-8 py-5">Subscribed Entity</th>
                              <th className="px-8 py-5">Academic Domain</th>
                              <th className="px-8 py-5 text-right">Outstanding Delta</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border-theme">
                           {defaulters.map((f: any) => (
                              <tr key={f.id} className="hover:bg-rose-50/30 transition-colors group">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-rose-900 text-white rounded-xl flex items-center justify-center font-black text-[10px]">
                                          {f.studentUser?.name.charAt(0)}
                                       </div>
                                       <div>
                                          <p className="text-sm font-bold text-text-main group-hover:text-rose-900 transition-colors uppercase tracking-tight">{f.studentUser?.name}</p>
                                          <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">{f.student?.id.toUpperCase()}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{f.class?.name}</span>
                                    <p className="text-[9px] text-rose-600 font-bold uppercase tracking-widest mt-1">Pending: {f.category?.name}</p>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <p className="text-base font-black text-rose-600 tabular-nums">${((f.category?.amount || 0) - f.amountPaid).toLocaleString()}</p>
                                    <p className="text-[8px] font-black text-text-muted uppercase tracking-widest flex items-center justify-end gap-1">
                                       <Clock size={10} />
                                       Due: {f.dueDate}
                                    </p>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
