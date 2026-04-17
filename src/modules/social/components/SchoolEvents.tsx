import React from 'react';
import { Calendar, MapPin, Share2, Plus, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useEvents } from '../hooks/useEvents';

export const SchoolEvents = () => {
  const { events, isLoading } = useEvents();

  if (isLoading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-main uppercase tracking-tight">Communications & Events</h1>
          <p className="text-text-muted text-sm font-medium">Single-source publishing to internal, social, and public channels</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-all font-bold uppercase tracking-widest text-[10px] shadow-sm">
          <Plus size={18} />
          Publish Event
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event: any, i: number) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-xl overflow-hidden border border-border-theme hover:shadow-md transition-all duration-300"
          >
            <div className="aspect-video overflow-hidden relative">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded text-[10px] font-black uppercase tracking-widest text-text-main shadow-sm">
                  {event.category}
                </span>
                <span className="px-2.5 py-1 bg-primary rounded text-[10px] font-black uppercase tracking-widest text-white shadow-sm border border-primary/20">
                  {event.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start gap-4 mb-3">
                <h3 className="text-lg font-bold text-text-main leading-tight tracking-tight uppercase tracking-widest">{event.title}</h3>
                <button className="p-2 bg-bg rounded-md text-text-muted hover:text-primary transition-all">
                  <Share2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-5 text-[10px] text-text-muted font-black uppercase tracking-widest mb-6 border-y border-border-theme py-2">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>
              <button className="w-full py-3 bg-bg text-text-main rounded-md flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] hover:bg-text-main hover:text-white transition-all shadow-sm">
                Omni-Channel Distribution
                <ArrowUpRight size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
