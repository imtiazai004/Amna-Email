import React from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CreditCard,
  Video
} from 'lucide-react';
import { useGuardianSummary } from '../hooks/useGuardianSummary';

export const GuardianDashboard = () => {
  const { summary, isLoading } = useGuardianSummary('g1');

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <header className="bg-primary p-6 rounded-xl text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Guardian Hub</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 bg-success-theme rounded-full animate-pulse" />
            <p className="opacity-80 text-[10px] font-black uppercase tracking-widest">Master Data Sync: Sarah Johnson</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/10 p-2.5 rounded-lg hover:bg-white/20 transition-all border border-white/10">
            <MessageSquare size={20} />
          </button>
          <button className="bg-white text-primary px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px]">
            Faculty Meeting
          </button>
        </div>
      </header>

      {summary.map((item: any, idx: number) => (
        <div key={idx} className="space-y-6">
           <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-bg border border-border-theme rounded text-[10px] font-black uppercase tracking-widest text-primary">Student Profile</div>
             <h2 className="text-lg font-bold text-text-main">{item.student?.name} (UID: {item.student?.id})</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-text-main uppercase tracking-wider text-[11px] flex items-center gap-2">
                   <TrendingUp size={16} className="text-success-theme" />
                   Performance
                 </h3>
                 <span className="text-[10px] font-black text-[#166534] uppercase bg-[#dcfce7] px-2 py-0.5 rounded">A- (Avg)</span>
               </div>
               <div className="flex items-center justify-center p-6 bg-bg rounded-lg border border-border-theme">
                 <span className="text-5xl font-bold text-text-main">92%</span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-text-main uppercase tracking-wider text-[11px] flex items-center gap-2">
                   <Clock size={16} className="text-primary" />
                   Attendance
                 </h3>
                 <span className="text-[10px] font-black text-primary uppercase bg-[#dbeafe] px-2 py-0.5 rounded">Synced</span>
               </div>
               <div className="flex items-center justify-center p-6 bg-bg rounded-lg border border-border-theme">
                 <span className="text-5xl font-bold text-text-main">
                   {item.attendance.length > 0 
                     ? Math.round((item.attendance.filter((a: any) => a.status === 'Present').length / item.attendance.length) * 100) + '%' 
                     : 'N/A'}
                 </span>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-text-main uppercase tracking-wider text-[11px] flex items-center gap-2">
                   <CreditCard size={16} className="text-warning-theme" />
                   Account Balance
                 </h3>
                 <span className="text-[10px] font-black text-[#9a3412] uppercase bg-[#ffedd5] px-2 py-0.5 rounded">Pending</span>
               </div>
               <div className="flex items-center justify-center p-6 bg-bg rounded-lg border border-border-theme">
                 <span className="text-3xl font-bold text-text-main">
                    ${(item.fees.reduce((acc: number, f: any) => acc + (f.status === 'Pending' ? (f.category?.amount || 0) - f.amountPaid : 0), 0)).toLocaleString()}
                 </span>
               </div>
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-6 pb-2 border-b border-border-theme">Faculty Feedback Logic</h3>
          <div className="space-y-4 text-center py-10">
             <div className="text-text-muted text-xs font-medium italic">Pulling real-time observations from teacher portal...</div>
             <p className="text-[10px] font-black uppercase text-primary tracking-widest animate-pulse">Establishing Connection</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border-theme shadow-sm">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-6 pb-2 border-b border-border-theme">Unified Video Conferencing</h3>
          <div className="space-y-3">
             <div className="p-5 bg-primary rounded-xl text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/20 rounded-lg">
                    <Video size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[11px] uppercase tracking-tight">Parent-Teacher Sync</h4>
                    <p className="text-[10px] opacity-70 uppercase tracking-wider font-bold">Nov 15 • 10:30 AM</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-white text-primary rounded-md text-[10px] font-black uppercase tracking-widest hover:opacity-90">Secure Connection</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
