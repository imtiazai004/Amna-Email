import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Users, 
  School, 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle2, 
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Zap,
  BarChart3,
  Clock,
  LogOut,
  Send
} from 'lucide-react';
import { 
  collection, 
  query, 
  onSnapshot, 
  updateDoc, 
  doc, 
  addDoc, 
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  schoolName: string;
  adminName: string;
  email: string;
  phone: string;
  message: string;
  status: 'PENDING' | 'APPROVED' | 'CONTACTED';
  createdAt: string;
}

export const SuperAdminDashboard = ({ user }: { user: any }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Security Guard: Hardcoded Super Admin Email
  const SUPER_ADMIN_EMAIL = 'iamna2462@gmail.com';
  
  if (user?.email !== SUPER_ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Tactical Access Denied</h1>
        <p className="text-slate-500 max-w-md font-medium">This node is reserved for the platform's supreme administrator. If you believe this is an error, please contact global security.</p>
        <button onClick={() => window.location.href = '/'} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-black uppercase text-xs tracking-widest italic outline-none border-none">Return to Portal</button>
      </div>
    );
  }

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Lead));
      setLeads(leadData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = async (lead: Lead) => {
    try {
      // 1. Move to active_schools
      await addDoc(collection(db, 'active_schools'), {
        schoolName: lead.schoolName,
        adminEmail: lead.email,
        approvedAt: new Date().toISOString(),
        status: 'ACTIVE',
        leadId: lead.id
      });

      // 2. Update lead status
      await updateDoc(doc(db, 'leads', lead.id), {
        status: 'APPROVED'
      });

      // 3. Trigger Welcome Email Logic (Mock/API)
      await fetch('/api/emails/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: lead.email,
          schoolName: lead.schoolName,
          adminName: lead.adminName
        })
      });

      alert(`Institutional Node Activated: ${lead.schoolName}`);
    } catch (error: any) {
      console.error("Failed to approve node:", error.message || String(error));
    }
  };

  const handleContact = async (lead: Lead) => {
    // Logic to open mailto or whatsapp
    const whatsappUrl = `https://wa.me/${lead.phone.replace(/\D/g, '')}?text=Hi ${lead.adminName}, this is the EduFlow deployment team regarding your request for ${lead.schoolName}.`;
    window.open(whatsappUrl, '_blank');
    
    await updateDoc(doc(db, 'leads', lead.id), {
      status: 'CONTACTED'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white border-r border-slate-200 p-8 hidden lg:block">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-slate-900 text-white p-2 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter">SuperAdmin</span>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-slate-900/10">
            <Zap size={18} /> Lead Pipeline
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-2xl font-bold text-sm transition-all">
            <School size={18} /> Active Nodes
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-100 rounded-2xl font-bold text-sm transition-all">
            <BarChart3 size={18} /> Global Analytics
          </button>
        </nav>

        <div className="absolute bottom-8 left-8 right-8 space-y-4">
           <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">System Health</div>
              <div className="text-xs font-bold text-indigo-700">All Nodes Operational</div>
           </div>
           <button onClick={() => window.location.href = '/'} className="w-full flex items-center justify-between px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-sm transition-all">
              Exit Dashboard
              <LogOut size={18} />
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-80 min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-50">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Institutional Intake Pipeline</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Manage school requests & deployments</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold">{user?.name}</div>
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Supreme Admin</div>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-200">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Leads</span>
              </div>
              <div className="text-3xl font-black italic uppercase">{leads.length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Approved</span>
              </div>
              <div className="text-3xl font-black italic uppercase">{leads.filter(l => l.status === 'APPROVED').length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Pending</span>
              </div>
              <div className="text-3xl font-black italic uppercase">{leads.filter(l => l.status === 'PENDING').length}</div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900 uppercase tracking-widest">Incoming Requests</div>
              <div className="flex gap-2">
                 <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Institution</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Administrator</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs animate-pulse tracking-widest">Synchronizing Leads...</td>
                    </tr>
                  ) : leads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No Active Requests</td>
                    </tr>
                  ) : (
                    leads.map((lead) => (
                      <tr key={lead.id} className="group hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                              {lead.schoolName.charAt(0)}
                            </div>
                            <div>
                               <div className="text-sm font-black text-slate-900 uppercase italic tracking-tighter">{lead.schoolName}</div>
                               <div className="text-[10px] text-slate-500 font-medium">Platform ID: {lead.id.slice(0, 8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-slate-700">{lead.adminName}</div>
                            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1"><Mail size={10} /> {lead.email}</span>
                              <span className="flex items-center gap-1"><Phone size={10} /> {lead.phone}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            lead.status === 'PENDING' && "bg-orange-100 text-orange-600",
                            lead.status === 'APPROVED' && "bg-emerald-100 text-emerald-600",
                            lead.status === 'CONTACTED' && "bg-blue-100 text-blue-600"
                          )}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-500 font-medium whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleContact(lead)}
                              className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
                              title="Sync with WhatsApp"
                            >
                              <MessageSquare size={16} />
                            </button>
                            {lead.status !== 'APPROVED' && (
                              <button 
                                onClick={() => handleApprove(lead)}
                                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                              >
                                Approve <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
