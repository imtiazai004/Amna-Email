import React from 'react';
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  BarChart3, 
  Download,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useGuardianSummary } from '../hooks/useGuardianSummary';
import { cn } from '@/lib/utils';

export const GuardianPerformance = () => {
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
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight text-indigo-900">Academic Analytics</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Real-time Performance Telemetry & Mastery Indexing</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-border-theme rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-bg transition-all flex items-center justify-center gap-2 shadow-sm">
            <Download size={16} />
            Academic Report
          </button>
        </div>
      </header>

      {summary.map((item: any, idx: number) => {
        const avgScore = item.results.length > 0 
          ? (item.results.reduce((acc: number, r: any) => acc + r.marks, 0) / item.results.length).toFixed(1)
          : 'N/A';

        return (
          <div key={idx} className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-indigo-900 text-white rounded text-[10px] font-black uppercase tracking-widest">Master Node</div>
              <h2 className="text-lg font-bold text-text-main">{item.student?.user?.name}</h2>
              <div className="h-px flex-1 bg-border-theme ml-4 opacity-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-white p-6 rounded-3xl border border-border-theme shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Collective Average</p>
                     <h3 className="text-3xl font-black text-indigo-900 tabular-nums mt-1">{avgScore}%</h3>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-border-theme shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Mastery Level</p>
                     <h3 className="text-3xl font-black text-emerald-600 tabular-nums mt-1">High-A</h3>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-border-theme shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Class Percentile</p>
                     <h3 className="text-3xl font-black text-amber-600 tabular-nums mt-1">84th</h3>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl border border-border-theme shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Assessments</p>
                     <h3 className="text-3xl font-black text-blue-600 tabular-nums mt-1">{item.results.length}</h3>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 bg-white rounded-[32px] border border-border-theme shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-border-theme bg-bg/20 flex justify-between items-center">
                     <h3 className="text-xs font-black text-text-main uppercase tracking-widest flex items-center gap-2">
                        <Award size={18} className="text-indigo-600" />
                        Verification Performance Stream
                     </h3>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="bg-bg text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-border-theme">
                              <th className="px-8 py-5">Assessment Unit</th>
                              <th className="px-8 py-5">Subject Node</th>
                              <th className="px-8 py-5">Performance Delta</th>
                              <th className="px-8 py-5 text-right">Mastery Node</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-border-theme">
                           {item.results.map((result: any) => (
                              <tr key={result.id} className="hover:bg-indigo-50/50 transition-colors group">
                                 <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-text-main">{result.exam?.name}</p>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">Cycle ID: {result.exam?.id.toUpperCase()}</p>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                       <BookOpen size={12} className="text-indigo-400" />
                                       {result.subject?.name}
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                       <div className="flex-1 h-1.5 bg-bg rounded-full overflow-hidden max-w-[80px]">
                                          <div 
                                            className="h-full bg-indigo-900" 
                                            style={{ width: `${(result.marks / (result.exam?.totalMarks || 100)) * 100}%` }} 
                                          />
                                       </div>
                                       <span className="text-sm font-bold text-text-main tabular-nums">{result.marks}%</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <span className="px-3 py-1 bg-indigo-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                                       {result.gradingNode}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                           {item.results.length === 0 && (
                              <tr>
                                 <td colSpan={4} className="px-8 py-20 text-center">
                                    <BarChart3 size={32} className="mx-auto text-text-muted/30 mb-4" />
                                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">No assessment telemetry available for this node.</p>
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="bg-indigo-900 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-900/20">
                     <TrendingUp size={32} className="text-indigo-300 mb-6" />
                     <h4 className="text-xl font-black uppercase tracking-tight leading-none italic">Learning Velocity</h4>
                     <p className="text-[11px] font-medium leading-relaxed opacity-60 uppercase tracking-widest mt-4">Node is demonstrating an accelerated learning curve across scientific domains.</p>
                     
                     <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Current Momentum</span>
                           <span className="text-lg font-black text-emerald-400">+4.2%</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] border border-border-theme shadow-sm">
                     <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6">Master Skill Distribution</h4>
                     <div className="space-y-4">
                        {['Analytical Thinking', 'Data Synthesis', 'Collaborative Output'].map((skill, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                 <span>{skill}</span>
                                 <span>{85 + i * 4}%</span>
                              </div>
                              <div className="h-1 bg-bg rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-600" style={{ width: `${85 + i * 4}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
