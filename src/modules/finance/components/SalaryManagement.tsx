import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Download, 
  Search,
  Building2,
  TrendingUp,
  History,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSalaries } from '../hooks/useSalaries';
import { cn } from '@/lib/utils';

type TabType = 'setup' | 'monthly' | 'yearly';

export const SalaryManagement = () => {
  const [activeTab, setActiveTab] = useState<TabType>('monthly');
  const { salaries, isLoading, paySalary, isPaying } = useSalaries();

  const tabs = [
    { id: 'setup', name: 'Salary Setup', icon: Layers },
    { id: 'monthly', name: 'Monthly Record', icon: Calendar },
    { id: 'yearly', name: 'Yearly Trend', icon: TrendingUp },
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
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Payroll Orchestration</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Staff Remuneration & Institutional Disbursement Matrix</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-bg border border-border-theme rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-white transition-all flex items-center justify-center gap-2">
            <History size={16} />
            Data Archives
          </button>
          <button className="flex-1 md:flex-none px-8 py-3.5 bg-indigo-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <Download size={16} />
            Bulk Sync
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
          {activeTab === 'monthly' && (
            <div className="bg-white rounded-3xl border border-border-theme shadow-sm overflow-hidden">
               <div className="p-8 border-b border-border-theme bg-bg/20 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search faculty entity..." 
                      className="w-full bg-white border border-border-theme pl-12 pr-4 py-3 rounded-2xl text-xs font-bold text-text-main uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <select className="flex-1 md:flex-none bg-white border border-border-theme px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer hover:border-indigo-600 transition-all">
                      <option>Current Billing Month</option>
                      <option>November 2023</option>
                      <option>October 2023</option>
                    </select>
                  </div>
               </div>

               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                          <th className="px-8 py-5">Faculty Entity</th>
                          <th className="px-8 py-5">Domain Node</th>
                          <th className="px-8 py-5">Billing Month</th>
                          <th className="px-8 py-5">Remuneration</th>
                          <th className="px-8 py-5 text-right">Synchronization</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme">
                       {salaries.map((s: any) => (
                        <tr key={s.id} className="hover:bg-indigo-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-indigo-900 border border-indigo-900/10 text-white rounded-xl flex items-center justify-center font-black text-[11px] shadow-sm">
                                    {s.teacherUser?.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-text-main">{s.teacherUser?.name}</p>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest leading-none mt-0.5">{s.teacher?.role}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">
                                 <Building2 size={12} className="text-indigo-400" />
                                 {s.teacher?.departmentId === 'd1' ? 'Mathematics' : 'Fine Arts'}
                              </div>
                           </td>
                           <td className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest tabular-nums">{s.month}</td>
                           <td className="px-8 py-6 font-bold text-text-main tabular-nums">${s.amount.toLocaleString()}</td>
                           <td className="px-8 py-6 text-right">
                              {s.status === 'Pending' ? (
                                <button 
                                  onClick={() => paySalary(s.id)}
                                  disabled={isPaying}
                                  className="px-6 py-2.5 bg-indigo-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 shadow-md shadow-indigo-900/20 transition-all font-sans"
                                >
                                  {isPaying ? 'Synchronizing...' : 'Authorize Sync'}
                                </button>
                              ) : (
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm animate-in zoom-in-95 duration-300">
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

          {activeTab === 'setup' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {salaries.filter((v, i, a) => a.findIndex(t => t.teacherId === v.teacherId) === i).map((s: any) => (
                  <div key={s.teacherId} className="bg-white p-8 rounded-3xl border border-border-theme shadow-sm group hover:border-indigo-600 transition-all flex flex-col justify-between">
                     <div className="flex justify-between items-start mb-8">
                        <div className="w-16 h-16 bg-bg border border-border-theme rounded-2xl flex items-center justify-center font-black text-xl text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-all shadow-inner uppercase">
                           {s.teacherUser?.name.charAt(0)}
                        </div>
                        <div className="text-right">
                           <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Configured Ledger</span>
                           <p className="text-2xl font-black text-indigo-900 tabular-nums">${s.amount.toLocaleString()}</p>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-text-main uppercase tracking-tight">{s.teacherUser?.name}</h4>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] flex items-center gap-1.5 mt-1">
                           <Layers size={14} className="text-indigo-400" />
                           Node: {s.teacherId.toUpperCase()} • {s.teacher?.role}
                        </p>
                     </div>
                     <button className="w-full mt-8 py-3 bg-bg border border-border-theme rounded-2xl text-[10px] font-black text-text-muted uppercase tracking-widest hover:bg-indigo-900 hover:text-white transition-all">
                        Update Configuration
                     </button>
                  </div>
               ))}
            </div>
          )}

          {activeTab === 'yearly' && (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white p-12 rounded-[40px] border border-border-theme shadow-sm">
                      <div className="flex justify-between items-end mb-12">
                         <div>
                            <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter">Annual Expenditure Pulse</h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Forecast Hub • Institutional Year 2023</p>
                         </div>
                         <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <ArrowUpRight size={18} />
                            <span className="text-sm font-black tabular-nums">+14.2%</span>
                         </div>
                      </div>
                      <div className="flex items-end justify-between h-48 gap-4 px-4 translate-y-4">
                         {[60, 45, 80, 55, 90, 75, 40, 65, 85, 50, 70, 95].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                               <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-indigo-900 text-white px-2 py-1 rounded text-[8px] font-black uppercase pointer-events-none">
                                  ${(h * 100).toLocaleString()}
                               </div>
                               <div 
                                 className="w-full bg-indigo-100 rounded-lg group-hover:bg-indigo-600 transition-all duration-500 shadow-sm" 
                                 style={{ height: `${h}%` }}
                               />
                               <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="bg-indigo-900 rounded-[40px] p-10 text-white flex flex-col justify-between shadow-2xl shadow-indigo-900/20 relative overflow-hidden min-h-[400px]">
                   <div className="absolute top-0 right-0 p-20 bg-indigo-600/30 rounded-full blur-3xl -mr-16 -mt-16" />
                   <div className="relative space-y-6">
                      <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                         <TrendingUp size={28} className="text-indigo-300" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tight italic leading-none">Global Remuneration Summary</h3>
                      <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-widest">Master analysis of faculty disbursements for the current fiscal cycle. Net efficiency is tracking at optimal levels.</p>
                   </div>

                   <div className="relative pt-8 border-t border-white/10 space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Annual Gross</span>
                         <span className="text-xl font-black tabular-nums">$584,200</span>
                      </div>
                      <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                         Export Global Audit
                      </button>
                   </div>
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
