import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Clock, 
  Layout, 
  LineChart, 
  PlusCircle, 
  Download, 
  Search, 
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Filter,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { useExams } from '../hooks/useExams';
import { useQuery } from '@tanstack/react-query';
import { AcademicService } from '@/lib/api';

type Tab = 'overview' | 'view-results' | 'enter-results' | 'schedule';

export const ExaminationCenter = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { students } = useStudents();
  const { classes } = useClasses();
  const { exams, results, stats, isLoading, submitResults, isSubmitting } = useExams();
  
  const subjectsQuery = useQuery({
    queryKey: ['subjects'],
    queryFn: AcademicService.getSubjects,
  });
  const subjects = subjectsQuery.data || [];

  // Filtering System
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  // Result Entry State
  const [entryData, setEntryData] = useState<Record<string, number>>({});

  const handleDownload = () => {
    const csvContent = "Examinee,Class,Subject,Mastery Index,Status\n" + 
      results.map((r: any) => `${r.studentUser?.name},${r.student?.class?.name || 'N/A'},${r.subject?.name},${r.marks}%,Certified`).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'master_grading_ledger.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmitResults = () => {
    if (!selectedExam || !selectedSubject) {
      alert("Please select Examination Node and Academic Subject.");
      return;
    }
    const resultsToSubmit = Object.entries(entryData).map(([studentId, marks]) => ({
      studentId,
      examId: selectedExam,
      subjectId: selectedSubject,
      marks
    }));
    
    if (resultsToSubmit.length === 0) return;

    submitResults(resultsToSubmit, {
      onSuccess: () => {
        setEntryData({});
        setActiveTab('view-results');
      }
    });
  };

  if (isLoading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;

  const tabs = [
    { id: 'overview', name: 'Telemetry Overview', icon: Layout },
    { id: 'view-results', name: 'Master Results Ledger', icon: BookOpen },
    { id: 'enter-results', name: 'Synchronize Marks', icon: PlusCircle },
    { id: 'schedule', name: 'Evaluation Registry', icon: Clock },
  ];

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border-theme shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Assessment Intelligence</h1>
          <p className="text-text-muted text-sm font-medium uppercase tracking-widest text-[10px]">Unified grading logic & performance telemetry hub</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-bg border border-border-theme rounded-xl overflow-x-auto max-w-full">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as Tab)}
               className={cn(
                 "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                 activeTab === tab.id 
                   ? "bg-indigo-900 text-white shadow-md shadow-indigo-900/20" 
                   : "text-text-muted hover:text-indigo-900 hover:bg-white"
               )}
             >
               <tab.icon size={14} />
               <span>{tab.name}</span>
             </button>
           ))}
        </div>
      </header>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Mean Sync Score</p>
                  <h3 className="text-3xl font-bold text-indigo-900">{stats.avgScore}%</h3>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-success-theme font-bold">
                     <TrendingUp size={12} />
                     Mastery Index Alpha
                  </div>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Global Proficiency</p>
                  <h3 className="text-3xl font-bold text-indigo-900">{stats.passRate}</h3>
                  <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-widest leading-none">Grading Consistency</p>
               </div>
               <div className="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl shadow-indigo-900/10">
                  <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Graded Terminals</p>
                  <h3 className="text-3xl font-bold">{stats.totalGraded} Nodes</h3>
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold">
                     <CheckCircle2 size={12} className="text-indigo-300" />
                     Real-time Validated
                  </div>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-border-theme shadow-sm">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Analytical Deviation</p>
                  <h3 className="text-3xl font-bold text-indigo-900">0.42%</h3>
                  <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest leading-none">Precision Active</p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-2xl border border-border-theme shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-border-theme flex justify-between items-center bg-bg/20">
                     <h3 className="text-sm font-bold text-text-main uppercase tracking-widest flex items-center gap-2">
                        <LineChart size={18} className="text-indigo-600" />
                        Intelligence Assessment Stream
                     </h3>
                     <button 
                       onClick={handleDownload}
                       className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                     >
                        <Download size={14} />
                        Export Ledger
                     </button>
                  </div>
                  <div className="p-6">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {results.slice(0, 4).map((r: any) => (
                           <div key={r.id} className="p-4 bg-bg border border-border-theme rounded-xl flex items-center justify-between group hover:bg-white transition-all">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white flex items-center justify-center font-black text-[10px]">
                                    {r.studentUser?.name?.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="text-xs font-bold text-text-main group-hover:text-indigo-900 transition-colors uppercase tracking-tight">{r.studentUser?.name}</h4>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">{r.subject?.name} • NODE {r.gradingNode}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <span className="text-sm font-black text-indigo-900 tabular-nums">{r.marks}%</span>
                                 <div className="w-16 h-1 bg-indigo-100 rounded-full mt-1 overflow-hidden">
                                    <div className="h-full bg-indigo-600" style={{ width: `${r.marks}%` }} />
                                 </div>
                              </div>
                           </div>
                        ))}
                        {results.length === 0 && (
                           <div className="col-span-2 py-12 text-center opacity-30 italic text-xs font-bold uppercase tracking-widest">Awaiting assessment telemetry...</div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-border-theme p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-widest mb-6">Upcoming Sync Nodes</h3>
                  <div className="space-y-4">
                    {exams.filter(e => e.status === 'Upcoming').map((e: any) => (
                      <div key={e.id} className="flex gap-4 p-4 bg-bg border border-border-theme rounded-2xl group hover:border-indigo-600/40 transition-all">
                        <div className="w-12 h-12 bg-white border border-border-theme rounded-xl flex flex-col items-center justify-center shadow-sm">
                           <span className="text-[9px] font-black text-indigo-600 uppercase mb-0.5">{new Date(e.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                           <span className="text-lg font-bold leading-none text-indigo-900">{new Date(e.date).getDate()}</span>
                        </div>
                        <div>
                           <h4 className="text-[11px] font-black text-text-main uppercase tracking-tight group-hover:text-indigo-900 transition-colors">{e.name}</h4>
                           <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-1 flex items-center gap-1 leading-none">
                             <TrendingUp size={10} className="text-indigo-400" />
                             Grading Window Open
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'view-results' && (
          <div className="bg-white rounded-2xl border border-border-theme shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
             <div className="p-4 border-b border-border-theme bg-bg/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 w-full md:w-auto">
                   <select 
                     className="bg-white border border-border-theme px-4 py-2 rounded-lg text-text-main text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
                     value={selectedExam}
                     onChange={(e) => setSelectedExam(e.target.value)}
                   >
                      <option value="">Examination Mode</option>
                      {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                   </select>
                   <select 
                     className="bg-white border border-border-theme px-4 py-2 rounded-lg text-text-main text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
                     value={selectedSubject}
                     onChange={(e) => setSelectedSubject(e.target.value)}
                   >
                      <option value="">Academic Subject</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                </div>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                   <Download size={16} />
                   Download Master Result
                </button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                     <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                        <th className="px-8 py-5">Examinee Entity</th>
                        <th className="px-8 py-5">Assessment Node</th>
                        <th className="px-8 py-5">Academic Domain</th>
                        <th className="px-8 py-5">Mastery Index</th>
                        <th className="px-8 py-5 text-right whitespace-nowrap">Node Validation</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border-theme tabular-nums">
                     {results.filter(r => (selectedExam ? r.examId === selectedExam : true) && (selectedSubject ? r.subjectId === selectedSubject : true)).length === 0 ? (
                        <tr>
                           <td colSpan={5} className="px-8 py-20 text-center opacity-40 font-black uppercase text-[10px] tracking-[0.3em]">No assessment telemetry found for current query.</td>
                        </tr>
                     ) : results.filter(r => (selectedExam ? r.examId === selectedExam : true) && (selectedSubject ? r.subjectId === selectedSubject : true)).map((r:any) => (
                        <tr key={r.id} className="hover:bg-indigo-50/50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 bg-indigo-900/5 border border-indigo-900/10 text-indigo-900 rounded-lg flex items-center justify-center font-black text-[10px] group-hover:bg-indigo-900 group-hover:text-white transition-all">
                                    {r.studentUser?.name?.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-text-main">{r.studentUser?.name}</p>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">#{r.studentId.toUpperCase()}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-xs font-black uppercase tracking-widest text-text-muted">{r.exam?.name}</td>
                           <td className="px-8 py-6">
                              <span className="px-2 py-0.5 bg-bg text-text-muted border border-border-theme rounded text-[9px] font-black uppercase tracking-[0.1em]">
                                 {r.subject?.name}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <span className="text-sm font-black text-indigo-900">{r.marks}%</span>
                                 <div className="flex-1 max-w-[100px] h-1.5 bg-bg rounded-full border border-border-theme overflow-hidden">
                                    <div className="h-full bg-indigo-600" style={{ width: `${r.marks}%` }} />
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-success-theme/10 text-success-theme rounded-full">
                                 <CheckCircle2 size={12} />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Alpha Verified</span>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'enter-results' && (
          <div className="space-y-8 max-w-5xl mx-auto">
             <div className="bg-white p-8 rounded-2xl border border-border-theme shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Filter size={12} className="text-indigo-600" />
                      Select Examination Node
                   </label>
                   <select 
                     className="w-full bg-bg border border-border-theme p-3 rounded-xl text-xs font-bold text-text-main uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
                     value={selectedExam}
                     onChange={(e) => setSelectedExam(e.target.value)}
                   >
                      <option value="">Exams Registry</option>
                      {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <Users className="text-indigo-600" size={12} />
                      Filter by Academic Class
                   </label>
                   <select 
                     className="w-full bg-bg border border-border-theme p-3 rounded-xl text-xs font-bold text-text-main uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
                     value={selectedClass}
                     onChange={(e) => setSelectedClass(e.target.value)}
                   >
                      <option value="">Master Classes</option>
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                      <BookOpen size={12} className="text-indigo-600" />
                      Academic Subject Link
                   </label>
                   <select 
                     className="w-full bg-bg border border-border-theme p-3 rounded-xl text-xs font-bold text-text-main uppercase tracking-widest focus:ring-2 focus:ring-indigo-600/10 outline-none transition-all"
                     value={selectedSubject}
                     onChange={(e) => setSelectedSubject(e.target.value)}
                   >
                      <option value="">Subjects Inventory</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                </div>
             </div>

             {(!selectedExam || !selectedClass || !selectedSubject) ? (
                <div className="bg-bg/50 border-2 border-dashed border-border-theme p-20 rounded-2xl flex flex-col items-center justify-center text-center opacity-40">
                   <AlertCircle size={48} className="text-text-muted mb-6" />
                   <h3 className="text-sm font-black text-text-main uppercase tracking-[0.2em]">Telemetry Context Undefined</h3>
                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">Select Exam, Class, and Subject to initialize result injection stream.</p>
                </div>
             ) : (
                <div className="bg-white rounded-2xl border border-border-theme shadow-sm overflow-hidden animate-in zoom-in-95 duration-200">
                   <div className="p-6 border-b border-border-theme bg-indigo-900 text-white flex justify-between items-center">
                      <div>
                         <h3 className="text-sm font-bold uppercase tracking-widest">Result Injection Matrix</h3>
                         <p className="text-[10px] opacity-70 font-medium uppercase mt-1">{exams.find(e => e.id === selectedExam)?.name} • {subjects.find(s => s.id === selectedSubject)?.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                         <button 
                           onClick={() => setEntryData({})}
                           className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all"
                         >
                            Clear Frame
                         </button>
                      </div>
                   </div>
                   <div className="p-6 space-y-4">
                      {students.filter(s => s.classId === selectedClass).map((s: any) => (
                        <div key={s.id} className="p-4 bg-bg border border-border-theme rounded-xl flex items-center justify-between group hover:border-indigo-600/40 transition-all">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white border border-border-theme rounded-xl flex items-center justify-center font-black text-xs text-indigo-900 group-hover:bg-indigo-900 group-hover:text-white transition-all">
                                 {s.user?.name?.charAt(0)}
                              </div>
                              <div>
                                 <h4 className="text-xs font-bold text-text-main uppercase tracking-tight">{s.user?.name}</h4>
                                 <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">Identity: #{s.id.toUpperCase()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Mastery %</span>
                              <input 
                                type="number" 
                                min="0" 
                                max="100"
                                placeholder="0"
                                className="w-24 bg-white border border-border-theme p-3 rounded-lg text-sm text-center font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all tabular-nums"
                                value={entryData[s.id] || ''}
                                onChange={(e) => setEntryData({...entryData, [s.id]: parseInt(e.target.value) || 0})}
                              />
                           </div>
                        </div>
                      ))}
                      {students.filter(s => s.classId === selectedClass).length === 0 && (
                         <div className="py-20 text-center text-text-muted italic text-[10px] font-black uppercase tracking-widest">No examinees registered for selected class identity.</div>
                      )}
                   </div>
                   <div className="p-6 border-t border-border-theme bg-bg/20 flex justify-end">
                      <button 
                        onClick={handleSubmitResults}
                        disabled={isSubmitting || Object.keys(entryData).length === 0}
                        className="bg-indigo-900 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-indigo-900/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                      >
                         {isSubmitting ? 'SYNCHRONIZING TELEMETRY...' : 'COMMIT ASSESSMENT TO MASTER LEDGER'}
                      </button>
                   </div>
                </div>
             )}
          </div>
        )}

        {activeTab === 'schedule' && (
           <div className="bg-white rounded-2xl border border-border-theme shadow-sm p-8 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 mb-2">
                 <Clock size={32} />
              </div>
              <h3 className="text-lg font-bold text-indigo-900 uppercase tracking-widest">Global Evaluation Registry</h3>
              <p className="text-text-muted text-xs font-medium max-w-sm leading-relaxed uppercase tracking-widest">Comprehensive scheduling for periodic synchronizations and term-end validations across all academic levels.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                {exams.map((e: any) => (
                   <div key={e.id} className="p-6 bg-bg border border-border-theme rounded-2xl text-left hover:border-indigo-600 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em]">{new Date(e.date).getFullYear()} SYNC</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                          e.status === 'Active' ? "bg-success-theme/10 text-success-theme" : "bg-indigo-100 text-indigo-600"
                        )}>
                           {e.status}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-text-main group-hover:text-indigo-900 transition-colors uppercase tracking-tight">{e.name}</h4>
                      <div className="mt-4 flex items-center gap-3 text-[10px] text-text-muted font-bold">
                         <Calendar className="text-indigo-400" size={14} />
                         {new Date(e.date).toLocaleDateString()}
                      </div>
                   </div>
                ))}
              </div>
           </div>
        )}
      </motion.div>
    </div>
  );
};

// Internal Sub-components for better hierarchy
const Calendar = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
