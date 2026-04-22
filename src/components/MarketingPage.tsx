import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Lock,
  ChevronRight,
  School,
  Play,
  Terminal,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MARKETING_SECTIONS } from '@/constants/marketing';
import { Navbar } from './common/Navbar';

export const MarketingPage = ({ onLogin, onRequestAccess }: { onLogin: () => void; onRequestAccess?: () => void }) => {
  const { slug } = useParams();
  const section = MARKETING_SECTIONS[slug as keyof typeof MARKETING_SECTIONS] as any;

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase italic">404 - Section Not Found</h1>
          <Link to="/" className="mt-4 text-indigo-600 font-bold uppercase tracking-widest text-xs inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar onLogin={onLogin} onRequestAccess={onRequestAccess} />

      {/* Hero Section */}
      <section className="pt-40 pb-24 lg:pt-56 lg:pb-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-8">
              <Zap size={12} className="fill-indigo-600" />
              Institutional {section.title}
            </div>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8 italic uppercase max-w-4xl mx-auto">
              {section.subtitle}
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              {section.heroDescription}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-5">
              <button 
                onClick={onRequestAccess || onLogin}
                className="bg-indigo-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all italic"
              >
                Start Journey
              </button>
              <button className="bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-all italic">
                Contact Strategy Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Sections */}
      {section.items && (
        <section className="py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {section.items.map((item: any, idx: number) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-sm">
                    <item.icon size={28} />
                  </div>
                  <h4 className="text-xl font-black uppercase italic tracking-tight text-slate-900 mb-4">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Table (If applicable) */}
      {section.plans && (
        <section className="py-32 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
            <div className="grid lg:grid-cols-3 gap-8">
              {section.plans.map((plan: any, idx: number) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "p-10 rounded-[40px] border-2 transition-all duration-500 flex flex-col h-full",
                    plan.popular ? "border-indigo-600 shadow-2xl relative" : "border-slate-100 hover:border-slate-300"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Most Adopted</div>
                  )}
                  <div className="mb-8">
                     <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", plan.popular ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600")}>
                        <plan.icon size={24} />
                     </div>
                     <h4 className="text-2xl font-black uppercase italic tracking-tight mb-2">{plan.name}</h4>
                     <p className="text-slate-500 font-medium text-sm leading-relaxed">{plan.description}</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tighter">${plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/ Month / Node</span>}
                    </div>
                  </div>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature: string) => (
                      <li key={feature} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button onClick={onLogin} className={cn(
                    "w-full py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-lg",
                    plan.popular ? "bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700" : "bg-slate-900 text-white hover:bg-slate-950 shadow-slate-900/20"
                  )}>
                    Provision Plan
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Developer Experience Visual (If applicable) */}
      {section.id === 'developers' && (
        <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600 opacity-[0.05] -skew-x-[20deg]" />
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-20 items-center">
            <div>
               <h3 className="text-4xl lg:text-6xl font-black tracking-tight leading-[0.9] mb-8 italic uppercase">Institutional API <br/>First Architecture.</h3>
               <p className="text-indigo-200 text-lg mb-10 font-medium leading-relaxed">Embed EduFlow's academic and financial primitives directly into your existing IT infrastructure. No more data silos.</p>
               <div className="space-y-4">
                  {[
                    "Type-safe SDKs for React & Node.js",
                    "99.9% Core Engine Uptime SLA",
                    "Global Data Residency Compliance",
                    "Programmatic Webhook Pipelines"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/60">
                       <ShieldCheck size={18} className="text-indigo-500" />
                       {item}
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-slate-900 rounded-[32px] p-2 border border-white/5 shadow-2xl relative">
               <div className="bg-slate-950 rounded-2xl p-8 font-mono text-[13px] leading-relaxed text-indigo-400 overflow-hidden relative group">
                  <div className="absolute top-4 right-6 flex gap-2">
                     <div className="w-3 h-3 bg-red-400/20 rounded-full" />
                     <div className="w-3 h-3 bg-yellow-400/20 rounded-full" />
                     <div className="w-3 h-3 bg-green-400/20 rounded-full" />
                  </div>
                  <div className="text-white/30 mb-8 border-b border-white/5 pb-4 flex items-center gap-2">
                    <Terminal size={14} />
                    <span>bash --eduflow-cli</span>
                  </div>
                  <div className="space-y-1">
                    <p><span className="text-indigo-500 font-bold">$</span> eduflow auth login</p>
                    <p className="text-white/60 select-none opacity-40 italic mt-2">// Response: Synchronizing Auth Node...</p>
                    <p className="mt-4"><span className="text-indigo-500 font-bold">$</span> eduflow query students --school-id "NODE_01"</p>
                    <p className="mt-1 ml-4 text-emerald-400/80">{"{"}</p>
                    <p className="ml-8"><span className="text-white/80">"status":</span> "200 OK",</p>
                    <p className="ml-8"><span className="text-white/80">"nodes":</span> 4,500,</p>
                    <p className="ml-8"><span className="text-white/80">"sync":</span> "Enabled"</p>
                    <p className="ml-4 text-emerald-400/80">{"}"}</p>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Global Scaling Map (Resources/Solutions) */}
      {(section.id === 'solutions' || section.id === 'resources') && (
        <section className="py-32 bg-slate-50 border-y border-slate-100 overflow-hidden relative">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-20 text-center">
            <h3 className="text-4xl lg:text-5xl font-black tracking-tight leading-none mb-20 italic uppercase">Global Institutional <br/>Network Coverage.</h3>
            <div className="relative aspect-[2/1] bg-white rounded-[60px] border border-slate-200 shadow-2xl flex items-center justify-center group">
               <Globe size={180} strokeWidth={0.5} className="text-indigo-100 group-hover:scale-110 group-hover:text-indigo-200 transition-all duration-1000" />
               <div className="absolute inset-0 p-20 grid grid-cols-3 gap-10">
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 self-start -translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Active Nodes</div>
                    <div className="text-3xl font-black italic">4.2K+</div>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 self-center translate-y-20 group-hover:translate-y-0 transition-transform duration-1000">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Student Database</div>
                    <div className="text-3xl font-black italic">1.8M+</div>
                  </div>
                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 self-end translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Data Residency</div>
                    <div className="text-3xl font-black italic">42 Nodes</div>
                  </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-40 bg-white text-center">
         <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.85] mb-10 italic uppercase">Secure Your <br/>Institutional Future.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <button onClick={onRequestAccess || onLogin} className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-full font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all text-xl italic">Get Started</button>
               <button className="w-full sm:w-auto px-12 py-5 bg-white border border-slate-200 text-slate-900 rounded-full font-black uppercase tracking-widest hover:border-slate-400 transition-all text-xl italic">Talk to Expert</button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 grid gap-10 md:flex md:justify-between items-center text-center md:text-left">
           <div>
              <Link to="/" className="flex items-center justify-center md:justify-start gap-2 group cursor-pointer mb-4">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                  <School size={16} />
                </div>
                <span className="text-sm font-bold tracking-tighter uppercase italic">EduFlow SaaS</span>
              </Link>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Distributed Systems Core © 2024</p>
           </div>
           <div className="flex flex-wrap items-center justify-center gap-8">
              {['Solutions', 'Developers', 'Resources', 'Pricing'].map(item => (
                <Link key={item} to={`/marketing/${item.toLowerCase()}`} className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">{item}</Link>
              ))}
           </div>
        </div>
      </footer>
    </div>
  );
};
