import React from 'react';
import { Mail, Phone, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useTeachers } from '../hooks/useTeachers';

export const TeacherManagement = () => {
  const { teachers, isLoading } = useTeachers();

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl border border-border-theme shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Faculty Intelligence</h1>
          <p className="text-text-muted text-sm font-medium">Coordinate faculty credentials and departmental assignments</p>
        </div>
        <button className="flex items-center gap-2 bg-text-main text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-all font-bold uppercase tracking-widest text-[10px] shadow-sm">
          <Plus size={18} />
          Register Faculty
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher: any, i: number) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-xl border border-border-theme relative group overflow-hidden shadow-sm hover:border-primary/20 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 rounded-lg bg-bg text-text-main flex items-center justify-center font-black text-sm border border-border-theme group-hover:bg-text-main group-hover:text-white transition-colors duration-300 uppercase">
                 {teacher.avatar}
               </div>
               <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                 teacher.status === 'Available' ? 'bg-[#dcfce7] text-[#166534]' :
                 teacher.status === 'In Class' ? 'bg-[#dbeafe] text-[#1e40af]' : 'bg-bg text-text-muted'
               }`}>
                 {teacher.status}
               </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-text-main tracking-tight">{teacher.user.name}</h3>
              <p className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">{teacher.department?.name}</p>
              <p className="text-xs text-text-muted font-medium">{teacher.role}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-border-theme flex items-center justify-between">
              <div className="flex gap-2">
                <button className="p-2 bg-bg text-text-muted rounded-md hover:text-primary transition-all">
                  <Mail size={16} />
                </button>
                <button className="p-2 bg-bg text-text-muted rounded-md hover:text-primary transition-all">
                  <Phone size={16} />
                </button>
              </div>
              <button className="px-3 py-1.5 bg-bg text-text-main rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-text-main hover:text-white transition-all">
                Schedule V
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
