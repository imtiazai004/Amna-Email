import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  LogOut, 
  Menu,
  ChevronRight,
  School
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PORTALS } from '@/constants';

// Modular Component Imports
import { DashboardHome } from '@/modules/dashboard/components/DashboardHome';
import { StudentManagement } from '@/modules/academics/components/StudentManagement';
import { ClassSmartManagement } from '@/modules/academics/components/ClassSmartManagement';
import { TeacherManagement } from '@/modules/staff/components/TeacherManagement';
import { ExaminationCenter } from '@/modules/academics/components/ExaminationCenter';
import { StaffAttendance } from '@/modules/staff/components/StaffAttendance';
import { TeacherDirectory } from '@/modules/staff/components/TeacherDirectory';
import { TeacherSchedule } from '@/modules/staff/components/TeacherSchedule';
import { FinanceOverview } from '@/modules/finance/components/FinanceOverview';
import { FeeManagement } from '@/modules/finance/components/FeeManagement';
import { FeeTracking } from '@/modules/finance/components/FeeTracking';
import { SalaryManagement } from '@/modules/finance/components/SalaryManagement';
import { SchoolEvents } from '@/modules/social/components/SchoolEvents';
import { GuardianDashboard } from '@/modules/guardian/components/GuardianDashboard';
import { GuardianCommunication } from '@/modules/guardian/components/GuardianCommunication';
import { GuardianFees } from '@/modules/guardian/components/GuardianFees';
import { GuardianAttendance } from '@/modules/guardian/components/GuardianAttendance';
import { GuardianPerformance } from '@/modules/guardian/components/GuardianPerformance';
import { GuardianMeetings } from '@/modules/guardian/components/GuardianMeetings';

// --- Unified Placeholder Template ---
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6">
    <header>
      <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">{title}</h1>
      <p className="text-text-muted text-sm font-medium">Modular interface for {title}</p>
    </header>
    <div className="bg-white p-16 rounded-xl border border-border-theme shadow-sm flex flex-col items-center justify-center text-center">
       <div className="w-14 h-14 bg-bg text-primary rounded-xl flex items-center justify-center mb-6 shadow-sm border border-border-theme">
         <Settings size={28} className="animate-spin-slow opacity-60" />
       </div>
       <h2 className="text-lg font-bold text-text-main uppercase tracking-wider">Interface Initializing</h2>
       <p className="text-text-muted mt-3 max-w-sm text-xs font-medium leading-relaxed">The unified data engine for this module is being synchronized with the master database. Functionality will be active shortly.</p>
    </div>
  </div>
);

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg flex font-sans overflow-hidden h-screen text-text-main selection:bg-primary/10 selection:text-primary">
      {/* SaaS Sidebar Architecture */}
      <aside className={cn(
        "bg-white border-r border-border-theme flex flex-col transition-all duration-300 z-50 shrink-0 shadow-sm",
        sidebarOpen ? "w-[260px]" : "w-20"
      )}>
        <div className="px-6 h-16 flex items-center gap-3 border-b border-border-theme/50">
          <div className="text-primary bg-primary/5 p-2 rounded-lg">
            <School size={22} strokeWidth={2.5} />
          </div>
          {sidebarOpen && <span className="font-black text-lg tracking-tighter text-text-main uppercase">EduFlow SaaS</span>}
        </div>

        <nav className="flex-1 overflow-y-auto px-0 space-y-0.5 mt-4 custom-scrollbar">
          <Link 
            to="/" 
            className={cn(
              "flex items-center gap-3 px-6 py-3 text-[13px] transition-all border-l-[3px]",
              location.pathname === '/' 
                ? "bg-primary/5 text-primary border-l-primary font-bold" 
                : "text-text-muted border-l-transparent hover:bg-bg hover:text-text-main"
            )}
          >
            <LayoutDashboard size={18} />
            {sidebarOpen && <span className="uppercase tracking-[0.1em]">Intelligence</span>}
          </Link>

          {PORTALS.map((portal) => (
            <div key={portal.id} className="space-y-0.5">
              <button
                onClick={() => sidebarOpen && setActivePortal(activePortal === portal.id ? null : portal.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-6 py-3 text-[13px] transition-all border-l-[3px]",
                  location.pathname.includes(portal.id) 
                    ? "bg-primary/5 text-primary border-l-primary font-bold" 
                    : "text-text-muted border-l-transparent hover:bg-bg hover:text-text-main"
                )}
              >
                <portal.icon size={18} />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left uppercase tracking-[0.1em]">{portal.name}</span>
                    <motion.div
                      animate={{ rotate: activePortal === portal.id ? 90 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <ChevronRight size={12} className="opacity-40" />
                    </motion.div>
                  </>
                )}
              </button>

              <AnimatePresence>
                {sidebarOpen && activePortal === portal.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-0.5 bg-bg/50"
                  >
                    {portal.subPortals.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/${portal.id}/${sub.id}`}
                        className={cn(
                          "block pl-12 pr-6 py-2 text-[12px] transition-colors font-medium border-l-[3px] border-l-transparent",
                          location.pathname === `/${portal.id}/${sub.id}` 
                            ? "text-primary border-l-primary/40" 
                            : "text-text-muted hover:text-text-main"
                        )}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <div className="px-6 mt-8 mb-2">
             {sidebarOpen && <p className="text-[9px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-2">Platform Systems</p>}
          </div>
          
          <button className="w-full flex items-center gap-3 px-6 py-3 text-[13px] text-text-muted hover:bg-bg hover:text-text-main border-l-[3px] border-l-transparent transition-all">
            <Settings size={18} />
            {sidebarOpen && <span className="uppercase tracking-[0.1em]">Core Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-border-theme">
          <button className="w-full h-10 flex items-center gap-3 px-4 rounded-lg text-[13px] text-text-muted hover:bg-red-50 hover:text-red-600 transition-all font-bold">
            <LogOut size={16} />
            {sidebarOpen && <span className="uppercase tracking-widest">Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* Unified Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Sync-Aware Topbar */}
        <header className="h-16 bg-white border-b border-border-theme flex items-center justify-between px-8 shrink-0 z-40 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-text-muted hover:bg-bg rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <div className="bg-bg border border-border-theme flex items-center gap-2 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-success-theme rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">Node Sync: Priority-Alpha</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-bg border border-border-theme px-4 py-2 rounded-lg text-text-muted w-72 focus-within:border-primary/40 focus-within:bg-white transition-all shadow-inner">
              <Search size={16} />
              <input type="text" placeholder="Omni-Search Data Entities..." className="bg-transparent border-none focus:outline-none text-text-main text-[11px] w-full font-bold uppercase tracking-wider" />
            </div>
            
            <button className="p-2.5 text-text-muted hover:bg-bg rounded-lg relative border border-transparent hover:border-border-theme transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-border-theme">
              <div className="hidden lg:block text-right">
                <p className="text-[11px] font-black text-text-main uppercase tracking-tight">System Authority</p>
                <p className="text-[9px] text-primary uppercase font-black tracking-widest leading-none">Global Admin</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-text-main text-white flex items-center justify-center font-bold text-xs shadow-md">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Modular Route Rendering Engine */}
        <div className="flex-1 overflow-y-auto p-8 bg-bg custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              
              {/* Centralized Academics Module */}
              <Route path="/academics/classes" element={<ClassSmartManagement />} />
              <Route path="/academics/students" element={<StudentManagement />} />
              <Route path="/academics/teachers" element={<TeacherManagement />} />
              <Route path="/academics/exams" element={<ExaminationCenter />} />
              
              {/* Centralized Staff Module */}
              <Route path="/staff/attendance" element={<StaffAttendance />} />
              <Route path="/staff/directory" element={<TeacherDirectory />} />
              <Route path="/staff/schedule" element={<TeacherSchedule />} />
              
              {/* Centralized Finance Module */}
              <Route path="/finance/finance-overview" element={<FinanceOverview />} />
              <Route path="/finance/fee-management" element={<FeeManagement />} />
              <Route path="/finance/fee-tracking" element={<FeeTracking />} />
              <Route path="/finance/salary-management" element={<SalaryManagement />} />
              
              {/* Centralized Social & Web Module */}
              <Route path="/social/events" element={<SchoolEvents />} />
              
              {/* Interconnected Guardian Portal */}
              <Route path="/guardian/guardian-dashboard" element={<GuardianDashboard />} />
              <Route path="/guardian/communication" element={<GuardianCommunication />} />
              <Route path="/guardian/fees" element={<GuardianFees />} />
              <Route path="/guardian/attendance-history" element={<GuardianAttendance />} />
              <Route path="/guardian/performance" element={<GuardianPerformance />} />
              <Route path="/guardian/meetings" element={<GuardianMeetings />} />
              
              {/* Automated Placeholder System for Under-Development Features */}
              {PORTALS.flatMap(portal => portal.subPortals).map(sub => {
                const portal = PORTALS.find(p => p.subPortals.includes(sub));
                const fullPath = `/${portal?.id}/${sub.id}`;
                const implementedPaths = [
                  '/academics/classes',
                  '/academics/students',
                  '/academics/teachers',
                  '/academics/exams',
                  '/staff/attendance',
                  '/staff/directory',
                  '/staff/schedule',
                  '/finance/finance-overview',
                  '/finance/fee-management',
                  '/finance/fee-tracking',
                  '/finance/salary-management',
                  '/social/events',
                  '/guardian/guardian-dashboard',
                  '/guardian/communication',
                  '/guardian/fees',
                  '/guardian/attendance-history',
                  '/guardian/performance',
                  '/guardian/meetings'
                ];

                if (implementedPaths.includes(fullPath)) return null;

                return (
                  <React.Fragment key={sub.id}>
                    <Route 
                      path={fullPath} 
                      element={<PlaceholderPage title={sub.name} />} 
                    />
                  </React.Fragment>
                );
              })}
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
}
