import React, { useState, useEffect } from 'react';
import { UserPlus, MoreVertical, Search, Filter, Mail, Phone, ArrowUpRight, Ban, CheckCircle2, UserCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useStudents } from '../hooks/useStudents';
import { useClasses } from '../hooks/useClasses';
import { Modal } from '@/components/ui/Modal';

export const StudentManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [promoteStudentId, setPromoteStudentId] = useState<string | null>(null);
  const [withdrawStudentId, setWithdrawStudentId] = useState<string | null>(null);
  const [showSelectionModal, setShowSelectionModal] = useState<null | 'promote' | 'withdraw'>(null);
  
  const [newStudent, setNewStudent] = useState({ 
    name: '', 
    email: '', 
    classId: '', 
    guardianPhone: '', 
    guardianName: '' 
  });

  const { students, isLoading, createStudent, isCreating, promoteStudent, withdrawStudent } = useStudents();
  const { classes } = useClasses();

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'admission') {
      setShowAdmissionModal(true);
      searchParams.delete('action');
      setSearchParams(searchParams);
    } else if (action === 'promote') {
      setShowSelectionModal('promote');
      searchParams.delete('action');
      setSearchParams(searchParams);
    } else if (action === 'withdraw') {
      setShowSelectionModal('withdraw');
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);
  
  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;

    createStudent({
      ...newStudent,
      classId: newStudent.classId || classes[0]?.id || 'c1'
    }, {
      onSuccess: () => {
        setShowAdmissionModal(false);
        setNewStudent({ 
          name: '', 
          email: '', 
          classId: '', 
          guardianPhone: '', 
          guardianName: '' 
        });
      }
    });
  };

  const handlePromoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const classId = (e.target as any).classId.value;
    if (promoteStudentId && classId) {
      promoteStudent({ id: promoteStudentId, classId });
      setPromoteStudentId(null);
      setActiveMenuId(null);
    }
  };

  const handleWithdrawConfirm = () => {
    if (withdrawStudentId) {
      withdrawStudent(withdrawStudentId);
      setWithdrawStudentId(null);
      setActiveMenuId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredStudents = students.filter((s: any) => 
    s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  );

  const activeStudentList = students.filter((s: any) => s.status === 'Active');

  return (
    <div className="space-y-8 pb-20">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm p-6 rounded-2xl border border-border-theme shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight leading-none mb-1">Student Governance</h1>
          <p className="text-text-muted text-[11px] font-medium uppercase tracking-widest">Unified management of enrollment, placement, and status synchronization</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center gap-2 bg-success-theme/5 border border-success-theme/10 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-success-theme rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-success-theme uppercase tracking-wider">Master Ledger Sync Active</span>
           </div>
           <button className="p-2 text-text-muted hover:bg-bg rounded-xl transition-all border border-border-theme">
              <Search size={18} />
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setShowAdmissionModal(true)}
          className="group bg-primary p-6 rounded-2xl text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-start gap-4 text-left border border-white/10"
        >
          <div className="p-3 bg-white/20 rounded-xl">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-[11px]">New Admission</h3>
            <p className="text-[10px] opacity-70 font-medium mt-1 uppercase tracking-tight">Initialize master record & fiscal ledger</p>
          </div>
        </button>

        <button 
          onClick={() => setShowSelectionModal('promote')}
          className="group bg-white p-6 rounded-2xl border border-border-theme shadow-sm hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-start gap-4 text-left"
        >
          <div className="p-3 bg-bg text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-[11px] text-text-main">Promote Level</h3>
            <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-tight">Advance student to subsequent grade</p>
          </div>
        </button>

        <button 
          onClick={() => setShowSelectionModal('withdraw')}
          className="group bg-white p-6 rounded-2xl border border-border-theme shadow-sm hover:border-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-start gap-4 text-left"
        >
          <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-all">
            <Ban size={24} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-[11px] text-text-main">Withdraw Student</h3>
            <p className="text-[10px] text-text-muted font-medium mt-1 uppercase tracking-tight">Suspend portal access & finalize billing</p>
          </div>
        </button>
      </div>

      {/* Admission Modal */}
      <Modal 
        isOpen={showAdmissionModal} 
        onClose={() => setShowAdmissionModal(false)}
        title="New Student Admission"
      >
        <form onSubmit={handleEnroll} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="e.g., Jonathan Edwards"
              value={newStudent.name}
              onChange={e => setNewStudent({...newStudent, name: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Institutional Email</label>
            <input 
              required
              type="email" 
              className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="student@school.edu"
              value={newStudent.email}
              onChange={e => setNewStudent({...newStudent, email: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Initial Grade Placement</label>
            <select 
              className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              value={newStudent.classId}
              onChange={e => setNewStudent({...newStudent, classId: e.target.value})}
            >
              <option value="">Select Class</option>
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
              ))}
            </select>
          </div>
          <div className="space-y-4 pt-4 border-t border-border-theme">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none">Guardian Identification Node</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Parent Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                    placeholder="Parent/Guardian Name"
                    value={newStudent.guardianName}
                    onChange={e => setNewStudent({...newStudent, guardianName: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Contact Phone (Unified)</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-indigo-600/20 outline-none transition-all"
                    placeholder="e.g., 555-0123"
                    value={newStudent.guardianPhone}
                    onChange={e => setNewStudent({...newStudent, guardianPhone: e.target.value})}
                  />
                </div>
             </div>
             <p className="text-[9px] text-text-muted font-bold uppercase tracking-tight italic">Using a unique phone number unifies multi-student records under a single node.</p>
          </div>
          
          <button 
            type="submit"
            disabled={isCreating}
            className="w-full bg-indigo-900 text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] mt-6 hover:opacity-95 transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2"
          >
            {isCreating ? 'Synchronizing Institutional Ledger...' : 'Commit to Master Database'}
          </button>
        </form>
      </Modal>

      {/* Student Selection Modal */}
      <Modal
        isOpen={!!showSelectionModal}
        onClose={() => setShowSelectionModal(null)}
        title={showSelectionModal === 'promote' ? 'Select Student for Promotion' : 'Select Student to Withdraw'}
      >
        <div className="space-y-4">
          <p className="text-xs text-text-muted">Target an active student record to initialize the {showSelectionModal} workflow.</p>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {activeStudentList.length === 0 ? (
              <p className="text-center py-6 text-[10px] font-black uppercase text-text-muted tracking-widest">No active students available</p>
            ) : activeStudentList.map((s: any) => (
              <button
                key={s.id}
                onClick={() => {
                  if (showSelectionModal === 'promote') {
                    setPromoteStudentId(s.id);
                  } else {
                    setWithdrawStudentId(s.id);
                  }
                  setShowSelectionModal(null);
                }}
                className="w-full flex items-center gap-4 p-3 bg-bg border border-border-theme rounded-xl hover:border-primary/40 hover:bg-white transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px]">
                  {s.user?.name?.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-text-main group-hover:text-primary transition-colors">{s.user?.name}</p>
                  <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">#{s.id.toUpperCase()} • {s.class?.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Promote Modal */}
      <Modal
        isOpen={!!promoteStudentId}
        onClose={() => setPromoteStudentId(null)}
        title="Promote Student Level"
      >
        <form onSubmit={handlePromoteSubmit} className="space-y-4">
          <div className="bg-bg p-4 rounded-xl border border-border-theme flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-black">
              {students.find(s => s.id === promoteStudentId)?.user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-text-main">{students.find(s => s.id === promoteStudentId)?.user?.name}</p>
              <p className="text-[9px] text-text-muted font-black uppercase tracking-widest">Current Class: {students.find(s => s.id === promoteStudentId)?.class?.name || 'Unassigned'}</p>
            </div>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">Selecting a new grade will update all academic schedules and performance tracking modules for this identity.</p>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Target Academic Grade</label>
            <select 
              name="classId"
              required
              className="w-full bg-bg border border-border-theme p-3 rounded-lg text-sm text-text-main focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            >
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
              ))}
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-text-main text-white py-3 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] mt-4 hover:opacity-95 transition-all shadow-md"
          >
            Execute Promotion Sync
          </button>
        </form>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={!!withdrawStudentId}
        onClose={() => setWithdrawStudentId(null)}
        title="Confirm Student Withdrawal"
      >
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
               <Ban size={24} />
             </div>
             <h4 className="text-sm font-bold text-text-main uppercase tracking-tight">Withdrawal Synchronization</h4>
             <p className="text-xs text-text-muted mt-2 leading-relaxed">
               You are about to withdraw <span className="font-bold text-text-main">{students.find(s => s.id === withdrawStudentId)?.user?.name}</span>. 
               This will suspend portal access and finalize all outstanding billing records.
             </p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => setWithdrawStudentId(null)}
               className="flex-1 px-4 py-3 border border-border-theme rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-bg transition-all"
             >
               Cancel
             </button>
             <button 
               onClick={handleWithdrawConfirm}
               className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200"
             >
               Confirm Withdrawal
             </button>
          </div>
        </div>
      </Modal>

      <div className="bg-white rounded-xl border border-border-theme overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border-theme flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
          <div className="flex items-center gap-3 bg-bg border border-border-theme px-4 py-2 rounded-lg text-text-muted w-full sm:w-96 focus-within:border-primary/40 transition-all shadow-inner">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Query master student ledger..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-text-main text-[11px] w-full font-black uppercase tracking-widest" 
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-main bg-white border border-border-theme rounded-lg hover:bg-bg transition-colors">
              <Filter size={16} />
              Refine View
            </button>
          </div>
        </div>

        <div className="overflow-x-auto overflow-visible">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg text-text-muted text-[11px] uppercase tracking-[0.2em] font-black border-b border-border-theme">
                <th className="px-8 py-5">Full Identity</th>
                <th className="px-8 py-5">Global UID</th>
                <th className="px-8 py-5">Academic Grade</th>
                <th className="px-8 py-5">Linked Guardian</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme">
              {filteredStudents.map((student: any) => (
                <tr key={student.id} className="hover:bg-[#f8fafc] transition-colors group relative">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-bg text-primary flex items-center justify-center font-black text-xs border border-border-theme group-hover:bg-primary group-hover:text-white transition-all duration-300 uppercase">
                        {student.avatar || student.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main tracking-tight">{student.user?.name}</p>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.1em]">{student.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[10px] text-text-muted font-black tracking-widest uppercase">#{student.id.toUpperCase()}</td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black px-2 py-0.5 bg-bg text-primary border border-primary/10 rounded uppercase tracking-widest inline-block w-fit">
                        {student.class?.name || 'Unassigned'}
                      </span>
                      <span className="text-[9px] text-text-muted uppercase font-bold mt-1 tracking-widest">Level {student.class?.grade || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                       <span className="text-xs text-text-main font-bold uppercase tracking-tight">Parent Linked</span>
                       <p className="text-[10px] text-text-muted font-medium mt-0.5">Contact Sync Active</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                        student.status === 'Active' ? "bg-success-theme/10 text-success-theme" : "bg-red-50 text-red-600"
                      )}>
                        {student.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right relative overflow-visible">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === student.id ? null : student.id)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        activeMenuId === student.id ? "bg-text-main text-white" : "text-text-muted hover:text-text-main hover:bg-bg"
                      )}
                    >
                      <MoreVertical size={18} />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === student.id && (
                        <motion.div
                          initial={{ opacity: 0, x: 10, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: 10, scale: 0.95 }}
                          className="absolute right-full top-1/2 -translate-y-1/2 mr-2 bg-white border border-border-theme shadow-2xl rounded-xl p-2 z-[100] min-w-[180px]"
                        >
                          <button 
                            onClick={() => setPromoteStudentId(student.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-bg rounded-lg transition-colors"
                          >
                            <ArrowUpRight size={14} className="text-primary" />
                            Promote Level
                          </button>
                          <button 
                            onClick={() => {
                              setWithdrawStudentId(student.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 rounded-lg transition-colors border-t border-border-theme mt-1 pt-3"
                          >
                            <Ban size={14} />
                            Withdraw student
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-5 border-t border-border-theme bg-bg flex items-center justify-between">
          <div className="text-[9px] text-text-muted font-black uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-success-theme rounded-full animate-pulse" />
            Centralized Sync Active: {students.length} Records Verified
          </div>
          <div className="flex gap-4">
            <button className="text-[9px] font-black text-text-muted hover:text-text-main uppercase tracking-widest transition-colors">Schema Definition</button>
            <button className="text-[9px] font-black text-primary hover:opacity-80 uppercase tracking-widest transition-colors">Relational Audit</button>
          </div>
        </div>
      </div>
    </div>
  );
};
