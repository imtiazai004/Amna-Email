import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  School, 
  ChevronRight, 
  ChevronDown, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MegaMenu } from '@/components/landing/MegaMenu';
import { FEATURE_CATEGORIES } from '@/constants/features';
import { 
  SOLUTIONS_NAV, 
  DEVELOPERS_NAV, 
  RESOURCES_NAV, 
  PRICING_NAV 
} from '@/constants/mega-menu';

interface NavbarProps {
  onLogin: () => void;
  onRequestAccess?: () => void;
  transparent?: boolean;
}

export const Navbar = ({ onLogin, onRequestAccess, transparent = false }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { scrollY } = useScroll();
  
  const headerBg = useTransform(
    scrollY, 
    [0, 50], 
    [transparent ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.95)']
  );
  
  const headerBorder = useTransform(
    scrollY, 
    [0, 50], 
    ['rgba(255, 255, 255, 0)', 'rgba(0, 0, 0, 0.05)']
  );

  return (
    <>
      <motion.nav 
        style={{ backgroundColor: headerBg, borderBottom: `1px solid ${headerBorder}` }}
        className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md transition-all h-20 flex items-center px-6 lg:px-20 justify-between"
      >
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-indigo-600 text-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
              <School size={24} />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">EduFlow</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {[
              { id: 'features', label: 'Features', categories: FEATURE_CATEGORIES },
              { id: 'solutions', label: 'Solutions', categories: SOLUTIONS_NAV },
              { id: 'developers', label: 'Developers', categories: DEVELOPERS_NAV },
              { id: 'resources', label: 'Resources', categories: RESOURCES_NAV },
              { id: 'pricing', label: 'Pricing', categories: PRICING_NAV }
            ].map((nav) => (
              <div 
                key={nav.id}
                className="relative py-4"
                onMouseEnter={() => setActiveMenu(nav.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button className={cn(
                  "flex items-center gap-1.5 text-[13px] font-bold transition-colors uppercase tracking-widest",
                  activeMenu === nav.id ? "text-indigo-600" : "text-slate-600 hover:text-slate-900"
                )}>
                  {nav.label}
                  <ChevronDown size={14} className={cn("transition-transform duration-300", activeMenu === nav.id && "rotate-180")} />
                </button>
                <MegaMenu 
                  isOpen={activeMenu === nav.id} 
                  onClose={() => setActiveMenu(null)} 
                  categories={nav.categories} 
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors"
          >
            Sign in <ChevronRight size={16} />
          </button>
          <button 
            onClick={onRequestAccess || onLogin}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Request Access
          </button>
          <button className="lg:hidden p-2 text-slate-600 z-[110]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 bg-white z-[100] lg:hidden pt-24 px-6 overflow-y-auto"
            >
              <div className="space-y-8 pb-20">
                {FEATURE_CATEGORIES.map((category) => (
                  <div key={category.title} className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category.title}</h4>
                    <div className="grid gap-2">
                       {category.items.map((item) => (
                         <Link 
                           key={item.id} 
                           to={item.path} 
                           onClick={() => setMobileMenuOpen(false)}
                           className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"
                         >
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                             <item.icon size={18} />
                           </div>
                           <div>
                             <div className="text-sm font-bold">{item.title}</div>
                             <div className="text-[10px] text-slate-500 font-medium">{item.description}</div>
                           </div>
                         </Link>
                       ))}
                    </div>
                  </div>
                ))}
                
                {/* Marketing Sections in Mobile */}
                <div className="pt-8 border-t border-slate-100 flex flex-col gap-4">
                  {['Solutions', 'Developers', 'Resources', 'Pricing'].map(item => (
                    <Link 
                      key={item} 
                      to={`/marketing/${item.toLowerCase()}`} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-black uppercase italic tracking-tighter text-slate-400 hover:text-indigo-600 transition-colors px-4"
                    >
                      {item}
                    </Link>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-4">
                  <button onClick={onLogin} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-600/20 shadow-indigo-600/20">Launch Demo</button>
                  <button onClick={onRequestAccess || onLogin} className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-xs">Request Access</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};
