import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  School, 
  ChevronRight, 
  ChevronDown,
  ArrowRight, 
  ShieldCheck, 
  Globe, 
  Users, 
  Zap,
  BarChart3,
  Calendar,
  CreditCard,
  CheckCircle2,
  Lock,
  Menu,
  X,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Navbar } from './common/Navbar';
import { FEATURE_CATEGORIES } from '@/constants/features';

export const LandingPage = ({ onLogin, onRequestAccess }: { onLogin: () => void; onRequestAccess?: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 50], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)']);
  const headerBorder = useTransform(scrollY, [0, 50], ['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.05)']);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Users,
      title: "Student Intelligence",
      description: "Comprehensive 360-degree student profiles with behavioral tracking and academic progression forecasting."
    },
    {
      icon: CreditCard,
      title: "Financial Ledger",
      description: "Automated fee collection with recurring billing and real-time bank reconciliation."
    },
    {
      icon: Calendar,
      title: "Academic Engine",
      description: "Dynamic scheduling with conflict resolution for multi-campus institutional infrastructure."
    },
    {
      icon: BarChart3,
      title: "Executive Analytics",
      description: "Board-level reporting with real-time institutional health metrics and enrollment trends."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar onLogin={onLogin} onRequestAccess={onRequestAccess} transparent />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
        {/* Stripe-like Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-40" />
          <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-violet-50 rounded-full blur-[120px] opacity-30" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-widest mb-8">
              <Zap size={12} className="fill-indigo-600" />
              SaaS Infrastructure for Education
            </div>
            <h1 className="text-6xl lg:text-[100px] font-black text-slate-900 leading-[0.85] tracking-tighter mb-10 italic uppercase">
              Institutional <br/>
              <span className="text-indigo-600">Intelligence.</span>
            </h1>
            <p className="text-lg lg:text-2xl text-slate-600 mb-12 max-w-xl leading-relaxed font-medium">
              Building the financial and academic architecture for the internet of education. Streamline enrollments, automate complex billings, and empower parents.
            </p>
            
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={onRequestAccess || onLogin}
                className="bg-indigo-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group italic"
              >
                Request Live Demo
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={onLogin}
                className="bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 italic"
              >
                <Play size={18} className="fill-slate-900" />
                Watch Overview
              </button>
            </div>

            <div className="mt-16 flex items-center gap-8 grayscale opacity-50">
               <div className="font-bold tracking-tighter text-xl">ACADEMIA</div>
               <div className="font-bold tracking-tighter text-xl">LENS</div>
               <div className="font-bold tracking-tighter text-xl">GLOBAL SCHOOLS</div>
               <div className="font-bold tracking-tighter text-xl">EDU+</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-[80px] opacity-10 -z-10" />
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-4 overflow-hidden">
               <div className="aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden relative">
                  {/* Mock Dashboard Header */}
                  <div className="h-12 bg-white border-bottom border-slate-100 flex items-center px-4 gap-2">
                     <div className="w-3 h-3 bg-red-400 rounded-full" />
                     <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                     <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <div className="p-6">
                     <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="h-20 bg-white border border-slate-100 rounded-xl p-4">
                           <div className="w-8 h-2 bg-slate-200 rounded-full mb-3" />
                           <div className="w-12 h-4 bg-indigo-600/10 rounded-full" />
                        </div>
                        <div className="h-20 bg-white border border-slate-100 rounded-xl p-4">
                           <div className="w-8 h-2 bg-slate-200 rounded-full mb-3" />
                           <div className="w-12 h-4 bg-green-600/10 rounded-full" />
                        </div>
                        <div className="h-20 bg-white border border-slate-100 rounded-xl p-4">
                           <div className="w-8 h-2 bg-slate-200 rounded-full mb-3" />
                           <div className="w-12 h-4 bg-orange-600/10 rounded-full" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="h-8 bg-white border border-slate-100 rounded-lg w-full flex items-center px-3 justify-between">
                           <div className="w-24 h-2 bg-slate-100 rounded-full" />
                           <div className="w-8 h-4 bg-indigo-600/5 rounded-full" />
                        </div>
                        <div className="h-8 bg-white border border-slate-100 rounded-lg w-full flex items-center px-3 justify-between">
                           <div className="w-16 h-2 bg-slate-100 rounded-full" />
                           <div className="w-8 h-4 bg-indigo-600/5 rounded-full" />
                        </div>
                        <div className="h-8 bg-white border border-slate-100 rounded-lg w-full flex items-center px-3 justify-between">
                           <div className="w-32 h-2 bg-slate-100 rounded-full" />
                           <div className="w-8 h-4 bg-indigo-600/5 rounded-full" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Secondary Badge */}
            <div className="absolute -bottom-6 -left-10 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex items-center gap-4 animate-bounce-slow">
               <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={24} />
               </div>
               <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">Total Collections</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$1.4M Collected</div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-24 bg-white border-t border-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
          <div className="mb-20">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">Enterprise Grade</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none mb-6">Built for the most demanding <br/>institutions on Earth.</h3>
            <p className="text-slate-500 max-w-2xl font-medium">Scalable, secure, and resilient. EduFlow provides the institutional plumbing that allows your staff to focus on education instead of administrative friction.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <feature.icon size={24} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Interface Preview */}
      <section className="py-24 bg-indigo-600 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-[0.03] skew-x-[-20deg] transform origin-top translate-x-20" />
         <div className="max-w-[1400px] mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-20 items-center">
            <div>
               <h3 className="text-4xl lg:text-6xl font-black tracking-tight leading-none mb-8 italic uppercase text-white">Full Stack <br/>Institutional Intelligence.</h3>
               <p className="text-indigo-100 text-lg mb-10 leading-relaxed max-w-lg font-medium">From student enrollment to academic performance tracking and modular staff attendance - our zero-trust architecture ensures your data is always secure and accessible.</p>
               <ul className="space-y-6">
                  {[
                    "Multi-tenant security isolation (ISO 27001)",
                    "Real-time academic performance graphing",
                    "Modular staff payroll and attendance logging",
                    "Dedicated mobile-first Guardian portal"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-indigo-200">
                       <CheckCircle2 size={20} className="text-white" />
                       {item}
                    </li>
                  ))}
               </ul>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-white rounded-[40px] blur-[120px] opacity-20 -z-10 group-hover:opacity-30 transition-all" />
               <div className="bg-slate-950 rounded-[40px] p-6 shadow-2xl border border-white/10">
                  <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden relative">
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                     {/* Mocking a Code visual or complex UI */}
                     <div className="absolute left-8 top-8 space-y-4">
                        <div className="w-48 h-3 bg-white/20 rounded-full" />
                        <div className="w-32 h-3 bg-white/10 rounded-full" />
                        <div className="w-64 h-3 bg-white/5 rounded-full" />
                     </div>
                     <div className="absolute bottom-10 right-10 flex items-center gap-4">
                        <div className="px-5 py-3 rounded-2xl bg-indigo-500/20 border border-white/10 backdrop-blur-xl">
                           <Lock size={16} className="text-indigo-300" />
                        </div>
                        <div className="px-5 py-3 rounded-2xl bg-indigo-500/20 border border-white/10 backdrop-blur-xl">
                           <ShieldCheck size={16} className="text-indigo-300" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Deployment CTA */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
            <div className="bg-indigo-900 rounded-[60px] p-12 lg:p-24 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-1/3 h-full bg-white opacity-[0.03] skew-x-[-20deg] transform origin-top group-hover:translate-x-10 transition-transform duration-[2s]" />
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
               >
                  <h2 className="text-4xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-10">Ready to deploy the <br/>future of education?</h2>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <button 
                      onClick={onRequestAccess || onLogin}
                      className="w-full sm:w-auto px-12 py-6 bg-white text-indigo-900 rounded-full font-black uppercase tracking-widest text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all italic"
                    >
                      Provision Your Node
                    </button>
                    <button className="w-full sm:w-auto px-12 py-6 bg-indigo-800 text-indigo-100 rounded-full font-black uppercase tracking-widest text-lg hover:bg-indigo-700 transition-all italic border border-indigo-700">
                      View Architecture
                    </button>
                  </div>
                  <p className="mt-12 text-indigo-300 font-bold uppercase tracking-[0.2em] text-[10px]">Trusted by thousands of leading universities and K-12 systems globally</p>
               </motion.div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 grid grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 group cursor-pointer mb-6">
              <div className="bg-indigo-600 text-white p-2 rounded-xl">
                <School size={20} />
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase italic">EduFlow</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-medium mb-8">Building the financial and academic infrastructure for the internet of education. Trusted by 2,000+ institutions globally.</p>
            <div className="flex items-center gap-4 text-slate-400">
               <Globe size={20} />
               <span className="text-xs font-bold uppercase tracking-widest">Global Operations Center</span>
            </div>
          </div>
          
          {[
            { title: "Product", items: [{ name: "Academics", path: "/features/classes-management" }, { name: "Finance", path: "/features/fee-management" }, { name: "Staff Hub", path: "/features/teachers-directory" }, { name: "Guardian", path: "/features/guardian-dashboard-feature" }, { name: "Intelligence", path: "/features/examination-center" }] },
            { title: "Developers", items: [{ name: "REST API", path: "/marketing/developers" }, { name: "Webhooks", path: "/marketing/developers" }, { name: "Identity", path: "/marketing/developers" }, { name: "SDKs", path: "/marketing/developers" }] },
            { title: "Resources", items: [{ name: "Documentation", path: "/marketing/resources" }, { name: "Guides", path: "/marketing/resources" }, { name: "Case Studies", path: "/marketing/resources" }, { name: "Status", path: "/marketing/resources" }] }
          ].map((col) => (
            <div key={col.title}>
              <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">{col.title}</h5>
              <ul className="space-y-4">
                {col.items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.path} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 mt-20 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row justify-between gap-6 items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2024 EduFlow Distributed Systems, Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
               <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-tighter">Terms</a>
               <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-tighter">Privacy</a>
               <a href="#" className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-tighter">Cookie Settings</a>
            </div>
        </div>
      </footer>
    </div>
  );
};
