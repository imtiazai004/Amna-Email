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
  School
} from 'lucide-react';
import { ALL_FEATURES, FEATURE_CATEGORIES } from '@/constants/features';
import { Navbar } from './common/Navbar';

export const FeaturePage = ({ onLogin, onRequestAccess }: { onLogin: () => void; onRequestAccess?: () => void }) => {
  const { slug } = useParams();
  const feature = ALL_FEATURES.find(f => f.id === slug);

  if (!feature) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase italic">404 - Node Not Found</h1>
          <Link to="/" className="mt-4 text-indigo-600 font-bold uppercase tracking-widest text-xs inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  const Icon = feature.icon;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Navbar onLogin={onLogin} onRequestAccess={onRequestAccess} />

      {/* Hero Section */}
      <section className="pt-40 pb-20 lg:pt-56 lg:pb-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100/50 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-[10px] font-black uppercase tracking-widest mb-8">
              <Zap size={12} className="fill-indigo-600" />
              Core Modular Component
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-8 italic uppercase">
              {feature.title} <br/>
              <span className="text-indigo-600">Reimagined.</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-xl font-medium leading-relaxed">
              {feature.description}. Our specialized engine provides deep institutional insights and automated workflows that scale with your growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onLogin}
                className="bg-indigo-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-indigo-900/30 hover:bg-slate-950 transition-all flex items-center gap-3 group"
              >
                Start Free Trial
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all">
                Documentation
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
             <div className="bg-white rounded-[40px] p-4 shadow-2xl border border-slate-200/50 overflow-hidden">
                <div className="aspect-video bg-slate-50 rounded-[32px] flex items-center justify-center border border-slate-100 relative group overflow-hidden">
                   <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <Icon size={120} strokeWidth={1} className="text-indigo-600/20 group-hover:scale-110 transition-transform" />
                   <div className="absolute bottom-8 left-8 right-8 h-20 bg-white/80 backdrop-blur rounded-2xl border border-white/50 p-6 flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                            <Icon size={18} />
                         </div>
                         <div className="text-left font-black uppercase tracking-tight text-xs">{feature.title} Status: ONLINE</div>
                      </div>
                      <div className="w-12 h-2 bg-emerald-400 rounded-full animate-pulse" />
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 grid lg:grid-cols-2 gap-32">
          <div>
            <h2 className="text-[11px] font-black text-rose-600 uppercase tracking-[0.3em] mb-6">The Challenge</h2>
            <h3 className="text-4xl font-black tracking-tight leading-none mb-8 italic uppercase">Legacy systems create <br/>institutional friction.</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Traditional {feature.title.toLowerCase()} often suffers from fragmented data, manual entry errors, and poor synchronization across departments. This leads to administrative burnout and decreased institutional transparency.
            </p>
          </div>
          <div>
            <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-6">The Solution</h2>
            <h3 className="text-4xl font-black tracking-tight leading-none mb-8 italic uppercase">Automated, Real-time <br/>Distributed Logic.</h3>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              EduFlow solves these issues by providing a unified, cloud-native platform where {feature.title.toLowerCase()} is handled through automated pipelines and real-time data nodes, ensuring absolute consistency across your entire campus.
            </p>
          </div>
        </div>
      </section>

      {/* Features Breakdown */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 text-center mb-20">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-none mb-6 italic uppercase">Core Capabilities</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">Deep diving into the technical architecture of our {feature.title.toLowerCase()} platform.</p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "Real-time Data Synchronization",
            "Advanced Access Control Policies",
            "Automated Reporting Engine",
            "End-to-end Encryption",
            "Modular Integration Interface",
            "Global Infrastructure Scaling"
          ].map((item, idx) => (
            <motion.div 
              key={item}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-lg font-bold mb-3">{item}</h4>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">Enterprise-grade implementation ensuring highest uptime and data integrity for your institution.</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Visual Preview */}
      <section className="py-32 bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-[20deg] transform origin-top" />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 text-center mb-20">
           <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-none mb-8 italic uppercase">Zero-Friction Interface</h2>
           <p className="text-indigo-200 text-xl font-medium max-w-xl mx-auto">Experience institutional management through a lens of extreme simplicity and power.</p>
        </div>
        <div className="max-w-[1000px] mx-auto bg-slate-950 p-4 rounded-[40px] shadow-2xl border border-white/10">
           <div className="aspect-video bg-slate-900 rounded-[32px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <Icon size={160} strokeWidth={0.5} className="text-white/5" />
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-white text-center">
         <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-10 italic uppercase">Ready to Evolve Your <br/>School's Core?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <button onClick={onRequestAccess || onLogin} className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-full font-bold shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all text-xl uppercase italic">Start Your Demo Now</button>
               <button className="w-full sm:w-auto px-12 py-5 bg-white border border-slate-200 text-slate-900 rounded-full font-bold hover:bg-slate-50 transition-all text-xl uppercase italic">Schedule a Call</button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
              <School size={16} />
            </div>
            <span className="text-sm font-bold tracking-tighter uppercase italic">EduFlow SaaS</span>
          </div>
          <div className="flex gap-8">
            <Link to="/" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/marketing/resources" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Documentation</Link>
            <Link to="/marketing/pricing" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
