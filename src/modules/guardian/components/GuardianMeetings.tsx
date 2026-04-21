import React from 'react';
import { 
  Video, 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  ChevronRight,
  Plus,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardianSummary } from '../hooks/useGuardianSummary';
import { cn } from '@/lib/utils';

export const GuardianMeetings = () => {
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

  const upcomingMeetings = [
    { 
      id: 'm1', 
      title: 'Academic Progress Review', 
      teacher: 'Dr. Emily Watson', 
      dept: 'Mathematics',
      date: 'Oct 24, 2023', 
      time: '10:30 AM', 
      type: 'Video Link', 
      status: 'Ready',
      avatar: 'EW'
    }
  ];

  const pastMeetings = [
    { 
      id: 'm2', 
      title: 'Initial Welcome Sync', 
      teacher: 'Robert Ross', 
      dept: 'Administration',
      date: 'Sep 12, 2023', 
      time: '02:00 PM', 
      type: 'Physical', 
      status: 'Concluded',
      avatar: 'RR'
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Collaboration Hub</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Unified Video Conferencing & Faculty Synchronization</p>
        </div>
        <button className="px-8 py-3.5 bg-indigo-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
          <Plus size={16} />
          Request Sync
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <section className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-success-theme rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                  <h3 className="text-xs font-black text-text-main uppercase tracking-widest italic">Live Synchronizations</h3>
               </div>
               
               {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white p-8 rounded-[32px] border border-border-theme shadow-sm group hover:border-indigo-600 transition-all flex flex-col md:flex-row items-center gap-8">
                     <div className="w-20 h-20 bg-indigo-900 rounded-3xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-900/20 group-hover:scale-110 transition-transform">
                        {meeting.avatar}
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                           <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{meeting.type}</span>
                           <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{meeting.status}</span>
                        </div>
                        <h4 className="text-xl font-black text-text-main uppercase tracking-tight italic">{meeting.title}</h4>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-text-muted text-[10px] font-black uppercase tracking-widest">
                           <div className="flex items-center gap-1.5">
                              <User size={14} className="text-indigo-400" />
                              {meeting.teacher}
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Building2 size={14} className="text-indigo-400" />
                              {meeting.dept}
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-indigo-400" />
                              {meeting.date}
                           </div>
                           <div className="flex items-center gap-1.5 text-indigo-900">
                              <Clock size={14} />
                              {meeting.time}
                           </div>
                        </div>
                     </div>
                     <button className="px-8 py-4 bg-indigo-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center gap-2 group/btn">
                        Enter Link
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </div>
               ))}
            </section>

            <section className="space-y-6">
               <h3 className="text-xs font-black text-text-muted uppercase tracking-widest italic ml-4">Historical Archives</h3>
               <div className="bg-white rounded-[32px] border border-border-theme shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <tbody className="divide-y divide-border-theme">
                           {pastMeetings.map((meeting) => (
                              <tr key={meeting.id} className="hover:bg-bg/50 transition-colors group">
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="w-10 h-10 bg-bg border border-border-theme rounded-xl flex items-center justify-center font-black text-[10px] text-text-muted">
                                          {meeting.avatar}
                                       </div>
                                       <div>
                                          <p className="text-sm font-bold text-text-main uppercase tracking-tight">{meeting.title}</p>
                                          <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">{meeting.teacher} • {meeting.dept}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-[10px] font-black text-text-muted uppercase tracking-widest italic tabular-nums">{meeting.date}</td>
                                 <td className="px-8 py-6">
                                    <span className="px-3 py-1 bg-bg border border-border-theme rounded-lg text-[9px] font-black text-text-muted uppercase tracking-widest">Concluded</span>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">View Minutes</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </section>
         </div>

         <div className="space-y-6">
            <div className="bg-white rounded-[40px] border border-border-theme p-10 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 -mr-12 -mt-12 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors" />
               <div className="relative space-y-6">
                  <div className="w-14 h-14 bg-indigo-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-900/20">
                     <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter leading-none italic">Secure Meeting Protocols</h3>
                  <p className="text-[11px] font-medium leading-relaxed text-text-muted uppercase tracking-widest italic">All vertex links are encrypted with end-to-end node synchronization for institutional privacy.</p>
                  
                  <div className="pt-6 border-t border-border-theme flex items-center gap-3">
                     <AlertCircle size={16} className="text-amber-500" />
                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Arrive 5 mins prior to bridge sync.</p>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-900 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-900/20 flex flex-col justify-between min-h-[300px]">
               <div>
                  <Video size={32} className="text-indigo-300 mb-6" />
                  <h4 className="text-xl font-black uppercase tracking-tight italic">Unified Bridge</h4>
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.2em] mt-2">Active Node: Priority-Alpha</p>
               </div>
               <div className="p-5 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Infrastructure Stable</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
