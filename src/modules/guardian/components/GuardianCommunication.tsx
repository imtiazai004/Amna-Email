import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Search,
  MoreVertical,
  Paperclip,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGuardianSummary } from '../hooks/useGuardianSummary';
import { cn } from '@/lib/utils';

export const GuardianCommunication = () => {
  const { summary, isLoading } = useGuardianSummary();
  const [activeThread, setActiveThread] = useState<string | null>(null);

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

  const threads = [
    { 
      id: '1', 
      sender: 'Dr. Emily Watson', 
      role: 'Head of Mathematics', 
      lastMessage: 'The node has shown exceptional progress in the recent assessment cycle.', 
      time: '2h ago',
      unread: true,
      avatar: 'EW',
      messages: [
        { id: 'm1', sender: 'Teacher', content: 'Hello, I wanted to discuss the recent math assessment.', time: 'Yesterday' },
        { id: 'm2', sender: 'Guardian', content: 'Sure, I noticed the improvement in scores.', time: 'Yesterday' },
        { id: 'm3', sender: 'Teacher', content: 'The node has shown exceptional progress in the recent assessment cycle.', time: '2h ago' },
      ]
    },
    { 
      id: '2', 
      sender: 'School Administration', 
      role: 'System Logistics', 
      lastMessage: 'Verified: Fee synchronization for Q4 is now active.', 
      time: '1d ago',
      unread: false,
      avatar: 'AD',
      messages: [
        { id: 'm4', sender: 'Admin', content: 'Verified: Fee synchronization for Q4 is now active.', time: '1d ago' },
      ]
    }
  ];

  const currentThread = threads.find(t => t.id === activeThread);

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-8">
      <div className="w-96 flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-indigo-900 uppercase tracking-tight">Institutional Messenger</h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-1">Encrypted Node-to-Faculty Communication Tunnel</p>
        </header>

        <div className="flex-1 bg-white rounded-[32px] border border-border-theme flex flex-col shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border-theme bg-bg/20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Search encrypted threads..." 
                className="w-full bg-white border border-border-theme pl-12 pr-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-main outline-none focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {threads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={cn(
                  "w-full p-6 text-left border-b border-border-theme transition-all flex items-start gap-4 hover:bg-bg group",
                  activeThread === thread.id && "bg-bg border-l-4 border-l-indigo-900"
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-black text-xs shadow-md shadow-indigo-900/10 group-hover:scale-105 transition-transform">
                  {thread.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-text-main truncate uppercase tracking-tight">{thread.sender}</h4>
                    <span className="text-[9px] font-black text-text-muted whitespace-nowrap">{thread.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mb-2">{thread.role}</p>
                  <p className="text-[11px] text-text-muted truncate leading-relaxed">{thread.lastMessage}</p>
                </div>
                {thread.unread && (
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[40px] border border-border-theme shadow-sm flex flex-col overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeThread ? (
            <motion.div
              key={activeThread}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full"
            >
              <header className="p-6 border-b border-border-theme bg-bg/20 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-900 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-900/20">
                    {currentThread?.avatar}
                  </div>
                  <div>
                    <h3 className="font-black text-text-main uppercase tracking-tight">{currentThread?.sender}</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-success-theme rounded-full" />
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{currentThread?.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2.5 hover:bg-bg border border-border-theme rounded-xl text-text-muted transition-all">
                     <Building2 size={16} />
                  </button>
                  <button className="p-2.5 hover:bg-bg border border-border-theme rounded-xl text-text-muted transition-all">
                     <MoreVertical size={16} />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {currentThread?.messages.map((msg, i) => (
                  <div key={msg.id} className={cn(
                    "flex flex-col max-w-[70%] group",
                    msg.sender === 'Guardian' ? "ml-auto items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-6 rounded-[32px] text-sm leading-relaxed shadow-sm transition-all",
                      msg.sender === 'Guardian' 
                        ? "bg-indigo-900 text-white rounded-tr-none hover:shadow-indigo-900/10" 
                        : "bg-bg border border-border-theme text-text-main rounded-tl-none hover:border-indigo-600/20"
                    )}>
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-2 mt-2 px-2">
                       <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{msg.time}</span>
                       {msg.sender === 'Guardian' && <CheckCircle2 size={10} className="text-indigo-400" />}
                    </div>
                  </div>
                ))}
              </div>

              <footer className="p-8 border-t border-border-theme bg-white">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter encrypted message node..." 
                    className="w-full bg-bg border border-border-theme pl-6 pr-20 py-5 rounded-[24px] text-sm text-text-main font-medium outline-none focus:ring-2 focus:ring-indigo-600/10 focus:bg-white transition-all shadow-inner"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button className="p-3 text-text-muted hover:text-indigo-600 transition-colors">
                      <Paperclip size={20} />
                    </button>
                    <button className="p-3.5 bg-indigo-900 text-white rounded-2xl shadow-lg shadow-indigo-900/20 hover:scale-105 active:scale-95 transition-all">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="w-24 h-24 bg-bg border border-border-theme rounded-[32px] flex items-center justify-center text-indigo-900 shadow-inner">
                 <ShieldCheck size={48} className="opacity-20 animate-pulse" />
              </div>
              <div>
                 <h3 className="text-lg font-black text-text-main uppercase tracking-widest italic">Encrypted Secure Hub</h3>
                 <p className="text-[11px] text-text-muted uppercase font-bold tracking-widest mt-2 max-w-xs leading-relaxed">Select a communication thread to establish a secure link with the institutional faculty.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
