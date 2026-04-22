import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Bell,
  Clock,
  DollarSign,
  UserPlus,
  Ban,
  Zap
} from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useNavigate } from 'react-router-dom';
import { seedDatabase } from '@/lib/seedFirestore';
import { useFirebase } from '@/context/FirebaseContext';

export const DashboardHome = () => {
  const { stats, isLoading, refetch } = useDashboardStats() as any;
  const { currentSchoolId } = useFirebase();
  const navigate = useNavigate();
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Auto-seed if the database is empty for the current school
  React.useEffect(() => {
    if (!isLoading && stats.students === 0 && currentSchoolId && !isSeeding) {
      const performSeed = async () => {
        setIsSeeding(true);
        try {
          await seedDatabase(currentSchoolId);
          refetch();
        } catch (err: any) {
          console.error("Seeding failed:", err.message || String(err));
        } finally {
          setIsSeeding(false);
        }
      };
      performSeed();
    }
  }, [isLoading, stats.students, currentSchoolId, isSeeding, refetch]);

  const handleManualSeed = async () => {
    if (!currentSchoolId || isSeeding) return;
    setIsSeeding(true);
    try {
      await seedDatabase(currentSchoolId);
      refetch();
    } catch (err: any) {
      console.error("Manual seeding failed:", err.message || String(err));
    } finally {
      setIsSeeding(false);
    }
  };

  const cards = [
    { label: 'Total Students', value: stats.students.toString(), icon: GraduationCap, trend: '+12%', color: 'blue' },
    { label: 'Active Faculty', value: stats.teachers.toString(), icon: Users, trend: 'Stable', color: 'indigo' },
    { label: 'Attendance Rate', value: stats.attendance, icon: Calendar, trend: '+2.4%', color: 'green' },
    { label: 'Collections', value: '$' + (stats.feesCollected || 0).toLocaleString(), icon: DollarSign, trend: '+8.1%', color: 'purple' },
  ];

  if (isLoading || isSeeding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        {isSeeding && <p className="text-[10px] font-black uppercase tracking-widest text-text-muted animate-pulse">Initializing Master Ledger...</p>}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl border border-border-theme shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-main tracking-tight uppercase">System Intelligence</h1>
            <p className="text-text-muted text-sm font-medium">Real-time telemetry and cross-portal synchronization active</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-text-muted">
            <Clock size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Master Clock Sync</span>
          </div>
          <button 
            onClick={handleManualSeed}
            disabled={isSeeding}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-all disabled:opacity-50"
          >
            <Zap size={14} className="fill-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest">Re-seed Intelligence</span>
          </button>
          <button className="relative p-2.5 bg-bg border border-border-theme rounded-lg text-text-muted hover:text-primary transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white p-6 rounded-xl border border-border-theme hover:border-primary/20 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-lg bg-bg border border-border-theme group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
                <card.icon size={22} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                card.trend.includes('+') ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
              }`}>
                {card.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{card.label}</p>
            <h3 className="text-3xl font-bold text-text-main tabular-nums tracking-tighter">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           <button 
             onClick={() => navigate('/academics/students?action=admission')}
             className="bg-primary text-white p-6 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center gap-4"
           >
              <div className="p-3 bg-white/20 rounded-xl">
                <UserPlus size={20} />
              </div>
              <div className="text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">Global Admission</h4>
                 <p className="text-[9px] opacity-70 mt-1 uppercase font-bold">New Identity Sync</p>
              </div>
           </button>

           <button 
             onClick={() => navigate('/academics/students?action=promote')}
             className="bg-white border border-border-theme p-6 rounded-2xl shadow-sm hover:border-primary/40 transition-all flex items-center gap-4"
           >
              <div className="p-3 bg-bg text-primary rounded-xl">
                <TrendingUp size={20} />
              </div>
              <div className="text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-widest leading-none text-text-main">Promote Level</h4>
                 <p className="text-[9px] text-text-muted mt-1 uppercase font-bold text-primary">Academic Sync</p>
              </div>
           </button>

           <button 
             onClick={() => navigate('/academics/students?action=withdraw')}
             className="bg-white border border-border-theme p-6 rounded-2xl shadow-sm hover:border-red-200 transition-all flex items-center gap-4 text-red-600"
           >
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <Ban size={20} />
              </div>
              <div className="text-left">
                 <h4 className="text-[10px] font-black uppercase tracking-widest leading-none text-text-main">Withdraw Sync</h4>
                 <p className="text-[9px] text-text-muted mt-1 uppercase font-bold text-red-500">System Exit</p>
              </div>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-border-theme p-6 shadow-sm">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-border-theme">
            <div>
              <h3 className="text-sm font-bold text-text-main uppercase tracking-widest">Academics Distribution</h3>
              <p className="text-[11px] text-text-muted font-medium mt-1">Cross-referencing student performance and attendance</p>
            </div>
            <button className="p-2 bg-bg border border-border-theme rounded-md text-text-muted hover:text-text-main transition-all">
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="h-64 flex flex-col justify-end gap-1">
             <div className="flex items-end gap-3 h-full px-4">
                {[45, 68, 82, 55, 94, 73, 61, 88].map((h, i) => (
                   <div key={i} className="flex-1 group/bar relative">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="bg-bg border border-border-theme rounded-t-lg group-hover/bar:bg-primary transition-all duration-300 relative"
                      >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-main text-white px-2 py-1 rounded text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity">
                           {h}%
                         </div>
                      </motion.div>
                   </div>
                ))}
             </div>
             <div className="flex justify-between px-4 mt-6">
                {['M', 'T', 'W', 'TH', 'F', 'S'].map(d => (
                   <span key={d} className="text-[8px] font-black text-text-muted uppercase tracking-widest">{d}</span>
                ))}
             </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-theme p-6 shadow-sm">
          <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 border-b border-border-theme pb-4">Real-time Events Sync</h3>
          <div className="space-y-4">
            {[
              { time: '09:00 AM', event: 'Primary Assembly', type: 'Session', status: 'Live' },
              { time: '11:15 AM', event: 'HOD Briefing', type: 'Admin', status: 'Upcoming' },
              { time: '02:00 PM', event: 'Physics Lab V', type: 'Academic', status: 'Scheduled' },
              { time: '04:30 PM', event: 'Football Trials', type: 'Sports', status: 'Scheduled' },
            ].map((ev, i) => (
              <div key={i} className="flex gap-4 group cursor-pointer">
                <div className="flex flex-col items-center">
                   <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary animate-pulse' : 'bg-border-theme group-hover:bg-primary/40'} transition-all`} />
                   {i < 3 && <div className="w-px h-full bg-border-theme my-1" />}
                </div>
                <div>
                   <p className="text-[9px] font-black text-text-muted uppercase tracking-wider mb-0.5">{ev.time}</p>
                   <h4 className="text-xs font-bold text-text-main group-hover:text-primary transition-colors uppercase tracking-tight">{ev.event}</h4>
                   <p className="text-[9px] font-bold text-text-muted mt-0.5 uppercase tracking-widest">{ev.type}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 bg-bg border border-border-theme text-[10px] font-black text-text-main uppercase tracking-widest rounded-lg hover:bg-text-main hover:text-white transition-all">
             Global Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
