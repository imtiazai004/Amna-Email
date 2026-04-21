import React from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter,
  Download,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardianSummary } from '../hooks/useGuardianSummary';
import { cn } from '@/lib/utils';

export const GuardianAttendance = () => {
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
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Attendance History</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Real-time Presence Tracking & Node-Sync Logs</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-border-theme rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-bg transition-all flex items-center justify-center gap-2 shadow-sm">
            <Download size={16} />
            Export Records
          </button>
        </div>
      </header>

      {summary.map((item: any, idx: number) => {
        const attendanceRate = item.attendance.length > 0 
          ? Math.round((item.attendance.filter((a: any) => a.status === 'Present').length / item.attendance.length) * 100)
          : 0;

        return (
          <div key={idx} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-indigo-900 text-white rounded text-[10px] font-black uppercase tracking-widest">Master Node</div>
              <h2 className="text-lg font-bold text-text-main">{item.student?.user?.name}</h2>
              <div className="h-px flex-1 bg-border-theme ml-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Average Presence</p>
                  <h3 className="text-3xl font-black text-indigo-900 tabular-nums mt-1">{attendanceRate}%</h3>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Total Observed</p>
                  <h3 className="text-3xl font-black text-text-main tabular-nums mt-1">{item.attendance.length} <span className="text-xs opacity-40">Days</span></h3>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm border-l-4 border-l-emerald-500">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Verified Present</p>
                  <h3 className="text-3xl font-black text-emerald-600 tabular-nums mt-1">{item.attendance.filter((a: any) => a.status === 'Present').length}</h3>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm border-l-4 border-l-rose-500">
                  <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Logged Absent</p>
                  <h3 className="text-3xl font-black text-rose-600 tabular-nums mt-1">{item.attendance.filter((a: any) => a.status === 'Absent').length}</h3>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-border-theme shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border-theme bg-bg/20 flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                     <Calendar size={16} className="text-indigo-600" />
                     Presence Transaction Log
                  </h3>
                  <div className="flex gap-2">
                     <button className="p-2 hover:bg-bg rounded-lg border border-border-theme transition-all">
                        <Filter size={14} className="text-text-muted" />
                     </button>
                  </div>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                          <th className="px-8 py-5">Date Entity</th>
                          <th className="px-8 py-5">Sync Status</th>
                          <th className="px-8 py-5">Verification Node</th>
                          <th className="px-8 py-5 text-right">Remarks</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme">
                       {item.attendance.map((record: any) => (
                        <tr key={record.id} className="hover:bg-indigo-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <p className="text-sm font-bold text-text-main tabular-nums">{record.date}</p>
                              <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">Automated Scan</p>
                           </td>
                           <td className="px-8 py-6">
                              <div className={cn(
                                "inline-flex items-center gap-2 px-3 py-1 rounded-full",
                                record.status === 'Present' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                              )}>
                                 {record.status === 'Present' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                 <span className="text-[10px] font-black uppercase tracking-widest">{record.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Main-Gate-Scanner-04</p>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest italic leading-none">
                                 {record.status === 'Present' ? 'Verified Entry' : 'Manual Audit Required'}
                              </span>
                           </td>
                        </tr>
                       ))}
                       {item.attendance.length === 0 && (
                        <tr>
                           <td colSpan={4} className="px-8 py-20 text-center">
                              <AlertCircle size={32} className="mx-auto text-text-muted/30 mb-4" />
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">No presence telemetry detected for this node.</p>
                           </td>
                        </tr>
                       )}
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
