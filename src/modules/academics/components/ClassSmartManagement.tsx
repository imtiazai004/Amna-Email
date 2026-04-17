import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings2, 
  CalendarRange, 
  Upload, 
  CheckCircle2, 
  MoreVertical,
  Users,
  Search,
  BookOpen,
  Plus,
  Clock,
  UserCheck,
  UserX,
  AlertCircle,
  ArrowUpRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useClasses } from '../hooks/useClasses';
import { useStudents } from '../hooks/useStudents';
import { useTeachers } from '@/modules/staff/hooks/useTeachers';
import { useAttendance } from '@/modules/staff/hooks/useAttendance';
import { Modal } from '@/components/ui/Modal';
import { useNavigate } from 'react-router-dom';

type Tab = 'overview' | 'manage' | 'attendance' | 'schedule' | 'import';

export const ClassSmartManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { classes, schedules, isLoading, bulkImport, isImporting, createClass, isCreating } = useClasses();
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { attendance, markAttendance, isMarking } = useAttendance();
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Manual Sync (Create Class) State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', grade: '', section: '', teacherId: '' });

  // Attendance Marking State
  const [markingClassId, setMarkingClassId] = useState<string | null>(null);

  const handleBulkImport = () => {
    try {
      const parsed = JSON.parse(importText);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      bulkImport(data, {
        onSuccess: (res: any) => {
          setImportStatus(`Successfully synchronized ${res.count} class identities across network.`);
          setImportText('');
          setTimeout(() => setImportStatus(null), 5000);
        }
      });
    } catch (e) {
      alert('Invalid JSON structure. Please verify schema.');
    }
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.name || !newClass.grade) return;
    createClass(newClass, {
      onSuccess: () => {
        setShowCreateModal(false);
        setNewClass({ name: '', grade: '', section: '', teacherId: '' });
      }
    });
  };

  const handleMarkAttendance = (studentId: string, status: string) => {
    markAttendance({
      entityId: studentId,
      entityType: 'STUDENT',
      status: status
    });
  };

  if (isLoading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'manage', name: 'Manage Classes', icon: Settings2 },
    { id: 'attendance', name: 'Attendance Hub', icon: CheckCircle2 },
    { id: 'schedule', name: 'Schedule', icon: CalendarRange },
    { id: 'import', name: 'Bulk Import', icon: Upload },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border-theme shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Classes Smart Management</h1>
          <p className="text-text-muted text-sm font-medium">Global academic infrastructure & scheduling telemetry</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-bg border border-border-theme rounded-xl overflow-x-auto max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab.id 
                  ? "bg-text-main text-white shadow-md shadow-text-main/20" 
                  : "text-text-muted hover:text-text-main hover:bg-white"
              )}
            >
              <tab.icon size={14} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Tab Content Engine */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Network Capacity</p>
                  <h3 className="text-3xl font-bold text-text-main">{classes.length} Synchronized Units</h3>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-success-theme font-bold">
                     <span className="w-1.5 h-1.5 bg-success-theme rounded-full animate-pulse" />
                     Central Ledger Active
                  </div>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Global Enrollment</p>
                  <h3 className="text-3xl font-bold text-text-main">{students.length} Total Students</h3>
                  <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-widest">Linked Identities</p>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Scheduling Density</p>
                  <h3 className="text-3xl font-bold text-text-main">{schedules.length} Session Nodes</h3>
                  <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest leading-none">Weekly Sync</p>
               </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-theme p-6 shadow-sm overflow-hidden">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-theme">
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Real-time Class Telemetry</h3>
                  <button 
                    onClick={() => setActiveTab('manage')}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Manage Detailed Infrastructure
                  </button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {classes.map((c: any) => (
                    <div key={c.id} className="p-4 bg-bg border border-border-theme rounded-xl hover:border-primary/40 transition-all group">
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">{c.grade}</p>
                       <h4 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{c.name}</h4>
                       <div className="mt-4 flex items-center gap-2">
                          <Users size={14} className="text-text-muted" />
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{c.studentCount} Students</span>
                       </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setShowCreateModal(true)}
                    className="p-4 border-2 border-dashed border-border-theme rounded-xl flex flex-col items-center justify-center gap-2 text-text-muted hover:text-primary hover:border-primary/40 transition-all bg-bg/50"
                  >
                    <Plus size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">New Unit</span>
                  </button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white rounded-2xl border border-border-theme overflow-hidden shadow-sm">
            <div className="p-4 border-b border-border-theme bg-bg/50 flex flex-col md:flex-row gap-4 items-center justify-between">
               <div className="flex items-center gap-3 bg-white border border-border-theme px-4 py-2 rounded-lg text-text-muted w-full sm:w-80 shadow-inner">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="QUERY MASTER CLASSES..." 
                    className="bg-transparent border-none focus:outline-none text-text-main text-[10px] w-full font-black uppercase tracking-widest" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <button 
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 bg-text-main text-white px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:opacity-95 transition-all"
               >
                  <Plus size={16} />
                  Initialize Manual Sync
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                        <th className="px-8 py-5">Class Designation</th>
                        <th className="px-8 py-5">Academic Level</th>
                        <th className="px-8 py-5">Assigned Faculty</th>
                        <th className="px-8 py-5">Population</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme tabular-nums">
                     {classes.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.grade.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-8 py-20 text-center">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">No classes synchronized. Use manual sync or bulk import.</p>
                         </td>
                       </tr>
                     ) : classes.filter((c: any) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.grade.toLowerCase().includes(searchQuery.toLowerCase())).map((c: any) => (
                       <tr key={c.id} className="hover:bg-bg/50 transition-colors group">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-black text-xs border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                                   {c.id.toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-text-main">{c.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-xs font-black uppercase tracking-widest text-text-muted">{c.section} • Grade {c.grade}</td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-bg rounded-md flex items-center justify-center text-[10px] font-black border border-border-theme">
                                   {c.teacher?.name?.charAt(0) || '?'}
                                </div>
                                <span className="text-xs font-bold text-text-main">{c.teacher?.name || 'Unassigned'}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <div className="w-full bg-bg h-1.5 rounded-full overflow-hidden border border-border-theme inline-block w-24">
                                   <div className="bg-primary h-full" style={{ width: `${Math.min((c.studentCount / 40) * 100, 100)}%` }} />
                                </div>
                                <span className="text-[10px] font-black text-text-muted">{c.studentCount}/40</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2 text-text-muted hover:text-text-main rounded-lg transition-colors">
                                <MoreVertical size={18} />
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 bg-white rounded-2xl border border-border-theme shadow-sm p-6 space-y-4">
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-2">Class Selector</h3>
                  <div className="space-y-2">
                    {classes.map((c: any) => {
                      const classStudents = students.filter((s: any) => s.classId === c.id);
                      const today = new Date().toISOString().split('T')[0];
                      const presentCount = attendance.filter((a: any) => 
                        a.entityType === 'STUDENT' && 
                        a.date === today && 
                        a.status === 'Present' &&
                        classStudents.some((s: any) => s.id === a.entityId)
                      ).length;

                      return (
                        <button 
                          key={c.id} 
                          onClick={() => setMarkingClassId(c.id)}
                          className={cn(
                            "w-full p-4 border rounded-2xl flex items-center justify-between transition-all text-left",
                            markingClassId === c.id 
                              ? "bg-primary/5 border-primary shadow-sm" 
                              : "bg-bg border-border-theme hover:border-primary/40"
                          )}
                        >
                           <div>
                              <h4 className={cn("font-bold uppercase tracking-tight", markingClassId === c.id ? "text-primary" : "text-text-main")}>{c.name}</h4>
                              <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">Section {c.section}</p>
                           </div>
                           <div className="text-right">
                              <span className="text-lg font-black text-text-main tabular-nums block">{presentCount}/{c.studentCount}</span>
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Attending Today</span>
                           </div>
                        </button>
                      )
                    })}
                  </div>
               </div>

               <div className="lg:col-span-2 bg-white rounded-2xl border border-border-theme shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  <div className="p-6 border-b border-border-theme flex justify-between items-center bg-bg/20">
                     <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">
                        {markingClassId ? `Attendance marking: ${classes.find(c => c.id === markingClassId)?.name}` : 'Select a class to mark attendance'}
                     </h3>
                     {markingClassId && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-text-muted uppercase tracking-widest">
                           <Clock size={14} />
                           {new Date().toLocaleDateString()}
                        </div>
                     )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6">
                     {!markingClassId ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                           <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center text-text-muted">
                              <BookOpen size={32} />
                           </div>
                           <p className="text-xs font-bold uppercase tracking-widest text-text-muted">Awaiting class selection for telemetry injection</p>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {students.filter(s => s.classId === markingClassId).map((s: any) => {
                              const today = new Date().toISOString().split('T')[0];
                              const record = attendance.find(a => a.entityId === s.id && a.date === today);
                              
                              return (
                                 <div key={s.id} className="p-4 bg-bg border border-border-theme rounded-xl flex items-center justify-between group hover:bg-white transition-all">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-white border border-border-theme flex items-center justify-center font-black text-[10px] uppercase">
                                          {s.user?.name?.charAt(0)}
                                       </div>
                                       <div>
                                          <p className="text-xs font-bold text-text-main">{s.user?.name}</p>
                                          <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">#{s.id.toUpperCase()}</p>
                                       </div>
                                    </div>
                                    <div className="flex gap-2">
                                       <button 
                                          onClick={() => handleMarkAttendance(s.id, 'Present')}
                                          className={cn(
                                             "p-2 rounded-lg transition-all",
                                             record?.status === 'Present' 
                                                ? "bg-success-theme text-white" 
                                                : "bg-white text-text-muted hover:text-success-theme border border-border-theme"
                                          )}
                                       >
                                          <UserCheck size={16} />
                                       </button>
                                       <button 
                                          onClick={() => handleMarkAttendance(s.id, 'Absent')}
                                          className={cn(
                                             "p-2 rounded-lg transition-all",
                                             record?.status === 'Absent' 
                                                ? "bg-red-600 text-white" 
                                                : "bg-white text-text-muted hover:text-red-600 border border-border-theme"
                                          )}
                                       >
                                          <UserX size={16} />
                                       </button>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     )}
                  </div>
                  {markingClassId && (
                     <div className="p-4 border-t border-border-theme bg-bg/20 flex justify-between items-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest italic">Changes are instantly synchronized to Guardian and Staff portals.</p>
                        {isMarking && <span className="text-[10px] font-black text-primary animate-pulse uppercase tracking-widest">Syncing...</span>}
                     </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-2xl border border-border-theme shadow-sm overflow-hidden">
             <div className="p-6 border-b border-border-theme bg-bg/50">
                <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Weekly Academic Node Grid</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-5 divide-x divide-border-theme min-h-[600px] overflow-x-auto">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                  <div key={day} className="flex flex-col min-w-[200px]">
                     <div className="p-4 bg-bg text-center border-b border-border-theme text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">{day}</div>
                     <div className="p-3 space-y-3">
                        {schedules.filter((s: any) => s.day === day).length === 0 ? (
                           <div className="p-8 text-center opacity-20 flex flex-col items-center">
                              <CalendarRange size={20} className="mb-2" />
                              <span className="text-[8px] font-black uppercase tracking-widest">No Class Node</span>
                           </div>
                        ) : schedules.filter((s: any) => s.day === day).map((s: any) => (
                           <div key={s.id} className="p-4 bg-white border border-border-theme rounded-xl shadow-sm hover:border-primary transition-all group overflow-hidden relative">
                              <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 -mr-4 -mt-4 rounded-full group-hover:bg-primary/10 transition-colors" />
                              <div className="flex items-center gap-2 mb-3">
                                 <BookOpen size={12} className="text-primary" />
                                 <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">{s.subject?.name}</span>
                              </div>
                              <h5 className="font-black text-sm text-text-main leading-tight mb-2">{s.class?.name}</h5>
                              <div className="space-y-1.5 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all">
                                 <div className="flex items-center gap-2 text-[9px] font-bold text-text-muted uppercase tracking-widest">
                                    <Clock size={12} />
                                    {s.startTime} - {s.endTime}
                                 </div>
                                 <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">RM: {s.room}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'import' && (
          <div className="max-w-3xl mx-auto space-y-8">
             <div className="bg-white p-8 rounded-2xl border border-border-theme shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/10 text-primary rounded-xl">
                      <Upload size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-bold text-text-main uppercase tracking-widest">Bulk Sync Identity Engine</h3>
                      <p className="text-text-muted text-xs font-medium">Inject class metadata directly into the master SaaS infrastructure</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">JSON Schema Definition</label>
                      <button 
                        onClick={() => setImportText('[{"name":"Class 11-B","grade":"11th","section":"B","teacherId":"t1"}]')}
                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                      >
                         Load Sample Schema
                      </button>
                   </div>
                   <textarea 
                     className="w-full h-64 bg-bg border border-border-theme rounded-xl p-5 font-mono text-xs focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:opacity-30 shadow-inner"
                     placeholder='[{"name":"...", "grade":"...", "section":"...", "teacherId":"..."}]'
                     value={importText}
                     onChange={(e) => setImportText(e.target.value)}
                   />
                </div>

                <button 
                  onClick={handleBulkImport}
                  disabled={isImporting || !importText}
                  className="w-full bg-text-main text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-text-main/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {isImporting ? 'SYNCHRONIZING TELEMETRY...' : 'UNIFY TO MASTER DATABASE'}
                </button>

                {importStatus && (
                   <motion.div 
                     initial={{ opacity: 0, x: -10 }} 
                     animate={{ opacity: 1, x: 0 }}
                     className="p-4 bg-success-theme/10 border border-success-theme/20 rounded-xl flex items-center gap-3 text-success-theme"
                   >
                      <CheckCircle2 size={18} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{importStatus}</span>
                   </motion.div>
                )}
             </div>

             <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex gap-4 items-start">
                <AlertCircle size={20} className="text-indigo-500 shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Relational Integrity Guard</h4>
                  <p className="text-xs text-indigo-600/80 font-medium leading-relaxed italic">
                    Bulk imports validate "teacherId" against faculty units. Ensure unique "name" values for optimal cross-portal mapping. 1% network latency expected during master sync.
                  </p>
                </div>
             </div>
          </div>
        )}
      </motion.div>

      {/* Persistent Academic Action Bar (Global Sync) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 bg-white border border-border-theme rounded-2xl shadow-2xl z-[40]">
         <div className="px-4 border-r border-border-theme/50 hidden md:block">
            <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] leading-none">Student Governance</p>
         </div>
         <button 
           onClick={() => navigate('/academics/students?action=admission')}
           className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
         >
            <Plus size={14} />
            Admission
         </button>
         <button 
           onClick={() => navigate('/academics/students?action=promote')}
           className="flex items-center gap-2 px-6 py-3 bg-bg text-text-main text-[10px] font-black uppercase tracking-widest rounded-xl border border-border-theme hover:bg-white transition-all"
         >
            <ArrowUpRight size={14} className="text-primary" />
            Promote
         </button>
         <button 
           onClick={() => navigate('/academics/students?action=withdraw')}
           className="flex items-center gap-2 px-6 py-3 bg-bg text-text-main text-[10px] font-black uppercase tracking-widest rounded-xl border border-border-theme hover:text-red-600 transition-all"
         >
            <X size={14} className="text-red-600" />
            Withdraw
         </button>
      </div>

      {/* Manual Creation Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Initialize Manual Class Sync"
      >
        <form onSubmit={handleCreateClass} className="space-y-4">
           <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Class Designation</label>
              <input 
                 required
                 type="text" 
                 placeholder="e.g. Class 12-C"
                 className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                 value={newClass.name}
                 onChange={e => setNewClass({...newClass, name: e.target.value})}
              />
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Academic Grade</label>
                 <select 
                    required
                    className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={newClass.grade}
                    onChange={e => setNewClass({...newClass, grade: e.target.value})}
                 >
                    <option value="">Select Level</option>
                    {['9th', '10th', '11th', '12th'].map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                 </select>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Section</label>
                 <input 
                    type="text" 
                    placeholder="A, B, C..."
                    className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={newClass.section}
                    onChange={e => setNewClass({...newClass, section: e.target.value})}
                 />
              </div>
           </div>
           <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Assigned Faculty (Master Node)</label>
              <select 
                 className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                 value={newClass.teacherId}
                 onChange={e => setNewClass({...newClass, teacherId: e.target.value})}
              >
                 <option value="">Unassigned</option>
                 {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.user?.name} - {t.department?.name}</option>
                 ))}
              </select>
           </div>
           
           <div className="pt-4">
              <button 
                 type="submit"
                 disabled={isCreating}
                 className="w-full bg-text-main text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-text-main/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                 {isCreating ? 'SYNCING UNIT...' : 'INITIALIZE ACADEMIC UNIT'}
              </button>
           </div>
        </form>
      </Modal>
    </div>
  );
};
