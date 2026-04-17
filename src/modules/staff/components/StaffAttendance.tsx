import React, { useState } from 'react';
import { UserCheck, UserX, Clock, CalendarDays, MoreHorizontal, Check, X } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { useStudents } from '@/modules/academics/hooks/useStudents';
import { useTeachers } from '../hooks/useTeachers';

export const StaffAttendance = () => {
  const { attendance, isLoading, markAttendance } = useAttendance();
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const [view, setView] = useState<'marking' | 'log'>('marking');

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const today = new Date().toISOString().split('T')[0];
  
  const handleMark = (id: string, type: 'STUDENT' | 'TEACHER', status: 'Present' | 'Absent') => {
    markAttendance({ entityId: id, entityType: type, status });
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl border border-border-theme shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Attendance Intelligence</h1>
          <p className="text-text-muted text-sm font-medium">Synchronized roll-call for students and faculty units</p>
        </div>
        <div className="flex gap-2 p-1 bg-bg border border-border-theme rounded-xl">
           <button 
            onClick={() => setView('marking')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'marking' ? 'bg-text-main text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
           >
             Daily Roll Call
           </button>
           <button 
            onClick={() => setView('log')}
            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'log' ? 'bg-text-main text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}
           >
             Master Logs
           </button>
        </div>
      </header>

      {view === 'marking' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-white rounded-xl border border-border-theme shadow-sm">
             <div className="p-6 border-b border-border-theme flex justify-between items-center">
                <h3 className="font-bold text-sm text-text-main uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Student Roll Call
                </h3>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">{students.length} Total Units</span>
             </div>
             <div className="divide-y divide-border-theme max-h-[600px] overflow-y-auto custom-scrollbar">
                {students.map((student: any) => {
                  const record = attendance.find((a: any) => a.entityId === student.id && a.date === today);
                  return (
                    <div key={student.id} className="p-4 flex items-center justify-between hover:bg-bg transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-bg border border-border-theme flex items-center justify-center font-black text-xs text-text-main uppercase">
                            {student.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-main">{student.user.name}</p>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{student.class?.name}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => handleMark(student.id, 'STUDENT', 'Present')}
                            className={`p-2 rounded-lg border transition-all ${record?.status === 'Present' ? 'bg-success-theme text-white border-success-theme' : 'bg-white text-text-muted border-border-theme hover:border-success-theme'}`}
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleMark(student.id, 'STUDENT', 'Absent')}
                            className={`p-2 rounded-lg border transition-all ${record?.status === 'Absent' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-text-muted border-border-theme hover:border-red-500'}`}
                          >
                            <X size={18} />
                          </button>
                       </div>
                    </div>
                  )
                })}
             </div>
          </section>

          <section className="bg-white rounded-xl border border-border-theme shadow-sm">
             <div className="p-6 border-b border-border-theme flex justify-between items-center">
                <h3 className="font-bold text-sm text-text-main uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  Faculty Presence
                </h3>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">{teachers.length} Faculty Syncs</span>
             </div>
             <div className="divide-y divide-border-theme max-h-[600px] overflow-y-auto custom-scrollbar">
                {teachers.map((teacher: any) => {
                  const record = attendance.find((a: any) => a.entityId === teacher.id && a.date === today);
                  return (
                    <div key={teacher.id} className="p-4 flex items-center justify-between hover:bg-bg transition-colors">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-black text-xs uppercase">
                            {teacher.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-main">{teacher.user.name}</p>
                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest">{teacher.department?.name}</p>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => handleMark(teacher.id, 'TEACHER', 'Present')}
                            className={`p-2 rounded-lg border transition-all ${record?.status === 'Present' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-text-muted border-border-theme hover:border-indigo-600'}`}
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleMark(teacher.id, 'TEACHER', 'Absent')}
                            className={`p-2 rounded-lg border transition-all ${record?.status === 'Absent' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-text-muted border-border-theme hover:border-red-500'}`}
                          >
                            <X size={18} />
                          </button>
                       </div>
                    </div>
                  )
                })}
             </div>
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-border-theme flex items-center gap-5 shadow-sm">
              <div className="w-12 h-12 bg-success-theme/10 text-success-theme rounded-xl flex items-center justify-center border border-success-theme/20 shadow-inner">
                 <UserCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Telemetry: Verified</p>
                <h3 className="text-xl font-bold text-text-main leading-tight">{attendance.filter((a: any) => a.status === 'Present').length} Units</h3>
              </div>
            </div>
            {/* Other Stats */}
          </div>

          <div className="bg-white rounded-xl border border-border-theme overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="bg-bg text-[11px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                    <th className="px-8 py-5">Verified Participant</th>
                    <th className="px-8 py-5">Node Entry Time</th>
                    <th className="px-8 py-5">Presence Status</th>
                    <th className="px-8 py-5">Entity Classification</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-theme">
                  {attendance.map((record: any) => (
                    <tr key={record.id} className="hover:bg-[#f8fafc] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-bg border border-border-theme flex items-center justify-center font-bold text-[10px] text-text-muted uppercase">
                             {record.entity?.name?.charAt(0)}
                           </div>
                           <div>
                            <p className="font-bold text-text-main truncate text-sm">{record.entity?.name}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <CalendarDays size={14} className="text-primary opacity-60" />
                           <span className="text-xs font-bold text-text-main tabular-nums">{record.date}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                          record.status === 'Present' ? 'bg-success-theme/10 text-success-theme' : 'bg-red-50 text-red-600'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs text-text-muted font-black uppercase tracking-widest opacity-60">{record.entityType}</td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-text-muted hover:text-text-main transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
