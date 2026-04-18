import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Building2, 
  BookOpen, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  MonitorCheck,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTeachers } from '../hooks/useTeachers';
import { useSchedules } from '../hooks/useSchedules';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

export const TeacherSchedule = () => {
  const { teachers, isLoading: loadingTeachers } = useTeachers();
  const { schedules, isLoading: loadingSchedules } = useSchedules();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  const teacherSchedules = schedules.filter((s: any) => 
    selectedTeacherId ? s.teacherId === selectedTeacherId : true
  );

  const getSchedulesForSlot = (day: string, time: string) => {
    return teacherSchedules.filter((s: any) => {
      return s.day === day && s.startTime.startsWith(time.split(':')[0]);
    });
  };

  if (loadingTeachers || loadingSchedules) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Control Navigation Plate */}
      <header className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sticky top-0 z-20">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900 leading-none">Faculty Timetable Matrix</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-2">Synchronized Academic Resource Scheduling System</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={14} />
            <select 
              className="w-full md:w-64 bg-bg border border-border-theme pl-10 pr-4 py-2.5 rounded-xl text-xs font-bold text-text-main uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all cursor-pointer"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
            >
              <option value="">Global Faculty Overview</option>
              {teachers.map((t: any) => (
                <option key={t.id} value={t.id}>{t.user.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-1 p-1 bg-bg border border-border-theme rounded-xl">
            <button className="p-2 text-text-muted hover:text-indigo-900 rounded-lg hover:bg-white transition-all">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-[10px] font-black text-text-main uppercase tracking-widest">Active Term</span>
            <button className="p-2 text-text-muted hover:text-indigo-900 rounded-lg hover:bg-white transition-all">
              <ChevronRight size={16} />
            </button>
          </div>

          <button className="p-2.5 bg-indigo-900 text-white rounded-xl shadow-lg shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all">
             <CalendarDays size={18} />
          </button>
        </div>
      </header>

      {/* Grid Architecture */}
      <div className="bg-white rounded-3xl border border-border-theme shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Time Axis (Column) */}
        <div className="w-20 bg-bg/30 border-r border-border-theme flex flex-col">
          <div className="h-16 border-b border-border-theme flex items-center justify-center">
            <Clock size={16} className="text-text-muted/40" />
          </div>
          {TIME_SLOTS.map(time => (
            <div key={time} className="flex-1 flex items-start justify-center pt-4 border-b border-border-theme/30 group">
              <span className="text-[10px] font-black text-text-muted/60 uppercase group-hover:text-indigo-600 transition-colors">
                {time}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Main Grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="min-w-[800px] h-full flex">
            {DAYS.map(day => (
              <div key={day} className="flex-1 flex flex-col border-r border-border-theme last:border-r-0">
                {/* Day Header */}
                <div className="h-16 flex flex-col items-center justify-center border-b border-border-theme bg-bg/10">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{day.substring(0, 3)}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-border-theme mt-1" />
                </div>

                {/* Grid Cells */}
                <div className="flex-1 relative">
                  {TIME_SLOTS.map(time => (
                    <div key={`${day}-${time}`} className="h-[calc(100%/9)] border-b border-border-theme/30 last:border-b-0 relative group">
                      <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-[0.02] transition-opacity" />
                      
                      {/* Class Slots Mapping */}
                      <div className="p-1 h-full space-y-1 overflow-hidden relative z-10">
                        {getSchedulesForSlot(day, time).map((s: any) => (
                          <motion.div
                            key={s.id}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="h-full bg-indigo-50 border-l-4 border-indigo-600 p-2 rounded-r-lg shadow-sm flex flex-col justify-between group/card hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                          >
                            <div className="space-y-0.5">
                              <h4 className="text-[10px] font-black uppercase tracking-tight leading-tight group-hover/card:text-white transition-colors">
                                {s.subject?.name}
                              </h4>
                              <p className="text-[9px] font-bold text-indigo-600 group-hover/card:text-indigo-100 uppercase tracking-widest leading-none">
                                {s.class?.name}
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1 text-[8px] font-black uppercase opacity-60">
                                <Building2 size={10} />
                                {s.room}
                              </div>
                              <span className="text-[8px] font-black uppercase bg-white/40 px-1.5 py-0.5 rounded group-hover/card:bg-indigo-900/30">
                                Live
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Sidebar (Right) */}
        <div className="w-full md:w-64 bg-bg/20 border-l border-border-theme p-6 space-y-8 hidden lg:block">
           <div className="space-y-4">
              <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                 <MonitorCheck size={16} className="text-success-theme" />
                 Telemetry Status
              </h3>
              <div className="p-4 bg-white rounded-2xl border border-border-theme space-y-4 shadow-sm">
                 <div>
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Active Conflicts</span>
                    <p className="text-sm font-bold text-indigo-900 tabular-nums">Zero-None</p>
                 </div>
                 <div className="pt-4 border-t border-border-theme">
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Load Density</span>
                    <div className="mt-2 h-1.5 bg-bg rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-600" style={{ width: '64%' }} />
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                 <Filter size={16} className="text-indigo-400" />
                 Contextual Filter
              </h3>
              <div className="space-y-3">
                 {['Theory', 'Laboratory', 'Evaluation'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                       <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border-theme text-indigo-600 focus:ring-indigo-600/10" />
                       <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest group-hover:text-text-main transition-colors">{type}</span>
                    </label>
                 ))}
              </div>
           </div>

           <div className="p-4 bg-indigo-900 rounded-2xl text-white shadow-xl shadow-indigo-900/20 text-center space-y-2">
              <BookOpen size={24} className="mx-auto text-indigo-300" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Academic Node Sync</p>
              <p className="text-[9px] opacity-60 font-medium uppercase leading-tight italic">All timestamps are normalized to master UTC.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
