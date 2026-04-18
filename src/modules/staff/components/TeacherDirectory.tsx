import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MoreVertical, 
  UserCircle2, 
  BadgeCheck, 
  Clock, 
  Building2,
  ListFilter,
  Grid,
  List as ListIcon,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTeachers } from '../hooks/useTeachers';
import { useQuery } from '@tanstack/react-query';
import { AcademicService } from '@/lib/api';

type ViewMode = 'grid' | 'list';

export const TeacherDirectory = () => {
  const { teachers, isLoading } = useTeachers();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: AcademicService.getDepartments,
  });

  const filteredTeachers = teachers.filter((t: any) => {
    const matchesSearch = t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || t.departmentId === selectedDept;
    const matchesStatus = selectedStatus === 'all' || t.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  if (isLoading) return (
    <div className="flex justify-center p-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="space-y-6 pb-20">
      {/* Header & Advanced Search Block */}
      <header className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm sticky top-0 z-10 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Teacher Directory</h1>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Institutional Faculty Ledger & Status Telemetry</p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-bg border border-border-theme rounded-xl">
             <button 
               onClick={() => setViewMode('grid')}
               className={cn(
                 "p-2 rounded-lg transition-all",
                 viewMode === 'grid' ? "bg-white shadow-sm text-indigo-900" : "text-text-muted hover:text-indigo-900"
               )}
             >
               <Grid size={18} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={cn(
                 "p-2 rounded-lg transition-all",
                 viewMode === 'list' ? "bg-white shadow-sm text-indigo-900" : "text-text-muted hover:text-indigo-900"
               )}
             >
               <ListIcon size={18} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search by faculty name or email..."
              className="w-full bg-bg border border-border-theme pl-12 pr-4 py-3 rounded-xl text-xs font-bold text-text-main uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all placeholder:text-text-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <select 
              className="w-full bg-bg border border-border-theme px-4 py-3 rounded-xl text-xs font-bold text-text-main uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((d: any) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <select 
              className="w-full bg-bg border border-border-theme px-4 py-3 rounded-xl text-xs font-bold text-text-main uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Any Status</option>
              <option value="Available">Available</option>
              <option value="In Class">In Class</option>
              <option value="Out of Campus">Out of Campus</option>
            </select>
          </div>
          <div className="md:col-span-1 flex items-center justify-end">
            <button className="p-3 bg-bg border border-border-theme rounded-xl text-text-muted hover:text-indigo-900 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Directory Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${selectedDept}-${selectedStatus}-${searchQuery}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher: any) => (
                <div key={teacher.id} className="bg-white rounded-2xl border border-border-theme overflow-hidden shadow-sm group hover:border-indigo-600/40 transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-indigo-100 border-2 border-white rounded-2xl flex items-center justify-center font-black text-xl text-indigo-700 shadow-sm relative overflow-hidden group-hover:bg-indigo-900 group-hover:text-white transition-all">
                          {teacher.avatar}
                        </div>
                        <div className={cn(
                          "absolute -right-1 -bottom-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
                          teacher.status === 'Available' ? "bg-success-theme" : "bg-warning-theme"
                        )}>
                          <Circle size={8} fill="currentColor" className="text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Mastery Index</span>
                        <span className="text-sm font-bold text-indigo-900">QA-94.2</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-black text-text-main uppercase tracking-tight group-hover:text-indigo-900 transition-colors">{teacher.user.name}</h3>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-1.5 italic">
                        <Building2 size={12} className="text-indigo-400" />
                        {teacher.department?.name || 'Departmental Node'}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border-theme grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Assignment ID</span>
                        <p className="text-[10px] font-bold text-text-main">{teacher.id.toUpperCase()}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Faculty Role</span>
                        <p className="text-[10px] font-bold text-text-main uppercase leading-tight">{teacher.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg/50 px-6 py-4 flex items-center justify-between border-t border-border-theme">
                    <div className="flex gap-2">
                       <button className="p-2 bg-white text-text-muted hover:text-indigo-900 rounded-lg border border-border-theme transition-all shadow-sm">
                         <Mail size={14} />
                       </button>
                       <button className="p-2 bg-white text-text-muted hover:text-indigo-900 rounded-lg border border-border-theme transition-all shadow-sm">
                         <Phone size={14} />
                       </button>
                    </div>
                    <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 hover:underline">
                      View Dossier
                      <BadgeCheck size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border-theme shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                       <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                          <th className="px-8 py-5">Faculty Entity</th>
                          <th className="px-8 py-5">Academic Domain</th>
                          <th className="px-8 py-5">Assignment Role</th>
                          <th className="px-8 py-5">Status Telemetry</th>
                          <th className="px-8 py-5 text-right whitespace-nowrap">Command Unit</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-theme">
                       {filteredTeachers.map((teacher: any) => (
                        <tr key={teacher.id} className="hover:bg-indigo-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-indigo-900/5 border border-indigo-900/10 text-indigo-900 rounded-xl flex items-center justify-center font-black text-[10px] group-hover:bg-indigo-900 group-hover:text-white transition-all">
                                    {teacher.avatar}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-text-main">{teacher.user.name}</p>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">{teacher.user.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="px-2.5 py-1 bg-bg text-text-muted border border-border-theme rounded-lg text-[10px] font-black uppercase tracking-widest italic">
                                 {teacher.department?.name}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-[10px] font-black text-text-main uppercase tracking-widest">{teacher.role}</td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2">
                                 <div className={cn(
                                   "w-2 h-2 rounded-full",
                                   teacher.status === 'Available' ? "bg-success-theme shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-warning-theme shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                                 )} />
                                 <span className="text-[10px] font-black text-text-main uppercase tracking-widest">{teacher.status}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2 text-text-muted hover:text-indigo-900 hover:bg-bg rounded-lg transition-all">
                                 <MoreVertical size={16} />
                              </button>
                           </td>
                        </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          )}

          {filteredTeachers.length === 0 && (
            <div className="py-20 bg-white rounded-3xl border-2 border-dashed border-border-theme flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-bg text-text-muted rounded-full flex items-center justify-center mb-6">
                 <UserCircle2 size={32} />
               </div>
               <h3 className="text-sm font-black text-text-main uppercase tracking-[0.2em]">Zero Faculty Resonate</h3>
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">Adjust search criteria to stabilize the directory stream.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
