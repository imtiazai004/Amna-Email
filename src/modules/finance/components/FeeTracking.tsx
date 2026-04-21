import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  School, 
  TrendingUp, 
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFees } from '../hooks/useFees';
import { useQuery } from '@tanstack/react-query';
import { AcademicService } from '@/lib/api';
import { cn } from '@/lib/utils';

type TrackingMode = 'class' | 'student';

export const FeeTracking = () => {
  const { fees, isLoading: feesLoading } = useFees();
  const [mode, setMode] = useState<TrackingMode>('class');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: AcademicService.getClasses,
  });

  if (feesLoading || classesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const classTracking = classes.map((c: any) => {
    const classFees = fees.filter((f: any) => f.class?.id === c.id);
    const totalAmount = classFees.reduce((acc: number, f: any) => acc + (f.category?.amount || 0), 0);
    const collectedAmount = classFees.reduce((acc: number, f: any) => acc + f.amountPaid, 0);
    const pendingAmount = totalAmount - collectedAmount;
    const collectionRate = totalAmount > 0 ? (collectedAmount / totalAmount) * 100 : 0;

    return {
      ...c,
      totalAmount,
      collectedAmount,
      pendingAmount,
      collectionRate,
      studentCount: classFees.length
    };
  });

  const studentTracking = fees.filter((f: any) => 
    f.studentUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.student?.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Advanced Fee Tracking</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Class-wise & Student-specific Fiscal Monitoring Matrix</p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-bg border border-border-theme rounded-2xl">
          <button 
            onClick={() => setMode('class')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              mode === 'class' ? "bg-indigo-900 text-white shadow-lg shadow-indigo-900/20" : "text-text-muted hover:text-indigo-900"
            )}
          >
            <School size={14} />
            Class-wise
          </button>
          <button 
            onClick={() => setMode('student')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              mode === 'student' ? "bg-indigo-900 text-white shadow-lg shadow-indigo-900/20" : "text-text-muted hover:text-indigo-900"
            )}
          >
            <Users size={14} />
            Student-wise
          </button>
        </div>
      </header>

      {mode === 'student' && (
        <div className="relative max-w-md">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
           <input 
             type="text" 
             placeholder="Search by student name or record ID..." 
             className="w-full bg-white border border-border-theme pl-12 pr-4 py-3 rounded-2xl text-xs font-bold text-text-main uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all shadow-sm"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ duration: 0.2 }}
        >
          {mode === 'class' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {classTracking.map((c: any) => (
                <div key={c.id} className="bg-white rounded-3xl border border-border-theme p-8 shadow-sm group hover:border-indigo-600 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-900 group-hover:text-white transition-all">
                      <School size={28} />
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Collection Rate</span>
                       <p className="text-2xl font-black text-indigo-900 tabular-nums">{c.collectionRate.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-text-main uppercase tracking-tight">{c.name}</h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5 italic">
                       <TrendingUp size={12} className="text-indigo-400" />
                       Node ID: {c.id.toUpperCase()} • {c.studentCount} Managed Entities
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-border-theme grid grid-cols-2 gap-8">
                    <div>
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Total Forecast</span>
                      <p className="text-sm font-bold text-text-main tabular-nums">${c.totalAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Master Collected</span>
                      <p className="text-sm font-bold text-emerald-600 tabular-nums">${c.collectedAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mt-6 h-1.5 bg-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-1000" 
                      style={{ width: `${c.collectionRate}%` }} 
                    />
                  </div>

                  <button className="w-full mt-8 py-3 bg-bg border border-border-theme rounded-2xl text-[10px] font-black text-text-muted uppercase tracking-widest hover:bg-indigo-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn">
                    Access Ledger
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-border-theme shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                          <th className="px-8 py-5">Student Entity</th>
                          <th className="px-8 py-5">Academic Domain</th>
                          <th className="px-8 py-5">Billing Category</th>
                          <th className="px-8 py-5">Disbursement Status</th>
                          <th className="px-8 py-5 text-right">Master Balance</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme">
                       {studentTracking.map((f: any) => (
                        <tr key={f.id} className="hover:bg-indigo-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-indigo-900/5 border border-indigo-900/10 text-indigo-900 rounded-xl flex items-center justify-center font-black text-[10px] group-hover:bg-indigo-900 group-hover:text-white transition-all shadow-sm">
                                    {f.studentUser?.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-text-main">{f.studentUser?.name}</p>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">{f.student?.id.toUpperCase()}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="px-2.5 py-1 bg-bg text-text-muted border border-border-theme rounded-lg text-[10px] font-black uppercase tracking-widest">
                                 {f.class?.name}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{f.category?.name}</span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 {f.status === 'Paid' ? (
                                   <CheckCircle2 size={16} className="text-emerald-500" />
                                 ) : f.status === 'Pending' ? (
                                   <Clock size={16} className="text-amber-500" />
                                 ) : (
                                   <XCircle size={16} className="text-rose-500" />
                                 )}
                                 <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{f.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right font-bold text-text-main tabular-nums">
                              ${((f.category?.amount || 0) - f.amountPaid).toLocaleString()}
                           </td>
                        </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
