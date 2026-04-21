import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CreditCard,
  Video,
  Search,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useGuardianSummary } from '../hooks/useGuardianSummary';
import { GuardianService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const GuardianDashboard = () => {
  const [phone, setPhone] = useState('');
  const [activeGuardianId, setActiveGuardianId] = useState<string | null>(localStorage.getItem('activeGuardianId'));
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { summary, isLoading } = useGuardianSummary(activeGuardianId || undefined);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError(null);
    try {
      const data = await GuardianService.searchByPhone(phone);
      localStorage.setItem('activeGuardianId', data.guardian.id);
      setActiveGuardianId(data.guardian.id);
    } catch (err) {
      setSearchError('No institutional record found for this phone number node.');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSession = () => {
    localStorage.removeItem('activeGuardianId');
    setActiveGuardianId(null);
  };

  if (activeGuardianId && isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest animate-pulse">Establishing Secure Node Sync...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!activeGuardianId ? (
          <motion.div 
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl mx-auto py-20 text-center"
          >
            <div className="bg-white p-10 rounded-[40px] border border-border-theme shadow-2xl shadow-indigo-900/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-indigo-50 rounded-full blur-3xl -mr-12 -mt-12 opacity-50" />
              <div className="relative space-y-8">
                 <div className="w-20 h-20 bg-indigo-900 rounded-[32px] flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-900/20">
                    <ShieldCheck size={40} />
                 </div>
                 <div>
                    <h1 className="text-3xl font-black text-indigo-900 uppercase tracking-tighter leading-none italic">Guardian Access Portal</h1>
                    <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Verify Institutional Identity via Registered Phone Node</p>
                 </div>

                 <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                       <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                       <input 
                          type="tel" 
                          placeholder="Registered Mobile Number..." 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-bg border border-border-theme pl-16 pr-6 py-5 rounded-[24px] text-sm font-bold text-text-main outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white transition-all shadow-inner"
                          required
                       />
                    </div>
                    {searchError && (
                       <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest justify-center">
                          <AlertCircle size={14} />
                          {searchError}
                       </div>
                    )}
                    <button 
                       type="submit"
                       disabled={isSearching}
                       className="w-full py-5 bg-indigo-900 text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                    >
                       {isSearching ? 'Synchronizing Nodes...' : 'Initialize Secure Sync'}
                       <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                 </form>

                 <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest leading-relaxed opacity-60">
                    Unified Multi-Child Visibility Protocol Active. Contact administration if your mobile node is not registered.
                 </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <header className="bg-indigo-900 p-8 rounded-[32px] text-white shadow-2xl shadow-indigo-900/20 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="relative">
                <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Guardian Control Hub</h1>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                  <p className="opacity-60 text-[10px] font-black uppercase tracking-widest">Master Link Established: {summary[0]?.student?.guardian?.user?.name || 'Authorized Parent'}</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <button className="bg-white/10 p-3.5 rounded-2xl hover:bg-white/20 transition-all border border-white/10 shadow-inner">
                  <MessageSquare size={22} />
                </button>
                <button 
                  onClick={clearSession}
                  className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Terminate Sync
                </button>
              </div>
            </header>

            {summary.map((item: any, idx: number) => (
              <div key={idx} className="space-y-6 bg-white p-8 rounded-[40px] border border-border-theme shadow-sm">
                 <div className="flex items-center justify-between border-b border-border-theme pb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 bg-indigo-900 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                          {item.student?.user?.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Student Profile</p>
                          <h2 className="text-xl font-black text-text-main uppercase tracking-tight italic leading-none mt-1">{item.student?.user?.name}</h2>
                          <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-1.5">Entity UID: {item.student?.id.toUpperCase()}</p>
                       </div>
                    </div>
                    <div className="hidden sm:flex gap-4">
                       <div className="text-right">
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Performance Index</p>
                          <p className="text-lg font-black text-indigo-900 tracking-tighter">High-Alpha</p>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="bg-bg p-6 rounded-[24px] border border-border-theme space-y-6 group hover:border-indigo-600/20 transition-all">
                     <div className="flex justify-between items-center">
                       <h3 className="font-black text-text-muted uppercase tracking-wider text-[10px] flex items-center gap-2">
                         <TrendingUp size={16} className="text-emerald-500" />
                         Mastery Level
                       </h3>
                       <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">Top 5%</span>
                     </div>
                     <div className="flex items-center justify-center py-4">
                       <span className="text-5xl font-black text-text-main tracking-tighter italic">92%</span>
                     </div>
                  </div>

                  <div className="bg-bg p-6 rounded-[24px] border border-border-theme space-y-6 group hover:border-indigo-600/20 transition-all">
                     <div className="flex justify-between items-center">
                       <h3 className="font-black text-text-muted uppercase tracking-wider text-[10px] flex items-center gap-2">
                         <Clock size={16} className="text-indigo-600" />
                         Presence Log
                       </h3>
                       <span className="text-[9px] font-black text-indigo-900 uppercase bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">Synchronized</span>
                     </div>
                     <div className="flex items-center justify-center py-4">
                       <span className="text-5xl font-black text-text-main tracking-tighter italic">
                         {item.attendance.length > 0 
                           ? Math.round((item.attendance.filter((a: any) => a.status === 'Present').length / item.attendance.length) * 100) + '%' 
                           : 'N/A'}
                       </span>
                     </div>
                  </div>

                  <div className="bg-bg p-6 rounded-[24px] border border-border-theme space-y-6 group hover:border-indigo-600/20 transition-all">
                     <div className="flex justify-between items-center">
                       <h3 className="font-black text-text-muted uppercase tracking-wider text-[10px] flex items-center gap-2">
                         <CreditCard size={16} className="text-amber-600" />
                         Account Delta
                       </h3>
                       <span className="text-[9px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">Fiscal Pending</span>
                     </div>
                     <div className="flex items-center justify-center py-4 text-amber-600">
                       <span className="text-4xl font-black tracking-tighter italic">
                          ${(item.fees.reduce((acc: number, f: any) => acc + (f.status === 'Pending' ? (f.category?.amount || 0) - f.amountPaid : 0), 0)).toLocaleString()}
                       </span>
                     </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[40px] border border-border-theme shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 bg-indigo-50 rounded-full blur-3xl -mr-8 -mt-8 opacity-50 group-hover:bg-indigo-100 transition-colors" />
                <div className="relative">
                  <h3 className="text-xs font-black text-text-main uppercase tracking-widest mb-8 border-b border-border-theme pb-4 italic">Faculty Observations</h3>
                  <div className="space-y-6">
                     <div className="p-6 bg-bg rounded-2xl border border-border-theme flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center text-white font-black text-[10px]">EW</div>
                        <div>
                           <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Dr. Emily Watson</p>
                           <p className="text-xs font-medium text-text-main mt-1 leading-relaxed">The student node is demonstrating exceptional algorithmic reasoning in advanced sequences.</p>
                        </div>
                     </div>
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest text-center animate-pulse">Establishing Active Connection to Mentor Nodes...</p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-900/20 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 bg-indigo-600/30 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative space-y-6">
                   <div className="w-14 h-14 bg-white/10 rounded-[20px] flex items-center justify-center border border-white/10 shadow-inner">
                      <Video size={28} className="text-indigo-300" />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-tighter leading-none italic">Unified Video Infrastructure</h3>
                   <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-widest">Active parent-teacher synchronization bridge is operational. End-to-end node encryption verified.</p>
                </div>
                <div className="relative pt-8">
                   <div className="p-6 bg-white/5 rounded-[24px] border border-white/5 flex items-center justify-between shadow-inner">
                      <div>
                        <h4 className="font-black text-[11px] uppercase tracking-tight">Academic Sync-Loop</h4>
                        <p className="text-[9px] opacity-40 uppercase tracking-wider font-bold mt-1 italic">Nov 15 • 10:30 AM (UTC Sync)</p>
                      </div>
                      <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">Secure Entry</button>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
