import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface MegaMenuNavItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
}

interface MegaMenuCategory {
  title: string;
  items: MegaMenuNavItem[];
}

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: MegaMenuCategory[];
}

export const MegaMenu = ({ isOpen, onClose, categories }: MegaMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={onClose}
            className="fixed inset-0 top-20 bg-slate-900/5 backdrop-blur-[2px] z-[90]"
          />
          
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-[1400px] z-[100] px-6 lg:px-20"
          >
            <div 
              className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden relative"
              onMouseLeave={onClose}
            >
              {/* Stripe-like highlight bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />
              
              <div className="p-12">
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(5, Math.max(2, categories.length))} gap-10`}>
                  {categories.map((category) => (
                    <div key={category.title} className="space-y-6">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        {category.title}
                        <div className="h-px bg-slate-100 flex-1" />
                      </h4>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <Link
                            key={item.id}
                            to={item.path}
                            onClick={onClose}
                            className="group flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-all duration-300"
                          >
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 group-hover:scale-110 transition-all shadow-sm">
                              <item.icon size={18} />
                            </div>
                            <div className="space-y-1">
                              <div className="text-[13px] font-bold text-slate-900 flex items-center gap-1">
                                {item.title}
                                <ChevronRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" />
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mega Menu Footer Actions */}
              <div className="bg-slate-50 border-t border-slate-100/50 p-8 flex justify-between items-center px-12">
                 <div className="flex gap-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                       API Status: Optimal
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                       Node Sync: Priority-Alpha
                    </div>
                 </div>
                 <Link 
                    to="/marketing/resources" 
                    onClick={onClose}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-2 transition-all group"
                 >
                    View All Case Studies
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
